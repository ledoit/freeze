const status = document.querySelector("#status");
const toggle = document.querySelector("#toggle");
const toggleIcon = toggle.querySelector(".button-icon");
const toggleLabel = document.querySelector("#toggle-label");
const toggleDetail = document.querySelector("#toggle-detail");
const rewind = document.querySelector("#rewind");
const rewindLabel = document.querySelector("#rewind-label");
const volume = document.querySelector("#volume");
const volumeValue = document.querySelector("#volume-value");

function send(type, extra = {}) {
  return chrome.runtime.sendMessage({ type, ...extra });
}

function renderVolume(level = 1) {
  const pct = Math.round(Math.min(1, Math.max(0, Number(level) || 0)) * 100);
  volume.value = String(pct);
  volumeValue.textContent = `${pct}%`;
}

function renderState(frozen, count = 0, level) {
  toggle.disabled = false;
  toggle.classList.toggle("frozen", frozen);
  toggleIcon.textContent = frozen ? "▶" : "Ⅱ";
  toggleLabel.textContent = frozen ? "Thaw all" : "Freeze all";
  toggleDetail.textContent = frozen
    ? "Resume only what Freeze paused"
    : "Pause media in every tab";
  status.textContent = frozen
    ? `${count} media item${count === 1 ? "" : "s"} held`
    : "All tabs are live";
  if (typeof level === "number") renderVolume(level);
}

async function loadState() {
  try {
    const result = await send("GET_STATE");
    if (result?.error) throw new Error(result.error);
    renderState(Boolean(result?.frozen), result?.tagged || 0, result?.volume);
  } catch (_) {
    status.textContent = "Could not inspect tabs";
    toggle.disabled = false;
  }
}

toggle.addEventListener("click", async () => {
  toggle.disabled = true;
  status.textContent = "Working across tabs…";
  try {
    const result = await send("TOGGLE_FREEZE");
    if (result?.error) throw new Error(result.error);
    renderState(result.frozen, result.count || 0, result.volume);
  } catch (_) {
    status.textContent = "Action failed — try reloading the extension";
    toggle.disabled = false;
  }
});

rewind.addEventListener("click", async () => {
  rewind.disabled = true;
  try {
    const result = await send("REWIND_ALL");
    if (result?.error) throw new Error(result.error);
    rewindLabel.textContent = `${result.rewound || 0} reset to 0:00`;
  } catch (_) {
    rewindLabel.textContent = "Rewind failed";
  }
  window.setTimeout(() => {
    rewindLabel.textContent = "Back to 0:00";
    rewind.disabled = false;
  }, 1600);
});

let volumeTimer = 0;
volume.addEventListener("input", () => {
  renderVolume(Number(volume.value) / 100);
  window.clearTimeout(volumeTimer);
  volumeTimer = window.setTimeout(async () => {
    try {
      await send("SET_VOLUME", { volume: Number(volume.value) / 100 });
    } catch (_) {
      status.textContent = "Volume update failed";
    }
  }, 40);
});

loadState();
