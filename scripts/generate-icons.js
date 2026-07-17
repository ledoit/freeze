// Generates Freeze toolbar icons as PNGs with zero dependencies.
// Draws a white snowflake on a rounded-square background:
//   - idle set  (freeze-*.png):  slate-gray background
//   - frozen set (frozen-*.png): bright ice-blue background
//
// Run: node scripts/generate-icons.js

const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const SIZES = [16, 32, 48, 128];
const OUT_DIR = path.join(__dirname, "..", "icons");

const PALETTE = {
  freeze: { r: 0x6b, g: 0x72, b: 0x80 }, // slate gray (idle)
  frozen: { r: 0x2e, g: 0x8b, b: 0xff }, // ice blue (active)
};

// ---- tiny PNG encoder (8-bit RGBA) ---------------------------------------
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

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- drawing helpers ------------------------------------------------------
function blend(rgba, x, y, w, h, r, g, b, a) {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const i = (y * w + x) * 4;
  const inv = 1 - a;
  rgba[i] = Math.round(r * a + rgba[i] * inv);
  rgba[i + 1] = Math.round(g * a + rgba[i + 1] * inv);
  rgba[i + 2] = Math.round(b * a + rgba[i + 2] * inv);
  rgba[i + 3] = Math.round(255 * a + rgba[i + 3] * inv);
}

// signed coverage of a rounded rectangle (positive inside), for AA edges
function roundedRectCoverage(px, py, w, h, margin, radius) {
  const x0 = margin;
  const y0 = margin;
  const x1 = w - margin;
  const y1 = h - margin;
  const cx = Math.min(Math.max(px, x0 + radius), x1 - radius);
  const cy = Math.min(Math.max(py, y0 + radius), y1 - radius);
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return radius - dist; // >0 inside
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}

function snowflakeSegments(size) {
  const c = size / 2;
  const arm = size * 0.34;
  const segs = [];
  for (let k = 0; k < 6; k++) {
    const ang = (k * Math.PI) / 3;
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const tipX = c + arm * dx;
    const tipY = c + arm * dy;
    segs.push([c, c, tipX, tipY]);
    // two pairs of branches along each arm
    for (const at of [0.5, 0.78]) {
      const bx = c + arm * at * dx;
      const by = c + arm * at * dy;
      const blen = arm * 0.28;
      for (const off of [Math.PI / 3, -Math.PI / 3]) {
        const a2 = ang + off;
        segs.push([bx, by, bx + blen * Math.cos(a2), by + blen * Math.sin(a2)]);
      }
    }
  }
  return segs;
}

function renderIcon(size, bg) {
  const rgba = Buffer.alloc(size * size * 4); // transparent
  const margin = Math.max(1, size * 0.06);
  const radius = size * 0.24;
  const segs = snowflakeSegments(size);
  const lineHalf = Math.max(0.75, size * 0.045);
  const aa = Math.max(0.75, size / 32); // AA falloff width in px

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const cov = roundedRectCoverage(px, py, size, size, margin, radius);
      if (cov <= -aa) continue;
      const bgA = Math.min(1, Math.max(0, (cov + aa) / (2 * aa)));
      blend(rgba, x, y, size, size, bg.r, bg.g, bg.b, bgA);

      let dmin = Infinity;
      for (const s of segs) {
        const d = distToSegment(px, py, s[0], s[1], s[2], s[3]);
        if (d < dmin) dmin = d;
      }
      const flakeA = Math.min(1, Math.max(0, (lineHalf + aa / 2 - dmin) / aa));
      if (flakeA > 0) blend(rgba, x, y, size, size, 255, 255, 255, flakeA * bgA);
    }
  }
  return rgba;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const [name, bg] of Object.entries(PALETTE)) {
  for (const size of SIZES) {
    const png = encodePNG(size, size, renderIcon(size, bg));
    const file = path.join(OUT_DIR, `${name}-${size}.png`);
    fs.writeFileSync(file, png);
    console.log(`wrote ${path.relative(path.join(__dirname, ".."), file)} (${png.length} bytes)`);
  }
}
