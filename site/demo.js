(() => {
  const STREAMS = [
    { id: "yt", label: "YouTube",    icon: "▶", hue: "#ff3040", title: "lo-fi study beats",       playing: true  },
    { id: "tw", label: "Twitch",     icon: "◉", hue: "#9146ff", title: "speedrun any% WR",        playing: true  },
    { id: "sp", label: "Spotify",    icon: "♫", hue: "#1db954", title: "Daily Mix 3",             playing: true  },
    { id: "sc", label: "SoundCloud", icon: "☁", hue: "#ff5500", title: "unreleased demo.wav",     playing: false },
  ];

  // Bar animation offsets so they don't all bounce in sync
  const BAR_DELAYS = [
    ["0s","0.15s","0.07s","0.22s","0.12s"],
    ["0.1s","0s","0.18s","0.05s","0.2s"],
    ["0.08s","0.2s","0s","0.14s","0.06s"],
    ["0.18s","0.06s","0.12s","0s","0.16s"],
  ];
  const BAR_DURATIONS = [
    ["0.6s","0.8s","0.7s","0.55s","0.75s"],
    ["0.7s","0.6s","0.85s","0.65s","0.9s"],
    ["0.8s","0.7s","0.6s","0.75s","0.65s"],
    ["0.65s","0.9s","0.7s","0.8s","0.6s"],
  ];

  function makeBars(idx, hue) {
    return BAR_DELAYS[idx].map((delay, i) =>
      `<span style="--hue:${hue}; background:${hue}; animation-delay:${delay}; --d:${BAR_DURATIONS[idx][i]}"></span>`
    ).join("");
  }

  const root = document.getElementById("freeze-demo");
  if (!root) return;

  let frozen = false;

  root.innerHTML = `
    <div class="browser" aria-label="Interactive Freeze demo">
      <div class="b-toolbar">
        <div class="traffic"><span></span><span></span><span></span></div>
        <div class="tab-strip">
          ${STREAMS.map(s => `
            <button class="b-tab ${s.playing ? "playing" : "idle"}" data-tab="${s.id}">
              <span class="b-tab-dot" style="--hue:${s.hue}"></span>
              ${s.label}
            </button>`).join("")}
        </div>
        <button class="b-freeze" type="button" aria-pressed="false">
          <span>❄</span><span class="b-freeze-label">Freeze</span>
        </button>
      </div>
      <div class="b-body">
        <div class="frost" aria-hidden="true"></div>
        <div class="snowfield" aria-hidden="true"></div>
        <div class="players">
          ${STREAMS.map((s, i) => `
            <article class="player ${s.playing ? "playing" : "idle"}" data-player="${s.id}" data-fp="0">
              <div class="p-head">
                <span class="p-icon" style="--hue:${s.hue}">${s.icon}</span>
                <span class="p-title">${s.title}</span>
                <span class="p-state">${s.playing ? "live" : "paused"}</span>
              </div>
              <div class="p-screen">
                <div class="bars" style="--hue:${s.hue}">${makeBars(i, s.hue)}</div>
                <div class="p-progress"><span style="--hue:${s.hue}"></span></div>
              </div>
            </article>`).join("")}
        </div>
        <p class="b-status" aria-live="polite"></p>
      </div>
    </div>
    <p class="demo-tip">Click <strong>Freeze</strong> in the toolbar — or pause a stream first. Thaw resumes only what Freeze stopped.</p>
  `;

  const btn     = root.querySelector(".b-freeze");
  const label   = root.querySelector(".b-freeze-label");
  const status  = root.querySelector(".b-status");
  const players = [...root.querySelectorAll(".player")];
  const tabs    = [...root.querySelectorAll(".b-tab")];
  const snow    = root.querySelector(".snowfield");

  // Spawn snowflakes
  for (let i = 0; i < 22; i++) {
    const f = document.createElement("span");
    f.className = "snow";
    f.textContent = "❄";
    f.style.cssText = `left:${Math.random()*100}%;font-size:${7+Math.random()*9}px;`
      + `animation-duration:${3.5+Math.random()*5}s;animation-delay:${Math.random()*4}s;`
      + `opacity:${0.25+Math.random()*0.55}`;
    snow.appendChild(f);
  }

  function syncTab(id) {
    const p = players.find(p => p.dataset.player === id);
    const t = tabs.find(t => t.dataset.tab === id);
    if (!t || !p) return;
    const on = p.classList.contains("playing");
    t.classList.toggle("playing", on);
    t.classList.toggle("idle", !on);
  }

  function refreshStatus() {
    const playing = players.filter(p => p.classList.contains("playing")).length;
    const fpCount = players.filter(p => p.dataset.fp === "1").length;
    status.textContent = frozen
      ? `❄ ${fpCount} stream${fpCount !== 1 ? "s" : ""} frozen across 4 tabs`
      : `${playing} stream${playing !== 1 ? "s" : ""} playing · 4 tabs`;
  }

  function freeze() {
    frozen = true;
    root.classList.add("is-frozen");
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    label.textContent = "Thaw";

    players.forEach(p => {
      if (p.classList.contains("playing")) {
        p.dataset.fp = "1";
        p.classList.remove("playing");
        p.classList.add("fp");
        p.querySelector(".p-state").textContent = "frozen";
      }
    });
    tabs.forEach(t => {
      const p = players.find(p => p.dataset.player === t.dataset.tab);
      t.classList.toggle("playing", p?.classList.contains("playing") ?? false);
      t.classList.toggle("idle", !(p?.classList.contains("playing") ?? false));
    });
    refreshStatus();
  }

  function thaw() {
    frozen = false;
    root.classList.remove("is-frozen");
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
    label.textContent = "Freeze";

    players.forEach(p => {
      if (p.dataset.fp === "1") {
        p.dataset.fp = "0";
        p.classList.remove("fp");
        p.classList.add("playing");
        p.querySelector(".p-state").textContent = "live";
      }
    });
    tabs.forEach(t => syncTab(t.dataset.tab));
    refreshStatus();
  }

  btn.addEventListener("click", () => frozen ? thaw() : freeze());

  // Click a player to manually toggle it (shows "respects your state")
  players.forEach(p => {
    p.addEventListener("click", () => {
      if (frozen) return;
      const stateEl = p.querySelector(".p-state");
      if (p.classList.contains("playing")) {
        p.classList.remove("playing");
        p.classList.add("idle");
        p.dataset.fp = "0";
        stateEl.textContent = "paused";
      } else {
        p.classList.remove("idle");
        p.classList.add("playing");
        stateEl.textContent = "live";
      }
      syncTab(p.dataset.player);
      refreshStatus();
    });
  });

  refreshStatus();
})();
