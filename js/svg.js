/* Small helpers shared by the hero drawing and the schematics. */
(function () {
  const NS = "http://www.w3.org/2000/svg";

  /** Create an SVG element: S("rect", {x:1}, parent) */
  function S(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /** Create an <svg> root with a viewBox */
  function root(w, h, label) {
    return S("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": label || "", preserveAspectRatio: "xMidYMid meet" });
  }

  /** Create an HTML element: H("div", {class:"x"}, "text") */
  function H(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /** Animation loop that can be stopped. cb(dt seconds, t seconds) */
  function loop(cb) {
    let raf = 0, last = performance.now(), t = 0, alive = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function frame(now) {
      if (!alive) return;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now; t += dt;
      cb(reduce ? dt * 0.35 : dt, t);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }

  const lerp = (a, b, k) => a + (b - a) * k;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /** Mix two hex colours (#rrggbb) */
  function mix(c1, c2, k) {
    const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    const r = Math.round(lerp(a >> 16, b >> 16, k));
    const g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, k));
    const bl = Math.round(lerp(a & 255, b & 255, k));
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  }
  /** Colour ramp through several stops, k in [0,1] */
  function ramp(stops, k) {
    k = clamp(k, 0, 1) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(k));
    return mix(stops[i], stops[i + 1], k - i);
  }

  /** Read a CSS custom property (resolved colour) */
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /** Slider control. Returns the <input>. */
  function slider(parent, { label, min, max, step, value, fmt, oninput }) {
    const wrap = H("label", { class: "ctl" });
    const top = H("span", null, `${label}<b>${fmt ? fmt(value) : value}</b>`);
    const inp = H("input", { type: "range", min, max, step, value });
    inp.addEventListener("input", () => {
      const v = parseFloat(inp.value);
      top.querySelector("b").textContent = fmt ? fmt(v) : v;
      oninput && oninput(v);
    });
    wrap.append(top, inp);
    parent.appendChild(wrap);
    inp.setLabel = (v) => (top.querySelector("b").textContent = fmt ? fmt(v) : v);
    return inp;
  }

  /** Segmented toggle. options: [{value,label}] */
  function segmented(parent, { label, options, value, onchange }) {
    const wrap = H("div", { class: "ctl" });
    wrap.appendChild(H("span", null, label));
    const seg = H("div", { class: "seg", role: "group", "aria-label": label });
    options.forEach((o) => {
      const b = H("button", { type: "button", "aria-pressed": String(o.value === value) }, o.label);
      b.addEventListener("click", () => {
        seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        onchange(o.value);
      });
      seg.appendChild(b);
    });
    wrap.appendChild(seg);
    parent.appendChild(wrap);
    return seg;
  }

  function select(parent, { label, options, value, onchange }) {
    const wrap = H("label", { class: "ctl" });
    wrap.appendChild(H("span", null, label));
    const s = H("select");
    options.forEach((o) => {
      const op = H("option", { value: o.value }, o.label);
      if (String(o.value) === String(value)) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener("change", () => onchange(s.value));
    wrap.appendChild(s);
    parent.appendChild(wrap);
    return s;
  }

  /** Floating tooltip inside a positioned container */
  function tooltip(container) {
    const tip = H("div", { class: "sx-tip", role: "status" });
    container.appendChild(tip);
    return {
      show(html, evt) {
        tip.innerHTML = html;
        tip.classList.add("on");
        const r = container.getBoundingClientRect();
        let x = evt.clientX - r.left + 14, y = evt.clientY - r.top + 14;
        const w = tip.offsetWidth, h = tip.offsetHeight;
        if (x + w > r.width - 6) x = evt.clientX - r.left - w - 14;
        if (y + h > r.height - 6) y = evt.clientY - r.top - h - 14;
        tip.style.left = Math.max(6, x) + "px";
        tip.style.top = Math.max(6, y) + "px";
      },
      hide() { tip.classList.remove("on"); },
    };
  }

  /** Readout card in the sheet's side panel */
  function readouts(el, items) {
    el.innerHTML = items.map((it) =>
      `<div class="ro ${it.state || ""}" data-key="${it.key}"><span class="k">${it.k}</span><span class="v">${it.v}</span>${it.s ? `<span class="s">${it.s}</span>` : ""}</div>`
    ).join("");
  }
  function setReadout(el, key, v, state, s) {
    const card = el.querySelector(`[data-key="${key}"]`);
    if (!card) return;
    card.querySelector(".v").textContent = v;
    card.className = "ro " + (state || "");
    if (s !== undefined) {
      let sEl = card.querySelector(".s");
      if (!sEl) { sEl = H("span", { class: "s" }); card.appendChild(sEl); }
      sEl.textContent = s;
    }
  }

  const fmt = (v, d = 0) => new Intl.NumberFormat("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

  window.SX = { S, H, root, loop, lerp, clamp, mix, ramp, cssVar, slider, segmented, select, tooltip, readouts, setReadout, fmt };
})();
