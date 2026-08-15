const status = document.querySelector("#status");
const toggle = document.querySelector("#toggle");
const toggleIcon = toggle.querySelector(".button-icon");
const toggleLabel = document.querySelector("#toggle-label");
const toggleDetail = document.querySelector("#toggle-detail");
const rewind = document.querySelector("#rewind");
const rewindLabel = document.querySelector("#rewind-label");

function send(type) {
  return chrome.runtime.sendMessage({ type });
}

function renderState(frozen, count = 0) {
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
}

async function loadState() {
  try {
    const result = await send("GET_STATE");
    if (result?.error) throw new Error(result.error);
    renderState(Boolean(result?.frozen), result?.tagged || 0);
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
    renderState(result.frozen, result.count || 0);
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

loadState();
