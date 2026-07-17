// Freeze — one-click pause/resume of media across every open tab.
// MV3 service worker. No popup: the toolbar button itself is the toggle.

const IDLE_ICONS = {
  16: "icons/freeze-16.png",
  32: "icons/freeze-32.png",
  48: "icons/freeze-48.png",
  128: "icons/freeze-128.png",
};

const FROZEN_ICONS = {
  16: "icons/frozen-16.png",
  32: "icons/frozen-32.png",
  48: "icons/frozen-48.png",
  128: "icons/frozen-128.png",
};

const FROZEN_COLOR = "#2E8BFF";

// Injected into every frame of every tab. Must be fully self-contained: it is
// serialized and executed in the page, so it cannot close over anything here.
function toggleFreezeInPage(freeze) {
  const MARK = "freezePaused"; // element.dataset.freezePaused = "1"
  let touched = 0;

  if (freeze) {
    const media = document.querySelectorAll("video, audio");
    media.forEach((el) => {
      try {
        if (!el.paused && !el.ended && el.currentTime > 0) {
          el.dataset[MARK] = "1";
          el.pause();
          touched++;
        }
      } catch (_) {
        /* cross-origin or detached media element */
      }
    });
  } else {
    const media = document.querySelectorAll('[data-freeze-paused="1"]');
    media.forEach((el) => {
      try {
        delete el.dataset[MARK];
        const p = el.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        touched++;
      } catch (_) {
        /* autoplay policy or detached media element */
      }
    });
  }

  return touched;
}

async function applyToAllTabs(freeze) {
  const tabs = await chrome.tabs.query({});
  const runs = tabs.map((tab) => {
    if (tab.id == null) return Promise.resolve([]);
    return chrome.scripting
      .executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: toggleFreezeInPage,
        args: [freeze],
      })
      .catch(() => []); // restricted pages (chrome://, web store, etc.)
  });

  const results = await Promise.allSettled(runs);
  let count = 0;
  for (const r of results) {
    if (r.status !== "fulfilled" || !Array.isArray(r.value)) continue;
    for (const frame of r.value) {
      if (frame && typeof frame.result === "number") count += frame.result;
    }
  }
  return count;
}

async function reflectState(frozen, count) {
  await chrome.action.setIcon({ path: frozen ? FROZEN_ICONS : IDLE_ICONS });
  await chrome.action.setBadgeBackgroundColor({ color: FROZEN_COLOR });
  await chrome.action.setBadgeText({ text: frozen ? "❄" : "" });
  await chrome.action.setTitle({
    title: frozen
      ? `Freeze — ${count} item(s) paused. Click to resume.`
      : "Freeze — click to pause all media in every tab.",
  });
}

let busy = false;

chrome.action.onClicked.addListener(async () => {
  if (busy) return; // ignore rapid double-clicks mid-toggle
  busy = true;
  try {
    const { frozen = false } = await chrome.storage.local.get("frozen");
    const next = !frozen;
    const count = await applyToAllTabs(next);
    await chrome.storage.local.set({ frozen: next });
    await reflectState(next, count);
  } finally {
    busy = false;
  }
});

// Start from a clean, thawed state on install and on browser startup.
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ frozen: false });
  await reflectState(false, 0);
});

chrome.runtime.onStartup.addListener(async () => {
  await chrome.storage.local.set({ frozen: false });
  await reflectState(false, 0);
});
