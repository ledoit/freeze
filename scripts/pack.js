// Packs the extension into dist/freeze.zip (source only, no dev files).
// Zero dependencies: writes a STORED (uncompressed) zip, which Brave/Chrome
// load fine. Run: node scripts/pack.js

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "freeze.zip");
const UNPACKED = path.join(DIST, "freeze-unpacked");

const INCLUDE = ["manifest.json", "src", "icons"];

function walk(rel, acc) {
  const abs = path.join(ROOT, rel);
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(abs).sort()) walk(path.join(rel, name), acc);
  } else {
    acc.push(rel.split(path.sep).join("/"));
  }
  return acc;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(files) {
  const locals = [];
  const central = [];
  let offset = 0;

  for (const name of files) {
    const data = fs.readFileSync(path.join(ROOT, name));
    const comp = zlib.deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const nameBuf = Buffer.from(name, "utf8");

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, comp);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0, 8);
    cen.writeUInt16LE(8, 10);
    cen.writeUInt16LE(0, 12);
    cen.writeUInt16LE(0, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(comp.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);

    offset += local.length + nameBuf.length + comp.length;
  }

  const centralBuf = Buffer.concat(central);
  const localBuf = Buffer.concat(locals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(localBuf.length, 16);
  return Buffer.concat([localBuf, centralBuf, end]);
}

const files = [];
for (const entry of INCLUDE) walk(entry, files);
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(OUT, buildZip(files));
fs.rmSync(UNPACKED, { recursive: true, force: true });
for (const file of files) {
  const destination = path.join(UNPACKED, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(ROOT, file), destination);
}
const SITE_ZIP = path.join(ROOT, "site", "freeze.zip");
fs.mkdirSync(path.dirname(SITE_ZIP), { recursive: true });
fs.copyFileSync(OUT, SITE_ZIP);
console.log(`packed ${files.length} files -> ${path.relative(ROOT, OUT)}`);
console.log(`copied unpacked extension -> ${path.relative(ROOT, UNPACKED)}`);
console.log(`copied -> ${path.relative(ROOT, SITE_ZIP)}`);
