/* Page logic: renders content from data.js and wires up interactions. */
(function () {
  const { S, H } = window.SX;
  const P = window.PROFILE;
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme ---------------- */
  const themeBtn = $("theme-btn");
  function applyTheme(t) {
    if (t === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
  }
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage blocked */ }
  if (!saved && window.matchMedia("(prefers-color-scheme: light)").matches) saved = "light";
  applyTheme(saved);
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  /* ---------------- Hero ---------------- */
  $("hero-eyebrow").textContent = P.eyebrow;
  $("hero-role").textContent = P.role;
  $("hero-summary").textContent = P.summary;
  $("footer-name").textContent = `© ${new Date().getFullYear()} ${P.name}`;
  document.title = `${P.name} · Portfolio`;
  $("hero-stats").innerHTML = P.stats.map((s) => `<div><dt>${s.value}</dt><dd>${s.label}</dd></div>`).join("");

  // typed name
  const nameEl = $("hero-name");
  if (reduce) nameEl.innerHTML = P.name + '<span class="caret"></span>';
  else {
    let i = 0;
    const type = () => {
      nameEl.innerHTML = P.name.slice(0, i) + '<span class="caret"></span>';
      if (i++ < P.name.length) setTimeout(type, 70 + Math.random() * 60);
    };
    setTimeout(type, 300);
  }

  // gear-train drawing
  function gearPath(N, m) {
    const r = (N * m) / 2, ra = r + m, rf = r - 1.25 * m;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2, s = (Math.PI * 2) / N;
      const seq = [[rf, a], [rf, a + s * 0.12], [ra, a + s * 0.30], [ra, a + s * 0.48], [rf, a + s * 0.66], [rf, a + s]];
      seq.forEach(([rad, ang]) => pts.push([rad * Math.cos(ang), rad * Math.sin(ang)]));
    }
    return "M" + pts.map((p) => p.map((v) => v.toFixed(2)).join(" ")).join("L") + "Z";
  }
  const hs = $("hero-svg");
  (function drawHero() {
    const m = 7.5;
    const G = [
      { N: 22, x: 200, y: 300, dir: 1 },
      { N: 13, x: 200 + (22 + 13) * m / 2, y: 300, dir: -1 },
      { N: 9, x: 0, y: 0, dir: 1 },
    ];
    // third gear meshes with the second at an angle
    const c23 = (13 + 9) * m / 2, ang = -Math.PI / 3;
    G[2].x = G[1].x + c23 * Math.cos(ang); G[2].y = G[1].y + c23 * Math.sin(ang);

    // frame
    S("rect", { x: 10, y: 10, width: 500, height: 500, class: "d-thin draw-in", style: "--len:2000" }, hs);
    S("rect", { x: 20, y: 20, width: 480, height: 480, class: "d-thin draw-in", style: "--len:1920" }, hs);
    // title block
    const tb = S("g", { class: "fade-tb" }, hs);
    S("rect", { x: 300, y: 430, width: 200, height: 70, class: "d-thin" }, tb);
    S("line", { x1: 300, y1: 455, x2: 500, y2: 455, class: "d-thin" }, tb);
    S("line", { x1: 400, y1: 455, x2: 400, y2: 500, class: "d-thin" }, tb);
    S("text", { x: 310, y: 447, class: "d-text-strong" }, tb).textContent = "GEAR TRAIN 22 : 13 : 9";
    S("text", { x: 310, y: 472, class: "d-text" }, tb).textContent = "DRAWN";
    S("text", { x: 310, y: 490, class: "d-text-strong" }, tb).textContent = "B. ENEV";
    S("text", { x: 410, y: 472, class: "d-text" }, tb).textContent = "MODULE";
    const rpm = S("text", { x: 410, y: 490, class: "d-text-strong" }, tb);
    rpm.textContent = "m 7.5";

    // centre lines
    G.forEach((g) => {
      const r = (g.N * m) / 2 + m + 14;
      S("line", { x1: g.x - r, y1: g.y, x2: g.x + r, y2: g.y, class: "d-center" }, hs);
      S("line", { x1: g.x, y1: g.y - r, x2: g.x, y2: g.y + r, class: "d-center" }, hs);
    });
    // pitch circles
    G.forEach((g) => S("circle", { cx: g.x, cy: g.y, r: (g.N * m) / 2, class: "d-center" }, hs));

    // gears
    G.forEach((g, i) => {
      g.el = S("g", { transform: `translate(${g.x},${g.y})` }, hs);
      g.rot = S("g", null, g.el);
      const p = S("path", { d: gearPath(g.N, m), class: "d-fill draw-in", style: `--len:${Math.round(g.N * m * 4.5)};animation-delay:${0.3 + i * 0.3}s` }, g.rot);
      p.style.fillOpacity = "0";
      setTimeout(() => { p.style.transition = "fill-opacity 1s"; p.style.fillOpacity = "1"; }, 1800 + i * 300);
      const hub = (g.N * m) / 2 * 0.32;
      S("circle", { r: hub, class: "d-line" }, g.rot);
      S("rect", { x: -3, y: -hub - 4, width: 6, height: 6, class: "d-line" }, g.rot);
      if (g.N > 10) for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4, rr = (g.N * m) / 2 * 0.62;
        S("circle", { cx: rr * Math.cos(a), cy: rr * Math.sin(a), r: (g.N * m) / 2 * 0.16, class: "d-line" }, g.rot);
      }
    });
    // dimension between centres
    const dy = 300 + (22 * m) / 2 + m + 34;
    S("line", { x1: G[0].x, y1: G[0].y + 20, x2: G[0].x, y2: dy + 6, class: "d-dim" }, hs);
    S("line", { x1: G[1].x, y1: G[1].y + 20, x2: G[1].x, y2: dy + 6, class: "d-dim" }, hs);
    S("line", { x1: G[0].x, y1: dy, x2: G[1].x, y2: dy, class: "d-dim" }, hs);
    S("path", { d: `M${G[0].x} ${dy} l8 -4 v8 z M${G[1].x} ${dy} l-8 -4 v8 z`, style: "fill:var(--ink-2)" }, hs);
    S("text", { x: (G[0].x + G[1].x) / 2, y: dy - 6, class: "d-text", "text-anchor": "middle" }, hs).textContent = `a = ${((22 + 13) * m) / 2}`;
    // leader
    S("path", { d: `M${G[2].x - 24} ${G[2].y - 30} L${G[2].x - 60} ${G[2].y - 74} H${G[2].x - 200}`, class: "d-dim" }, hs);
    S("text", { x: G[2].x - 200, y: G[2].y - 80, class: "d-text" }, hs).textContent = "move the pointer here to drive";

    // animation: angular velocity shared through the mesh; mouse adds speed
    let w = 0.35, angle = 0, boost = 0;
    hs.addEventListener("pointermove", (e) => { boost = Math.min(6, boost + Math.hypot(e.movementX, e.movementY) * 0.02); });
    let last = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      boost *= 0.96;
      angle += (w + boost) * dt * (reduce ? 0 : 1);
      // angles per gear: driver gear 0; ratio by teeth
      const a0 = angle;
      const a1 = -a0 * 22 / 13 + Math.PI / 13;
      const a2 = -a1 * 13 / 9 + 0.18;
      [a0, a1, a2].forEach((a, i) => G[i].rot.setAttribute("transform", `rotate(${(a * 180 / Math.PI).toFixed(2)})`));
      rpm.textContent = `${Math.round((w + boost) * 60 / (2 * Math.PI) * 10)} rpm`;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------------- Cursor readout ---------------- */
  const cr = $("cursor-readout");
  window.addEventListener("pointermove", (e) => {
    cr.textContent = `X ${String(e.clientX.toFixed(1)).padStart(6, "0")} · Y ${String((e.clientY + window.scrollY).toFixed(1)).padStart(6, "0")}`;
  });

  /* ---------------- About ---------------- */
  $("about-text").innerHTML = P.about.map((p) => `<p>${p}</p>`).join("");
  const tbRows = [
    ["Name", P.name], ["Based in", P.location], ["From", P.origin], ["Status", P.status],
    ["Study", P.study, true], ["Languages", P.languages, true],
  ];
  $("about-card").innerHTML = tbRows.map(([k, v, wide]) => `<div class="tb${wide ? " wide" : ""}"><span class="label">${k}</span><span class="v">${v}</span></div>`).join("");

  /* ---------------- Experience ---------------- */
  const KIND = { all: "All", work: "Work & products", education: "Education", leadership: "Leadership" };
  const tl = $("timeline");
  tl.innerHTML = window.EXPERIENCE.map((x, i) => `
    <li class="tl-item" data-kind="${x.kind}">
      <div class="tl-card" role="button" tabindex="0" aria-expanded="${i === 0}">
        <div class="tl-top"><h3>${x.title}<span class="tl-kind">${KIND[x.kind].split(" ")[0]}</span></h3><span class="tl-when">${x.when}</span></div>
        <div class="tl-org">${x.org}</div>
        <div class="tl-detail"><div><ul>${x.points.map((p) => `<li>${p}</li>`).join("")}</ul></div></div>
      </div>
    </li>`).join("");
  tl.querySelectorAll(".tl-card").forEach((c) => {
    const toggle = () => c.setAttribute("aria-expanded", c.getAttribute("aria-expanded") === "true" ? "false" : "true");
    c.addEventListener("click", toggle);
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  function chips(el, opts, onPick) {
    el.innerHTML = Object.entries(opts).map(([k, v], i) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${i === 0}">${v}</button>`).join("");
    el.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
      el.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      onPick(b.dataset.k);
    }));
  }
  chips($("tl-filter"), KIND, (k) => tl.querySelectorAll(".tl-item").forEach((li) => li.classList.toggle("hidden", k !== "all" && li.dataset.kind !== k)));

  /* ---------------- Projects ---------------- */
  const grid = $("projects-grid");
  const PROJ = window.PROJECTS;
  grid.innerHTML = PROJ.map((p, i) => `
    <button type="button" class="pcard reveal" data-i="${i}" data-cat="${p.category}" style="transition-delay:${(i % 3) * 80}ms">
      <div class="pcard-thumb">${window.THUMBS[p.id] || ""}</div>
      <div class="pcard-body">
        <div class="pcard-meta"><span>${p.context}</span><span>${p.year}</span></div>
        <h3>${p.title}</h3>
        <p>${p.blurb}</p>
        <div class="tags">${p.tags.slice(0, 4).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </button>`).join("");
  chips($("proj-filter"), { all: "All", hardware: "Hardware", analysis: "Analysis", software: "Software" }, (k) =>
    grid.querySelectorAll(".pcard").forEach((c) => c.classList.toggle("hidden", k !== "all" && c.dataset.cat !== k)));
  grid.querySelectorAll(".pcard").forEach((c) => c.addEventListener("click", () => openSheet(+c.dataset.i)));

  /* ---------------- Project sheet ---------------- */
  const sheet = $("sheet");
  let current = -1, cleanup = null, lastFocus = null;
  function openSheet(i) {
    if (cleanup) { cleanup(); cleanup = null; }
    current = (i + PROJ.length) % PROJ.length;
    const p = PROJ[current];
    if (sheet.hidden) lastFocus = document.activeElement;
    $("sheet-title").textContent = p.title;
    $("sheet-context").textContent = p.context;
    $("sheet-year").textContent = p.year;
    $("sheet-no").textContent = `${String(current + 1).padStart(2, "0")} / ${String(PROJ.length).padStart(2, "0")}`;
    $("sheet-lead").textContent = p.lead;
    $("sheet-points").innerHTML = p.points.map((x) => `<li>${x}</li>`).join("");
    $("sheet-figs").innerHTML = p.figs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    $("sheet-tags").innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");
    $("sheet-links").innerHTML = p.links.map((l) => `<a class="btn small" href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("");
    const host = $("schem"), controls = $("schem-controls"), readout = $("sheet-readout");
    host.innerHTML = ""; controls.innerHTML = ""; readout.innerHTML = "";
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    const fn = window.SCHEMATICS[p.schematic];
    try { cleanup = fn ? fn({ host, controls, readout }) : null; }
    catch (err) { console.error(err); host.innerHTML = `<p style="padding:20px">This schematic could not load.</p>`; }
    sheet.querySelector(".sheet").scrollTop = 0;
    sheet.querySelector(".sheet-close").focus({ preventScroll: true });
    if (location.hash !== "#p-" + p.id) history.replaceState(null, "", "#p-" + p.id);
  }
  function closeSheet() {
    if (cleanup) { cleanup(); cleanup = null; }
    sheet.hidden = true;
    document.body.style.overflow = "";
    $("schem").innerHTML = "";
    history.replaceState(null, "", "#projects");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  sheet.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeSheet));
  $("sheet-prev").addEventListener("click", () => openSheet(current - 1));
  $("sheet-next").addEventListener("click", () => openSheet(current + 1));
  document.addEventListener("keydown", (e) => {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
    if (!typing && e.key === "ArrowRight") openSheet(current + 1);
    if (!typing && e.key === "ArrowLeft") openSheet(current - 1);
    if (e.key === "Tab") { // keep focus inside the dialog
      const f = [...sheet.querySelectorAll("button, a, input, select, [tabindex]")].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  // deep link: #p-<id>
  const deep = location.hash.match(/^#p-(.+)$/);
  function openFromHash() {
    const d = location.hash.match(/^#p-(.+)$/);
    if (!d) return;
    const i = PROJ.findIndex((p) => p.id === d[1]);
    if (i >= 0 && (sheet.hidden || i !== current)) openSheet(i);
  }
  if (deep) setTimeout(openFromHash, 400);
  window.addEventListener("hashchange", openFromHash);

  /* ---------------- Skills ---------------- */
  const ICONS = {
    gear: '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    spark: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    people: '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.5.6 4 2.5 4 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  };
  $("skills-grid").innerHTML = window.SKILLS.map((g) => `
    <div class="skill-group">
      <h3>${ICONS[g.icon] || ""}${g.group}</h3>
      ${g.items.map((s) => `
        <div class="skill">
          <div class="skill-top"><span>${s.name}</span></div>
          <div class="skill-bar"><i style="--w:${s.level}%"></i></div>
          ${s.note ? `<div class="skill-note">${s.note}</div>` : ""}
        </div>`).join("")}
    </div>`).join("");

  /* ---------------- Contact ---------------- */
  const L = P.links;
  const contactItems = [
    L.email && { href: "mailto:" + L.email, label: "Email", sub: L.email, icon: '<path d="M3 6h18v12H3z M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>' },
    L.linkedin && { href: L.linkedin, label: "LinkedIn", sub: L.linkedin.replace(/^https?:\/\/(www\.)?/, ""), icon: '<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10v7M8 7v.5M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" stroke="currentColor" stroke-width="2"/>' },
    L.github && { href: L.github, label: "GitHub", sub: L.github.replace(/^https?:\/\//, ""), icon: '<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" stroke-width="2"/>' },
    L.swagework && { href: L.swagework, label: "SwageWork", sub: L.swagework.replace(/^https?:\/\//, ""), icon: '<path d="M12 2l9 5v10l-9 5-9-5V7z M12 12l9-5 M12 12v10 M12 12L3 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' },
    L.cv && { href: L.cv, label: "Download CV", sub: "PDF", icon: '<path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" fill="none" stroke="currentColor" stroke-width="2"/>' },
  ].filter(Boolean);
  $("contact-box").innerHTML = `
    <p class="contact-lead">I'm looking for internships and projects where mechanical design meets software: test rigs, product development, engineering tools and automation. If you're building something in that space, I'd like to hear about it.</p>
    <div class="contact-links">${contactItems.map((c) => `
      <a class="contact-link" href="${c.href}" ${c.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${c.icon}</svg>
        <span>${c.label}<small>${c.sub}</small></span>
      </a>`).join("")}
    </div>`;

  /* ---------------- Reveal on scroll + active nav ---------------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal, .skill-group").forEach((el) => io.observe(el));

  const navLinks = [...document.querySelectorAll(".nav a")];
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
})();
