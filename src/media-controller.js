// Serialized into page frames by src/background.js. Keep this function fully
// self-contained: executeScript cannot preserve service-worker closures.
function controlMediaInPage(payload) {
  const action = typeof payload === "string" ? payload : payload?.action;
  const volumeRaw = typeof payload === "object" && payload ? payload.volume : null;
  const volume =
    typeof volumeRaw === "number" && Number.isFinite(volumeRaw)
      ? Math.min(1, Math.max(0, volumeRaw))
      : null;

  const MARK = "freezePaused";
  const CONTROLLER = "__freezeController";
  const VOLUME = "__freezeVolume";
  let touched = 0;

  const allMedia = () => document.querySelectorAll("video, audio");

  const applyVolume = (el, level) => {
    if (!(el instanceof HTMLMediaElement) || typeof level !== "number") return;
    try {
      el.volume = level;
      el.muted = level === 0;
    } catch (_) {
      /* detached or inaccessible media element */
    }
  };

  const ensureVolumeController = (level) => {
    let controller = window[VOLUME];
    if (!controller) {
      const onPlay = (event) => applyVolume(event.target, controller.level);
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (!(node instanceof Element)) continue;
            if (node.matches("video, audio")) applyVolume(node, controller.level);
            node.querySelectorAll?.("video, audio").forEach((el) =>
              applyVolume(el, controller.level)
            );
          }
        }
      });
      controller = { level, onPlay, observer };
      window[VOLUME] = controller;
      document.addEventListener("play", onPlay, true);
      observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
      });
    }
    controller.level = level;
    allMedia().forEach((el) => applyVolume(el, level));
  };

  const pauseIfPlaying = (el) => {
    if (!(el instanceof HTMLMediaElement)) return;
    try {
      // A freshly-started video may still be at 0:00. Playing state, not
      // currentTime, determines whether Freeze should pause it.
      if (!el.paused && !el.ended) {
        el.dataset[MARK] = "1";
        el.pause();
        touched++;
      }
    } catch (_) {
      /* detached or inaccessible media element */
    }
  };

  if (typeof volume === "number") ensureVolumeController(volume);

  if (action === "freeze") {
    let controller = window[CONTROLLER];
    if (!controller) {
      const onPlay = (event) => {
        if (controller.frozen) pauseIfPlaying(event.target);
      };
      const observer = new MutationObserver((records) => {
        if (!controller.frozen) return;
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (!(node instanceof Element)) continue;
            if (node.matches("video, audio")) pauseIfPlaying(node);
            node.querySelectorAll?.("video, audio").forEach(pauseIfPlaying);
          }
        }
      });
      controller = { frozen: true, onPlay, observer };
      window[CONTROLLER] = controller;
      document.addEventListener("play", onPlay, true);
      observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
      });
    }
    controller.frozen = true;
    allMedia().forEach(pauseIfPlaying);
  } else if (action === "thaw") {
    const controller = window[CONTROLLER];
    if (controller) {
      controller.frozen = false;
      document.removeEventListener("play", controller.onPlay, true);
      controller.observer.disconnect();
      delete window[CONTROLLER];
    }

    document.querySelectorAll('[data-freeze-paused="1"]').forEach((el) => {
      try {
        delete el.dataset[MARK];
        const playAttempt = el.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(() => {});
        }
        touched++;
      } catch (_) {
        /* autoplay policy or detached media element */
      }
    });
  } else if (action === "rewind") {
    allMedia().forEach((el) => {
      try {
        // Browsers queue this seek for normal media; live/non-seekable streams
        // throw and are skipped without affecting the other tabs.
        el.currentTime = 0;
        touched++;
      } catch (_) {
        /* live stream, inaccessible seek range, or detached element */
      }
    });
  } else if (action === "volume") {
    touched = allMedia().length;
  }

  return {
    touched,
    tagged: document.querySelectorAll('[data-freeze-paused="1"]').length,
    playing: [...allMedia()].filter((el) => !el.paused && !el.ended).length,
    controllerActive: Boolean(window[CONTROLLER]?.frozen),
  };
}
