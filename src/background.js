// Freeze — reliable pause/resume and rewind across every open tab.
// MV3 service worker; actions arrive from the popup or keyboard shortcuts.

importScripts("media-controller.js");

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

async function runInTabs(action, tabIds = null) {
  const tabs = tabIds
    ? tabIds.map((id) => ({ id }))
    : await chrome.tabs.query({});
  const runs = tabs.map((tab) => {
    if (tab.id == null) return Promise.resolve([]);
    return chrome.scripting
      .executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: controlMediaInPage,
        args: [action],
      })
      .catch(() => []); // restricted pages (chrome://, web store, etc.)
  });

  const results = await Promise.allSettled(runs);
  const totals = {
    touched: 0,
    tagged: 0,
    playing: 0,
    activeFrames: 0,
  };
  for (const r of results) {
    if (r.status !== "fulfilled" || !Array.isArray(r.value)) continue;
    for (const frame of r.value) {
      const result = frame?.result;
      if (!result || typeof result !== "object") continue;
      totals.touched += result.touched || 0;
      totals.tagged += result.tagged || 0;
      totals.playing += result.playing || 0;
      if (result.controllerActive) totals.activeFrames++;
    }
  }
  return totals;
}

async function applyReliably(action) {
  const first = await runInTabs(action);
  if (action !== "freeze") return first;

  // A few sites replace their media node while responding to UI/page events.
  // Retry briefly; already-paused elements are ignored, so this is idempotent.
  await new Promise((resolve) => setTimeout(resolve, 160));
  const second = await runInTabs(action);
  await new Promise((resolve) => setTimeout(resolve, 440));
  const third = await runInTabs(action);

  return {
    touched: first.touched + second.touched + third.touched,
    tagged: third.tagged,
    playing: third.playing,
    activeFrames: third.activeFrames,
  };
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

async function getEffectiveState() {
  const { frozen = false } = await chrome.storage.local.get("frozen");
  if (!frozen) return { frozen: false, tagged: 0 };

  // Storage survives service-worker restarts, while page contexts may not.
  // Treat state as thawed if no page still has an active controller or tag.
  const stats = await runInTabs("status");
  const effective = stats.activeFrames > 0 || stats.tagged > 0;
  if (!effective) {
    await chrome.storage.local.set({ frozen: false });
    await reflectState(false, 0);
  }
  return { frozen: effective, tagged: stats.tagged };
}

let operation = Promise.resolve();

function serialize(task) {
  operation = operation.then(task, task);
  return operation;
}

async function toggleFreeze() {
  const state = await getEffectiveState();
  const next = !state.frozen;
  const stats = await applyReliably(next ? "freeze" : "thaw");
  await chrome.storage.local.set({ frozen: next });
  await reflectState(next, next ? stats.tagged : stats.touched);
  return { frozen: next, count: next ? stats.tagged : stats.touched };
}

async function rewindAll() {
  const stats = await runInTabs("rewind");
  return { rewound: stats.touched };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !["GET_STATE", "TOGGLE_FREEZE", "REWIND_ALL"].includes(message.type)) {
    return false;
  }

  const task =
    message.type === "GET_STATE"
      ? getEffectiveState()
      : message.type === "TOGGLE_FREEZE"
        ? serialize(toggleFreeze)
        : serialize(rewindAll);

  task.then(sendResponse).catch((error) => {
    sendResponse({ error: error instanceof Error ? error.message : String(error) });
  });
  return true;
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-freeze") serialize(toggleFreeze);
  if (command === "rewind-all") serialize(rewindAll);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;
  const { frozen = false } = await chrome.storage.local.get("frozen");
  if (frozen) runInTabs("freeze", [tabId]);
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
