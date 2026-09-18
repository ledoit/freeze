(() => {
  const FROZEN_COLOR = "#2E8BFF";
  const IDLE_ICON = "#6b7280";
  const TITLE_IDLE = "Freeze — pause, rewind, or set volume across every tab.";
  const TITLE_FROZEN = (n) =>
    `Freeze — ${n} item(s) paused. Open to thaw only those.`;

  const FLAKE = `
    <svg class="ext-flake" viewBox="0 0 24 24" aria-hidden="true">
      <g transform="translate(12 12)" fill="none" stroke="#fff" stroke-width="1.45" stroke-linecap="round">
        <path d="M0 0v-9.2M-2-5.85 0-4.45l2-1.4" transform="rotate(0)"/>
        <path d="M0 0v-9.2M-2-5.85 0-4.45l2-1.4" transform="rotate(60)"/>
        <path d="M0 0v-9.2M-2-5.85 0-4.45l2-1.4" transform="rotate(120)"/>
        <path d="M0 0v-9.2M-2-5.85 0-4.45l2-1.4" transform="rotate(180)"/>
        <path d="M0 0v-9.2M-2-5.85 0-4.45l2-1.4" transform="rotate(240)"/>
        <path d="M0 0v-9.2M-2-5.85 0-4.45l2-1.4" transform="rotate(300)"/>
      </g>
    </svg>`;

  const SPEAKER = `
    <svg class="tab-speaker" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M2.5 6.2h2.1L7.4 4.1v7.8L4.6 9.8H2.5V6.2zm7.2 1.8a2.3 2.3 0 0 0-1.1-2v4a2.3 2.3 0 0 0 1.1-2z"/>
    </svg>`;

  const YT = `
    <svg class="tab-fav" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="3" fill="#f00"/>
      <path fill="#fff" d="M6.2 4.6v6.8L11.6 8z"/>
    </svg>`;

  const TABS = [
    {
      id: "a",
      title: "Shibuya Crossing at night",
      path: "watch?v=n3kXh1",
      channel: "Night Walks",
      views: "2.1M views · 4 months ago",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      start: 2.4,
      playing: true,
      tape: ["#081018", "#1c3a58"],
    },
    {
      id: "b",
      title: "Onboard: Spa-Francorchamps, wet",
      path: "watch?v=k8Qm24",
      channel: "Circuit Feeds",
      views: "890K views · 1 year ago",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      start: 1.1,
      playing: true,
      tape: ["#1a0808", "#5a1810"],
    },
    {
      id: "c",
      title: "Lecture 4 — Discrete Fourier transform",
      path: "watch?v=p0Lm9c",
      channel: "MIT OpenCourseWare",
      views: "1.4M views · 3 years ago",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      start: 6.2,
      playing: false,
      tape: ["#12141a", "#2a3448"],
    },
  ];

  const root = document.getElementById("freeze-demo");
  if (!root) return;

  root.innerHTML = `
    <div class="chrome" aria-label="Freeze toolbar demo">
      <div class="strip">
        <div class="tabs" role="tablist">
          ${TABS.map((t, i) => `
            <button class="tab${i === 0 ? " is-on" : ""}" type="button" role="tab" data-tab="${t.id}" aria-selected="${i === 0}">
              ${YT}
              <span class="tab-title">${t.title}</span>
              ${SPEAKER}
              <span class="tab-x" aria-hidden="true">×</span>
            </button>`).join("")}
        </div>
        <span class="newtab" aria-hidden="true">+</span>
        <div class="win" aria-hidden="true"><span></span><span></span><span></span></div>
      </div>
      <div class="bar">
        <div class="nav" aria-hidden="true">
          <span class="nav-btn">
            <svg viewBox="0 0 16 16"><path fill="currentColor" d="M10.2 3.2 5.4 8l4.8 4.8.9-.9L7.2 8l3.9-3.9z"/></svg>
          </span>
          <span class="nav-btn is-off">
            <svg viewBox="0 0 16 16"><path fill="currentColor" d="M5.8 3.2 10.6 8 5.8 12.8l-.9-.9L8.8 8 4.9 4.1z"/></svg>
          </span>
          <span class="nav-btn">
            <svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 3.2a4.8 4.8 0 1 1-4.5 3.2h1.3A3.6 3.6 0 1 0 8 4.4V6L10.4 3.6 8 1.2V3.2z"/></svg>
          </span>
        </div>
        <div class="omni">
          <span class="lock" aria-hidden="true">
            <svg viewBox="0 0 12 12"><path fill="currentColor" d="M6 1.4A2.1 2.1 0 0 0 3.9 3.5V4.2H3v6.4h6V4.2H7.9V3.5A2.1 2.1 0 0 0 6 1.4zm0 1.2c.5 0 .9.4.9.9v.7H5.1V3.5c0-.5.4-.9.9-.9z"/></svg>
          </span>
          <span class="omni-url">youtube.com/${TABS[0].path}</span>
        </div>
        <div class="exts">
          <span class="puzzle" aria-hidden="true" title="Extensions">
            <svg viewBox="0 0 16 16"><path fill="currentColor" d="M6.2 2.2v1.5H4.4A1.2 1.2 0 0 0 3.2 4.9v1.8H1.8v2.6h1.4v1.8A1.2 1.2 0 0 0 4.4 12.3h1.8v1.5h2.6v-1.5h1.8a1.2 1.2 0 0 0 1.2-1.2V9.3h1.4V6.7h-1.4V4.9a1.2 1.2 0 0 0-1.2-1.2H8.8V2.2H6.2z"/></svg>
          </span>
          <button class="ext is-open" type="button" aria-pressed="false" aria-expanded="true" aria-label="${TITLE_IDLE}">
            <span class="ext-mark">${FLAKE}</span>
            <span class="ext-badge">❄</span>
          </button>
        </div>
      </div>
      <div class="stage">
        ${TABS.map((t, i) => `
          <article class="watch${i === 0 ? " is-on" : ""}" data-pane="${t.id}">
            <div class="player">
              <video data-id="${t.id}" playsinline muted loop preload="${t.playing ? "auto" : "metadata"}"></video>
              <button class="bigplay" type="button" aria-label="Play">
                <svg viewBox="0 0 24 24"><path fill="#fff" d="M8 5.2v13.6L19.2 12z"/></svg>
              </button>
              <div class="ctrl">
                <button class="c-play" type="button" aria-label="Play">
                  <svg class="i-play" viewBox="0 0 16 16"><path fill="currentColor" d="M4.2 2.4v11.2L13.4 8z"/></svg>
                  <svg class="i-pause" viewBox="0 0 16 16"><path fill="currentColor" d="M3.4 2.4h3.2v11.2H3.4zm6 0h3.2v11.2H9.4z"/></svg>
                </button>
                <span class="c-vol" aria-hidden="true">
                  <svg viewBox="0 0 16 16"><path fill="currentColor" d="M2.2 6.2h2.1L7 4.2v7.6L4.3 9.8H2.2V6.2zm8.6 4.7-1-1A3.4 3.4 0 0 0 10.6 8a3.4 3.4 0 0 0-.8-1.9l1-1A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1-1.2 2.9zM8.4 3.4l1 1A5.6 5.6 0 0 0 8 8a5.6 5.6 0 0 0 1.4 3.6l-1 1A7 7 0 0 1 6.8 8a7 7 0 0 1 1.6-4.6z"/><path fill="currentColor" d="m2.2 2.2 11.6 11.6-.8.8L1.4 3z"/></svg>
                </span>
                <span class="c-time"><span class="t-now">0:00</span> / <span class="t-end">0:00</span></span>
                <span class="scrub"><span class="scrub-fill"></span></span>
              </div>
            </div>
            <h2 class="v-title">${t.title}</h2>
            <div class="v-row">
              <span class="avatar" aria-hidden="true">${t.channel.slice(0, 1)}</span>
              <div>
                <p class="v-ch">${t.channel}</p>
                <p class="v-meta">${t.views}</p>
              </div>
            </div>
          </article>`).join("")}
      </div>
      <aside class="ext-popup" aria-label="Freeze popup">
        <header>
          <span class="popup-mark" aria-hidden="true">❄</span>
          <div>
            <h3>Freeze</h3>
            <p class="popup-status">All tabs are live</p>
          </div>
        </header>
        <div class="popup-main">
          <button class="popup-toggle primary" type="button">
            <span class="button-icon" aria-hidden="true">Ⅱ</span>
            <span>
              <strong class="toggle-label">Freeze all</strong>
              <small class="toggle-detail">Pause media in every tab</small>
            </span>
          </button>
          <button class="popup-rewind secondary" type="button">
            <span class="button-icon" aria-hidden="true">↤</span>
            <span>
              <strong class="rewind-label">Back to 0:00</strong>
              <small>Rewind all reachable media</small>
            </span>
          </button>
          <label class="popup-volume">
            <span class="volume-copy">
              <strong>All-tabs volume</strong>
              <small class="volume-value">100%</small>
            </span>
            <input class="volume-slider" type="range" min="0" max="100" value="100" />
          </label>
        </div>
        <footer>
          <span>Local only</span>
          <span>Alt+Shift+F · Alt+Shift+0</span>
        </footer>
      </aside>
    </div>
  `;

  const ext = root.querySelector(".ext");
  const badge = root.querySelector(".ext-badge");
  const mark = root.querySelector(".ext-mark");
  const omni = root.querySelector(".omni-url");
  const tabBtns = [...root.querySelectorAll(".tab")];
  const panes = [...root.querySelectorAll(".watch")];
  const videos = [...root.querySelectorAll("video")];
  const popup = root.querySelector(".ext-popup");
  const toggleBtn = popup.querySelector(".popup-toggle");
  const toggleIcon = toggleBtn.querySelector(".button-icon");
  const toggleLabel = popup.querySelector(".toggle-label");
  const toggleDetail = popup.querySelector(".toggle-detail");
  const statusEl = popup.querySelector(".popup-status");
  const rewindBtn = popup.querySelector(".popup-rewind");
  const rewindLabel = popup.querySelector(".rewind-label");
  const volumeSlider = popup.querySelector(".volume-slider");
  const volumeValue = popup.querySelector(".volume-value");

  let frozen = false;
  let busy = false;
  let volumeLevel = 1;
  let volumeUnlocked = false;
  let active = TABS[0].id;

  mark.style.background = IDLE_ICON;
  badge.hidden = true;

  function fmt(t) {
    if (!Number.isFinite(t) || t < 0) t = 0;
    const s = Math.floor(t);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  }

  function taggedCount() {
    return videos.filter((el) => el.dataset.freezePaused === "1").length;
  }

  function paneFor(id) {
    return panes.find((p) => p.dataset.pane === id);
  }

  function videoFor(id) {
    return videos.find((v) => v.dataset.id === id);
  }

  function applyVolume(el, level) {
    try {
      el.volume = level;
      // Keep muted until the user moves the slider so autoplay is allowed.
      el.muted = volumeUnlocked ? level === 0 : true;
    } catch (_) { /* ignore */ }
  }

  function syncTab(id) {
    const btn = tabBtns.find((b) => b.dataset.tab === id);
    const vid = videoFor(id);
    if (!btn || !vid) return;
    btn.classList.toggle("is-playing", !vid.paused && !vid.ended);
  }

  function paintPane(id) {
    const pane = paneFor(id);
    const vid = videoFor(id);
    if (!pane || !vid) return;
    const paused = vid.paused || vid.ended;
    pane.classList.toggle("is-paused", paused);
    const now = pane.querySelector(".t-now");
    const end = pane.querySelector(".t-end");
    const fill = pane.querySelector(".scrub-fill");
    if (now) now.textContent = fmt(vid.currentTime);
    if (end) end.textContent = fmt(vid.duration);
    if (fill) {
      const d = vid.duration;
      const pct = d > 0 && Number.isFinite(d) ? (vid.currentTime / d) * 100 : 0;
      fill.style.width = `${pct}%`;
    }
    syncTab(id);
  }

  function showTab(id) {
    active = id;
    const meta = TABS.find((t) => t.id === id);
    tabBtns.forEach((b) => {
      const on = b.dataset.tab === id;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    panes.forEach((p) => {
      p.classList.toggle("is-on", p.dataset.pane === id);
    });
    if (meta) omni.textContent = `youtube.com/${meta.path}`;
  }

  function renderVolume(level = volumeLevel) {
    volumeLevel = Math.min(1, Math.max(0, Number(level) || 0));
    const pct = Math.round(volumeLevel * 100);
    volumeSlider.value = String(pct);
    volumeValue.textContent = `${pct}%`;
    videos.forEach((el) => applyVolume(el, volumeLevel));
  }

  function reflect(count) {
    root.classList.toggle("is-frozen", frozen);
    ext.classList.toggle("is-frozen", frozen);
    ext.setAttribute("aria-pressed", frozen ? "true" : "false");
    ext.setAttribute("aria-label", frozen ? TITLE_FROZEN(count) : TITLE_IDLE);
    mark.style.background = frozen ? FROZEN_COLOR : IDLE_ICON;
    badge.hidden = !frozen;
    toggleBtn.classList.toggle("frozen", frozen);
    toggleBtn.disabled = false;
    toggleIcon.textContent = frozen ? "▶" : "Ⅱ";
    toggleLabel.textContent = frozen ? "Thaw all" : "Freeze all";
    toggleDetail.textContent = frozen
      ? "Resume only what Freeze paused"
      : "Pause media in every tab";
    statusEl.textContent = frozen
      ? `${count} media item${count === 1 ? "" : "s"} held`
      : "All tabs are live";
  }

  function freeze() {
    let count = 0;
    videos.forEach((el) => {
      try {
        if (!el.paused && !el.ended) {
          el.dataset.freezePaused = "1";
          el.pause();
          count++;
        }
      } catch (_) { /* ignore */ }
    });
    frozen = true;
    reflect(count);
    TABS.forEach((t) => paintPane(t.id));
  }

  function thaw() {
    frozen = false;
    let count = 0;
    videos.forEach((el) => {
      try {
        if (el.dataset.freezePaused === "1") {
          delete el.dataset.freezePaused;
          const p = el.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
          count++;
        }
      } catch (_) { /* ignore */ }
    });
    reflect(count);
    TABS.forEach((t) => paintPane(t.id));
  }

  function rewindAll() {
    let count = 0;
    videos.forEach((el) => {
      try {
        el.currentTime = 0;
        count++;
      } catch (_) { /* ignore */ }
    });
    TABS.forEach((t) => paintPane(t.id));
    return count;
  }

  toggleBtn.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    toggleBtn.disabled = true;
    statusEl.textContent = "Working across tabs…";
    try {
      frozen ? thaw() : freeze();
    } finally {
      busy = false;
    }
  });

  rewindBtn.addEventListener("click", () => {
    rewindBtn.disabled = true;
    const n = rewindAll();
    rewindLabel.textContent = `${n} reset to 0:00`;
    window.setTimeout(() => {
      rewindLabel.textContent = "Back to 0:00";
      rewindBtn.disabled = false;
    }, 1600);
  });

  volumeSlider.addEventListener("input", () => {
    volumeUnlocked = true;
    renderVolume(Number(volumeSlider.value) / 100);
  });

  tabBtns.forEach((b) => {
    b.addEventListener("click", () => showTab(b.dataset.tab));
  });

  function toggleVideo(id) {
    const vid = videoFor(id);
    if (!vid) return;
    if (vid.paused || vid.ended) {
      const p = vid.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      vid.pause();
    }
    paintPane(id);
  }

  panes.forEach((pane) => {
    const id = pane.dataset.pane;
    pane.querySelector(".bigplay")?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVideo(id);
    });
    pane.querySelector(".c-play")?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVideo(id);
    });
    pane.querySelector("video")?.addEventListener("click", () => toggleVideo(id));
  });

  videos.forEach((vid) => {
    const tab = TABS.find((t) => t.id === vid.dataset.id);
    vid.poster = "";
    vid.style.background = `linear-gradient(135deg, ${tab.tape[0]}, ${tab.tape[1]})`;
    applyVolume(vid, volumeLevel);

    const fail = () => attachTape(vid, tab);

    vid.addEventListener("error", fail, { once: true });
    vid.src = tab.src;

    vid.addEventListener("loadeddata", () => {
      try {
        if (tab.start && vid.duration > tab.start) vid.currentTime = tab.start;
      } catch (_) { /* ignore */ }
      if (tab.playing) {
        const p = vid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }, { once: true });

    vid.addEventListener("play", () => {
      applyVolume(vid, volumeLevel);
      if (frozen && !vid.ended) {
        vid.dataset.freezePaused = "1";
        vid.pause();
        reflect(taggedCount());
      }
      paintPane(tab.id);
    });

    ["pause", "timeupdate", "ended", "seeked"].forEach((ev) => {
      vid.addEventListener(ev, () => paintPane(tab.id));
    });
  });

  function attachTape(vid, tab) {
    if (vid.srcObject) return;
    vid.removeAttribute("src");
    vid.load();
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext("2d", { alpha: false });
    let t = 0;
    (function draw() {
      t += 0.016;
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, tab.tape[0]);
      g.addColorStop(1, tab.tape[1]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const x = (Math.sin(t * 0.7) * 0.5 + 0.5) * canvas.width;
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.beginPath();
      ctx.ellipse(x, canvas.height * 0.42, 220, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(draw);
    })();
    try {
      vid.srcObject = canvas.captureStream(24);
    } catch (_) { /* ignore */ }
    if (tab.playing) {
      const p = vid.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }

  TABS.forEach((t) => paintPane(t.id));
  showTab(active);
  reflect(taggedCount());
  renderVolume(1);
})();
