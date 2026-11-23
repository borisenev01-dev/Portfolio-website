/* ==========================================================================
   Interactive, animated schematics — one per project.
   Each entry is a function({ host, controls, readout }) that builds the
   drawing and returns a cleanup function (called when the sheet closes).
   ========================================================================== */
(function () {
  const { S, H, root, loop, lerp, clamp, ramp, slider, segmented, select, tooltip, readouts, setReadout, fmt } = window.SX;
  const TEMP_RAMP = ["#2f6bff", "#2fc3ff", "#ffe066", "#ff9a3d", "#ff3d3d"];
  const SCH = {};

  /* Arrow-head marker shared per svg */
  function defs(svg) {
    const d = S("defs", null, svg);
    const mk = (id, color) => {
      const m = S("marker", { id, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, d);
      S("path", { d: "M0 0 L10 5 L0 10 z", style: `fill:${color}` }, m);
    };
    mk("ah-accent", "var(--accent)");
    mk("ah-ink", "var(--ink-2)");
    mk("ah-hot", "var(--hot)");
    mk("ah-cold", "var(--cold)");
    mk("ah-ok", "var(--ok)");
    return d;
  }
  const st = (el, css) => (el.setAttribute("style", css), el);

  /* ======================================================================
     1. EXPO51 electrolyser — Seal Stack 1.2
     ====================================================================== */
  SCH.electrolyser = function ({ host, controls, readout }) {
    const W = 820, Hh = 470, cy = 250;
    const svg = root(W, Hh, "Exploded side view of the Seal Stack electrolyser cell with electrolyte flow and gas bubbles");
    host.appendChild(svg);
    defs(svg);
    const tip = tooltip(host);

    const LAYERS = [
      { id: "shellA", name: "Outer shell · face A", w: 44, h: 290, kind: "shell", mat: "POM-C", size: "92 × 92 × 15 mm", note: "Three G1/8 ports (hose tips) and a key groove for the housing." },
      { id: "houseA", name: "Housing half · anode side", w: 38, h: 196, kind: "house", gas: "O₂", mat: "Printed resin", size: "56 octagon × 12 mm", note: "Exit chamber behind the anode; one outlet at its highest point so no gas is trapped." },
      { id: "epdmA", name: "Outer seal", w: 9, h: 132, kind: "epdm", mat: "EPDM 70 Shore A", size: "35 × 35 × 1.0 mm", note: "Squeezed 20 % by the pocket depth to take up the print tolerance." },
      { id: "anode", name: "Anode (+)", w: 7, h: 132, kind: "elec", sign: "+", mat: "316L, laser cut", size: "35 × 35 × 1 mm", note: "9 holes Ø4 let electrolyte and O₂ through. Tab with Ø4.3 lead hole." },
      { id: "ptfe1", name: "PTFE window seal", w: 5, h: 152, kind: "ptfe", mat: "PTFE film", size: "52 × 43.5 × 0.25 mm", note: "Gap layer 1 of 3. Cut with a knife or plotter, never a laser (toxic fumes)." },
      { id: "ptfe2", name: "PTFE flow seal", w: 5, h: 152, kind: "ptfe", mat: "PTFE film", size: "52 × 43.5 × 0.25 mm", note: "Gap layer 2 of 3. A 4 mm channel feeds the electrolyte up into the gap." },
      { id: "ptfe3", name: "PTFE window seal", w: 5, h: 152, kind: "ptfe", mat: "PTFE film", size: "52 × 43.5 × 0.25 mm", note: "Gap layer 3 of 3. Together: a fixed 0.75 mm electrode gap." },
      { id: "cathode", name: "Cathode (−)", w: 7, h: 132, kind: "elec", sign: "−", mat: "316L, laser cut", size: "35 × 35 × 1 mm", note: "Hydrogen forms here at twice the volume rate of oxygen." },
      { id: "epdmB", name: "Outer seal", w: 9, h: 132, kind: "epdm", mat: "EPDM 70 Shore A", size: "35 × 35 × 1.0 mm", note: "Squeezed 20 % by the pocket depth." },
      { id: "houseB", name: "Housing half · cathode side", w: 38, h: 196, kind: "house", gas: "H₂", mat: "Printed resin", size: "56 octagon × 12 mm", note: "Exit chamber behind the cathode with its own outlet, so the gases cannot mix." },
      { id: "shellB", name: "Outer shell · face B", w: 44, h: 290, kind: "shell", mat: "POM-C", size: "92 × 92 × 15 mm", note: "Unused ports closed with hand-tightened stoppers; in a stack, G1/8 double nipples join the cells." },
    ];
    const STYLE = {
      shell: "fill:var(--panel-2);stroke:var(--ink-2);stroke-width:1.4",
      house: "fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.4",
      epdm: "fill:var(--ink-3);stroke:var(--ink-2);stroke-width:1",
      elec: "fill:#b9c6d8;stroke:#7d8da5;stroke-width:1",
      ptfe: "fill:var(--warn);stroke:var(--warn);stroke-width:.6;fill-opacity:.85",
    };

    const gRods = S("g", null, svg);
    const gChannels = S("g", null, svg);
    const gLayers = S("g", null, svg);
    const gFlow = S("g", null, svg);
    const gTop = S("g", null, svg);

    // rods + nuts
    const rodY = [cy - 122, cy + 122];
    const rods = rodY.map((y) => S("line", { y1: y, y2: y, style: "stroke:var(--ink-3);stroke-width:7;stroke-linecap:round" }, gRods));
    const nuts = [];
    rodY.forEach((y) => { for (let i = 0; i < 2; i++) nuts.push(S("rect", { y: y - 11, width: 10, height: 22, rx: 2, style: "fill:var(--ink-2)" }, gRods)); });
    // clamp force arrows
    const clampL = S("path", { style: "stroke:var(--hot);stroke-width:3;fill:none", "marker-end": "url(#ah-hot)" }, gTop);
    const clampR = S("path", { style: "stroke:var(--hot);stroke-width:3;fill:none", "marker-end": "url(#ah-hot)" }, gTop);
    const clampTxt = S("text", { class: "d-text", y: cy + 4, "text-anchor": "middle" }, gTop);

    // channels (dashed): inlet, O2 outlet, H2 outlet
    const chIn = S("path", { class: "d-thin", style: "stroke-dasharray:4 4;stroke:var(--cold)" }, gChannels);
    const chO2 = S("path", { class: "d-thin", style: "stroke-dasharray:4 4;stroke:var(--o2)" }, gChannels);
    const chH2 = S("path", { class: "d-thin", style: "stroke-dasharray:4 4;stroke:var(--h2)" }, gChannels);
    const lblIn = S("text", { class: "d-text", "text-anchor": "end" }, gTop); lblIn.textContent = "KOH in";
    const lblO2 = S("text", { class: "d-text", "text-anchor": "end", style: "fill:var(--o2)" }, gTop); lblO2.textContent = "O₂ + KOH out";
    const lblH2 = S("text", { class: "d-text", "text-anchor": "end", style: "fill:var(--h2)" }, gTop); lblH2.textContent = "H₂ + KOH out";
    const lblA = S("text", { class: "d-text", "text-anchor": "middle", y: cy + 166 }, gTop); lblA.textContent = "face A";
    const lblB = S("text", { class: "d-text", "text-anchor": "middle", y: cy + 166 }, gTop); lblB.textContent = "face B";

    // layers
    LAYERS.forEach((L) => {
      L.x = 0; L.tx = 0;
      L.g = S("g", { class: "sx-hover", tabindex: 0 }, gLayers);
      S("rect", { x: 0, y: cy - L.h / 2, width: L.w, height: L.h, rx: L.kind === "shell" ? 4 : 1.5, style: STYLE[L.kind] }, L.g);
      if (L.kind === "house") {
        // exit chamber
        S("rect", { x: 7, y: cy - 70, width: L.w - 14, height: 140, rx: 3, style: "fill:var(--bg);stroke:var(--accent);stroke-width:1;stroke-dasharray:3 2" }, L.g);
      }
      if (L.kind === "elec") {
        S("rect", { x: 0, y: cy - L.h / 2 - 46, width: L.w, height: 48, style: STYLE.elec }, L.g); // tab
        for (let i = -1; i <= 1; i++) S("rect", { x: 1.5, y: cy + i * 36 - 3, width: L.w - 3, height: 6, style: "fill:var(--bg)" }, L.g); // holes
        const t = S("text", { x: L.w / 2, y: cy - L.h / 2 - 54, "text-anchor": "middle", class: "d-text-strong" }, L.g);
        t.textContent = L.sign;
      }
      if (L.kind === "ptfe" && L.id === "ptfe2") {
        S("rect", { x: 0.5, y: cy - 60, width: L.w - 1, height: 148, style: "fill:var(--bg);opacity:.9" }, L.g); // 4 mm flow channel
      }
      const show = (e) => tip.show(`<b>${L.name}</b><span>${L.mat} · ${L.size}</span><span>${L.note}</span>`, e);
      L.g.addEventListener("mousemove", show);
      L.g.addEventListener("mouseleave", () => tip.hide());
      L.g.addEventListener("focus", () => { const r = L.g.getBoundingClientRect(); show({ clientX: r.right, clientY: r.top + 40 }); });
      L.g.addEventListener("blur", () => tip.hide());
    });
    const byId = Object.fromEntries(LAYERS.map((L) => [L.id, L]));

    // power supply & wires
    const psu = S("g", null, gTop);
    S("rect", { x: -46, y: 16, width: 92, height: 40, rx: 6, style: "fill:var(--panel);stroke:var(--ink-2)" }, psu);
    S("line", { x1: -14, y1: 26, x2: -14, y2: 46, style: "stroke:var(--ink);stroke-width:2" }, psu);
    S("line", { x1: -6, y1: 31, x2: -6, y2: 41, style: "stroke:var(--ink);stroke-width:4" }, psu);
    const psuTxt = S("text", { x: 4, y: 40, class: "d-text-strong" }, psu);
    const wireP = S("path", { style: "fill:none;stroke:var(--o2);stroke-width:2" }, gTop);
    const wireN = S("path", { style: "fill:none;stroke:var(--h2);stroke-width:2" }, gTop);
    const scaleNote = S("text", { x: W - 12, y: Hh - 10, class: "d-text", "text-anchor": "end" }, svg);
    scaleNote.textContent = "Side section · layer thickness not to scale · hover a layer";

    // particles
    const parts = [];
    const pool = S("g", null, gFlow);

    let explode = 0.55, explodeShown = 0.55, running = true, torque = 7;
    let spawnE = 0, spawnO = 0, spawnH = 0, wireDash = 0;

    function layout(e) {
      const gap = 1 + e * 30;
      const total = LAYERS.reduce((a, L) => a + L.w, 0) + gap * (LAYERS.length - 1);
      let x = W / 2 - total / 2 + 10;
      LAYERS.forEach((L) => { L.x = x; x += L.w + gap; L.g.setAttribute("transform", `translate(${L.x},0)`); });
      const left = LAYERS[0].x, right = LAYERS[LAYERS.length - 1].x + LAYERS[LAYERS.length - 1].w;
      rods.forEach((r) => { r.setAttribute("x1", left - 20); r.setAttribute("x2", right + 20); });
      nuts.forEach((n, i) => n.setAttribute("x", i % 2 ? right + 6 : left - 16));
      const yIn = cy + 98, yO = cy - 92, yH = cy - 108;
      chIn.setAttribute("d", `M${left - 40} ${yIn} H${byId.ptfe2.x + 2.5} V${cy - 60}`);
      const oX = byId.houseA.x + byId.houseA.w / 2, hX = byId.houseB.x + byId.houseB.w / 2;
      chO2.setAttribute("d", `M${oX} ${cy - 70} V${yO} H${left - 40}`);
      chH2.setAttribute("d", `M${hX} ${cy - 70} V${yH} H${left - 40}`);
      lblIn.setAttribute("x", left - 46); lblIn.setAttribute("y", yIn + 4);
      lblO2.setAttribute("x", left - 46); lblO2.setAttribute("y", yO + 4);
      lblH2.setAttribute("x", left - 46); lblH2.setAttribute("y", yH + 4);
      lblA.setAttribute("x", left + 22); lblB.setAttribute("x", right - 22);
      // clamp arrows sized by torque
      const len = 18 + torque * 5;
      clampL.setAttribute("d", `M${left - 34 - len} ${cy} H${left - 34}`);
      clampR.setAttribute("d", `M${right + 34 + len} ${cy} H${right + 34}`);
      clampTxt.setAttribute("x", right + 34 + len / 2 + 6); clampTxt.setAttribute("y", cy - 10);
      clampTxt.textContent = `${fmt(clampTotal() / 1000, 1)} kN`;
      // wires
      const a = byId.anode, c = byId.cathode;
      const mid = (left + right) / 2;
      psu.setAttribute("transform", `translate(${mid},0)`);
      const tabTop = cy - a.h / 2 - 46;
      wireP.setAttribute("d", `M${mid - 46} 36 H${a.x + a.w / 2} V${tabTop}`);
      wireN.setAttribute("d", `M${mid + 46} 36 H${c.x + c.w / 2} V${tabTop}`);
      return { left, right, yIn, yO, yH, oX, hX };
    }

    const K = 0.263, dRod = 0.008;
    const rodForce = () => torque / (K * dRod);
    const clampTotal = () => 4 * rodForce();
    const ptfeStress = () => 14.35 * (clampTotal() / 13300);

    function updateReadouts() {
      const p = ptfeStress();
      setReadout(readout, "force", `${fmt(rodForce() / 1000, 2)} kN`, "", `per M8 rod at ${fmt(torque, 1)} Nm`);
      setReadout(readout, "total", `${fmt(clampTotal() / 1000, 1)} kN`, "");
      setReadout(readout, "ptfe", `${fmt(p, 1)} MPa`, p < 9 ? "warn" : "ok", p < 9 ? "low: seal may weep" : "PTFE seating, flange catalogue 16.2 MPa");
    }
    readouts(readout, [
      { key: "gap", k: "Electrode gap", v: "0.75 mm", state: "ok", s: "3 × 0.25 mm PTFE, any torque" },
      { key: "force", k: "Rod force", v: "–" },
      { key: "total", k: "Total clamp", v: "–" },
      { key: "ptfe", k: "PTFE pressure", v: "–" },
      { key: "gas", k: "H₂ : O₂", v: "2 : 1", s: "2H₂O → 2H₂ + O₂" },
    ]);

    // controls
    slider(controls, { label: "Explode view", min: 0, max: 100, step: 1, value: 55, fmt: (v) => v + " %", oninput: (v) => (explode = v / 100) });
    slider(controls, { label: "Rod torque", min: 1, max: 10, step: 0.5, value: 7, fmt: (v) => v.toFixed(1) + " Nm", oninput: (v) => { torque = v; updateReadouts(); } });
    segmented(controls, { label: "Current", value: true, options: [{ value: true, label: "Running" }, { value: false, label: "Off" }], onchange: (v) => (running = v) });
    updateReadouts();

    function addParticle(kind, geo) {
      let pts, r, style, speed;
      if (kind === "e") {
        const x = byId.ptfe2.x + 2.5;
        pts = [[geo.left - 40, geo.yIn], [x, geo.yIn], [x, cy - 60 + Math.random() * 20]];
        r = 2; style = "fill:var(--cold)"; speed = 90;
      } else {
        const house = kind === "o" ? byId.houseA : byId.houseB;
        const x0 = house.x + 9 + Math.random() * (house.w - 18);
        const y0 = cy - 50 + Math.random() * 110;
        const cx = kind === "o" ? geo.oX : geo.hX;
        const yOut = kind === "o" ? geo.yO : geo.yH;
        pts = [[x0, y0], [x0, cy - 66], [cx, cy - 70], [cx, yOut], [geo.left - 40, yOut]];
        r = 1.6 + Math.random() * 2.2;
        style = kind === "o" ? "fill:none;stroke:var(--o2);stroke-width:1.3" : "fill:none;stroke:var(--h2);stroke-width:1.3";
        speed = 45 + Math.random() * 25;
      }
      const el = S("circle", { r, style }, pool);
      parts.push({ kind, pts, s: 0, speed, el, rel: { x: 0 } });
    }
    function posOn(pts, s) {
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const l = Math.hypot(x1 - x0, y1 - y0);
        if (s <= l) return [lerp(x0, x1, s / l), lerp(y0, y1, s / l)];
        s -= l;
      }
      return null;
    }

    const stop = loop((dt) => {
      explodeShown += (explode - explodeShown) * Math.min(1, dt * 6);
      const geo = layout(explodeShown);
      const moved = Math.abs(explode - explodeShown) > 0.002;
      if (running) {
        spawnE += dt * 9; spawnO += dt * 5; spawnH += dt * 10;
        while (spawnE > 1) { spawnE--; addParticle("e", geo); }
        while (spawnO > 1) { spawnO--; addParticle("o", geo); }
        while (spawnH > 1) { spawnH--; addParticle("h", geo); }
        wireDash -= dt * 40;
        wireP.style.strokeDasharray = "6 5"; wireN.style.strokeDasharray = "6 5";
        wireP.style.strokeDashoffset = -wireDash; wireN.style.strokeDashoffset = wireDash;
        psuTxt.textContent = "2.2 V";
      } else {
        wireP.style.strokeDasharray = ""; wireN.style.strokeDasharray = "";
        psuTxt.textContent = "0 V";
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        // re-anchor path to the live layout when exploding
        if (moved) {
          if (p.kind === "e") { p.pts[0][0] = geo.left - 40; p.pts[1][0] = p.pts[2][0] = byId.ptfe2.x + 2.5; }
          else {
            const house = p.kind === "o" ? byId.houseA : byId.houseB;
            if (p.rel.x === 0) p.rel.x = (p.pts[0][0] - house.x) / house.w;
            const x0 = house.x + p.rel.x * house.w, cx = p.kind === "o" ? geo.oX : geo.hX;
            p.pts[0][0] = p.pts[1][0] = x0; p.pts[2][0] = p.pts[3][0] = cx; p.pts[4][0] = geo.left - 40;
          }
        }
        p.s += p.speed * dt * (p.kind !== "e" && p.s > 140 ? 2.2 : 1);
        const pos = posOn(p.pts, p.s);
        if (!pos) { p.el.remove(); parts.splice(i, 1); continue; }
        p.el.setAttribute("cx", pos[0] + (p.kind !== "e" ? Math.sin(p.s * 0.15) * 1.2 : 0));
        p.el.setAttribute("cy", pos[1]);
      }
    });
    return () => stop();
  };

  /* ======================================================================
     2. Wing box — DG1 static design (same equations as the MATLAB script)
     ====================================================================== */
  SCH.wingbox = function ({ host, controls, readout }) {
    const W = 820, Hh = 480;
    const svg = root(W, Hh, "Tapered wing box cantilever with lift and engine load, coloured by stress, with a stress-versus-thickness chart");
    host.appendChild(svg);
    defs(svg);
    const tip = tooltip(host);

    const MATS = {
      alox: { name: "Al–65% Al₂O₃ (fibre)", sy: 1830e6, rho: 3480, E: 240e9 },
      tisic: { name: "Ti–35% SiC (fibre)", sy: 1010e6, rho: null, E: null },
      cfrp: { name: "Cyanate ester / HM carbon", sy: 2530e6, rho: null, E: null },
    };
    let mat = "alox", t = 2.2e-3, bendPhase = 0;

    // --- model ---
    const C = (x) => (x <= 5 ? 15 : 15 - (13 / 30) * (x - 5));
    const Dk = (x) => (x <= 5 ? 225 / 2 * x - 2405 : x <= 10 ? -13 / 8 * x * x + 515 / 4 * x - 19565 / 8 : -13 / 8 * x * x + 515 / 4 * x - 20125 / 8); // kN
    const Mk = (x) => (x <= 5 ? -225 / 4 * x * x + 2405 * x - 126575 / 4 : x <= 10 ? 13 / 24 * x ** 3 - 515 / 8 * x * x + 19565 / 8 * x - 761075 / 24 : 13 / 24 * x ** 3 - 515 / 8 * x * x + 20125 / 8 * x - 777875 / 24); // kNm
    const I = (x, t) => { const w = 0.5 * C(x), h = 0.1 * C(x); return (w * h ** 3 - (w - 2 * t) * (h - 2 * t) ** 3) / 12; };
    const Q = (x, t) => { const w = 0.5 * C(x), h = 0.1 * C(x); return (w * h * h - (w - 2 * t) * (h - 2 * t) ** 2) / 8; };
    const A = (x, t) => { const w = 0.5 * C(x), h = 0.1 * C(x); return w * h - (w - 2 * t) * (h - 2 * t); };
    const sigma = (x, t) => Math.abs(Mk(x)) * 1e3 * 0.05 * C(x) / I(x, t);
    const tau = (x, t) => Math.abs(Dk(x)) * 1e3 * Q(x, t) / (2 * I(x, t) * t);
    function massProps(t, rho) {
      const n = 700; let v = 0, vx = 0;
      for (let i = 0; i < n; i++) { const x = (i + 0.5) * 35 / n, a = A(x, t) * 35 / n; v += a; vx += a * x; }
      return { m: rho * v, xcg: vx / v };
    }
    function deflection(t, m) {
      const E = m.E, g = 10, L1 = 5, L2 = 30;
      const { m: mass, xcg } = massProps(t, m.rho);
      const I1 = I(0, t), I2 = (I(5, t) + I(35, t)) / 2;
      const Fe = 7000 * g, Fw = mass * g, ae = 5, aw = xcg - L1;
      const V5 = Fe + Fw, M5 = Fe * ae + Fw * aw;
      const v1 = V5 * L1 ** 3 / (3 * E * I1) + M5 * L1 ** 2 / (2 * E * I1);
      const th1 = V5 * L1 ** 2 / (2 * E * I1) + M5 * L1 / (E * I1);
      const v2 = Fe * ae ** 2 * (3 * L2 - ae) / (6 * E * I2) + Fw * aw ** 2 * (3 * L2 - aw) / (6 * E * I2);
      return { mass, xcg, vtip: v1 + th1 * L2 + v2 };
    }

    // --- drawing geometry ---
    const x0 = 96, x1 = 776, kx = (x1 - x0) / 35, yc = 150, ky = 52;
    const X = (x) => x0 + x * kx;
    const N = 70;

    // fuselage
    S("rect", { x: x0 - 30, y: yc - 80, width: 30, height: 160, style: "fill:var(--panel-2);stroke:var(--ink-2)" }, svg);
    for (let i = 0; i < 8; i++) S("line", { x1: x0 - 30, y1: yc - 80 + i * 20 + 20, x2: x0, y2: yc - 80 + i * 20, class: "d-thin" }, svg);
    S("text", { x: x0 - 15, y: yc + 100, class: "d-text", "text-anchor": "middle" }, svg).textContent = "fuselage";

    const gBeam = S("g", null, svg);
    const segs = [];
    for (let i = 0; i < N; i++) {
      const p = S("path", { class: "sx-hover", style: "stroke-width:.4" }, gBeam);
      const xm = (i + 0.5) * 35 / N;
      p.addEventListener("mousemove", (e) => {
        const m = MATS[mat];
        tip.show(`<b>x = ${fmt(xm, 1)} m</b><span>chord ${fmt(C(xm), 2)} m · box ${fmt(0.5 * C(xm), 2)} × ${fmt(0.1 * C(xm), 2)} m</span><span>σ = ${fmt(sigma(xm, t) / 1e6)} MPa (${fmt(sigma(xm, t) / (m.sy / 1.5) * 100)} % of allowable)</span><span>|τ| = ${fmt(tau(xm, t) / 1e6)} MPa · M = ${fmt(Math.abs(Mk(xm)) / 1000, 2)} MNm</span>`, e);
      });
      p.addEventListener("mouseleave", () => tip.hide());
      segs.push(p);
    }
    const outline = S("path", { style: "fill:none;stroke:var(--ink);stroke-width:1.4" }, gBeam);
    const centre = S("path", { class: "d-center" }, gBeam);
    // engine
    const eng = S("g", null, svg);
    S("rect", { x: -4, y: 0, width: 8, height: 26, style: "fill:var(--ink-3)" }, eng);
    S("path", { d: "M-40 26 h72 q16 0 16 18 q0 18 -16 18 h-72 q-8 -18 0 -36 z", style: "fill:var(--panel-2);stroke:var(--ink-2);stroke-width:1.4" }, eng);
    S("ellipse", { cx: -40, cy: 44, rx: 5, ry: 17, style: "fill:var(--bg);stroke:var(--ink-2)" }, eng);
    S("line", { x1: 0, y1: 66, x2: 0, y2: 104, style: "stroke:var(--bad);stroke-width:2.5", "marker-end": "url(#ah-ink)" }, eng);
    S("text", { x: 8, y: 98, class: "d-text-strong" }, eng).textContent = "70 kN";
    // lift arrows
    const gLift = S("g", null, svg);
    const lifts = [];
    for (let x = 1.25; x < 35; x += 2.5) {
      const l = S("line", { style: "stroke:var(--ok);stroke-width:2", "marker-end": "url(#ah-ok)" }, gLift);
      lifts.push({ x, l });
    }
    S("text", { x: X(25), y: 262, class: "d-text", style: "fill:var(--ok)" }, svg).textContent = "lift L(x) = 7.5·C(x) kN/m";
    const tipTxt = S("text", { x: x1 - 4, y: 36, class: "d-text", "text-anchor": "end" }, svg);
    S("text", { x: X(0) + 4, y: 36, class: "d-text" }, svg).textContent = "x = 0 (root)";
    // colour legend
    const lg = S("g", { transform: `translate(${x0 + 120},26)` }, svg);
    const grad = S("linearGradient", { id: "wb-grad" }, svg.querySelector("defs"));
    [0, 0.6, 0.9, 1].forEach((o, i) => S("stop", { offset: o, "stop-color": ["#2fc3ff", "#3fd39a", "#ffc24d", "#ff3d3d"][i] }, grad));
    S("rect", { x: 0, y: 0, width: 150, height: 8, rx: 2, fill: "url(#wb-grad)" }, lg);
    S("text", { x: 0, y: 22, class: "d-text" }, lg).textContent = "0";
    S("text", { x: 150, y: 22, class: "d-text", "text-anchor": "end" }, lg).textContent = "σ / σ_allow = 1";

    // cross-section inset
    const cs = S("g", { transform: "translate(70,330)" }, svg);
    S("text", { x: 0, y: -14, class: "label", style: "fill:var(--ink-2);font:600 11px var(--font-title);letter-spacing:.1em" }, cs).textContent = "ROOT SECTION";
    const csOuter = S("rect", { x: 0, y: 0, width: 200, height: 40, style: "fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.4" }, cs);
    const csInner = S("rect", { style: "fill:var(--bg);stroke:var(--accent);stroke-width:1" }, cs);
    S("text", { x: 100, y: 60, class: "d-text", "text-anchor": "middle" }, cs).textContent = "W = 7.5 m";
    S("text", { x: 208, y: 24, class: "d-text" }, cs).textContent = "H = 1.5 m";
    const csT = S("text", { x: 0, y: 82, class: "d-text-strong" }, cs);
    S("text", { x: 0, y: 100, class: "d-text" }, cs).textContent = "wall drawn ×40 thicker";

    // chart σ(t) at root
    const cx0 = 380, cx1 = 790, cy0 = 300, cy1 = 450;
    const chart = S("g", null, svg);
    S("text", { x: cx0, y: cy0 - 12, class: "label", style: "fill:var(--ink-2);font:600 11px var(--font-title);letter-spacing:.1em" }, chart).textContent = "ROOT STRESS VS WALL THICKNESS";
    const tMin = 1, tMax = 30, sMin = 50, sMax = 3000;
    const TX = (tm) => cx0 + (Math.log(tm / tMin) / Math.log(tMax / tMin)) * (cx1 - cx0);
    const SY = (s) => cy1 - (Math.log(s / sMin) / Math.log(sMax / sMin)) * (cy1 - cy0);
    [1, 2, 5, 10, 20, 30].forEach((v) => {
      S("line", { x1: TX(v), x2: TX(v), y1: cy0, y2: cy1, style: "stroke:var(--rule)" }, chart);
      S("text", { x: TX(v), y: cy1 + 14, class: "d-text", "text-anchor": "middle" }, chart).textContent = v;
    });
    [100, 300, 1000, 3000].forEach((v) => {
      S("line", { x1: cx0, x2: cx1, y1: SY(v), y2: SY(v), style: "stroke:var(--rule)" }, chart);
      S("text", { x: cx0 - 6, y: SY(v) + 4, class: "d-text", "text-anchor": "end" }, chart).textContent = v;
    });
    S("text", { x: cx1, y: cy1 + 28, class: "d-text", "text-anchor": "end" }, chart).textContent = "t [mm], log";
    let dS = "", dT = "";
    for (let i = 0; i <= 120; i++) {
      const tm = tMin * Math.pow(tMax / tMin, i / 120);
      dS += `${i ? "L" : "M"}${TX(tm).toFixed(1)} ${SY(sigma(0, tm / 1000) / 1e6).toFixed(1)}`;
      dT += `${i ? "L" : "M"}${TX(tm).toFixed(1)} ${SY(Math.max(sMin, tau(0, tm / 1000) / 1e6)).toFixed(1)}`;
    }
    S("path", { d: dS, style: "fill:none;stroke:var(--accent);stroke-width:2.2" }, chart);
    S("path", { d: dT, style: "fill:none;stroke:var(--ink-2);stroke-width:1.6;stroke-dasharray:5 4" }, chart);
    S("text", { x: TX(1.3), y: SY(2400), class: "d-text", style: "fill:var(--accent)" }, chart).textContent = "σ";
    S("text", { x: TX(1.3), y: SY(560), class: "d-text" }, chart).textContent = "|τ|";
    const allowLine = S("line", { x1: cx0, x2: cx1, style: "stroke:var(--bad);stroke-width:1.4;stroke-dasharray:6 4" }, chart);
    const allowTxt = S("text", { x: cx1 - 4, class: "d-text", "text-anchor": "end", style: "fill:var(--bad)" }, chart);
    const tminLine = S("line", { y1: cy0, y2: cy1, style: "stroke:var(--warn);stroke-width:1;stroke-dasharray:2 3" }, chart);
    const marker = S("circle", { r: 6, style: "fill:var(--hot);stroke:var(--bg);stroke-width:2" }, chart);
    const markerTxt = S("text", { class: "d-text-strong" }, chart);

    readouts(readout, [
      { key: "sig", k: "σ at root", v: "–" },
      { key: "tau", k: "|τ| at root", v: "–" },
      { key: "mass", k: "Wing box mass", v: "–" },
      { key: "defl", k: "Tip deflection (weight)", v: "–" },
      { key: "tmin", k: "Minimum t", v: "–" },
    ]);

    function update() {
      const m = MATS[mat], sa = m.sy / 1.5, ta = m.sy / Math.sqrt(3) / 1.5;
      const s0 = sigma(0, t), t0 = tau(0, t);
      setReadout(readout, "sig", `${fmt(s0 / 1e6)} MPa`, s0 <= sa ? "ok" : "bad", `allowable ${fmt(sa / 1e6)} MPa (σy / 1.5)`);
      setReadout(readout, "tau", `${fmt(t0 / 1e6)} MPa`, t0 <= ta ? "ok" : "bad", `allowable ${fmt(ta / 1e6)} MPa (von Mises)`);
      if (m.rho) {
        const d = deflection(t, m);
        setReadout(readout, "mass", `${fmt(d.mass)} kg`, d.mass < 15000 ? "ok" : "bad", `limit 15 000 kg · x_cg ${fmt(d.xcg, 1)} m`);
        const cm = d.vtip * 100;
        setReadout(readout, "defl", `${fmt(cm, 1)} cm`, cm >= 5 && cm <= 20 ? "ok" : "warn", "realistic range 5–20 cm");
      } else {
        setReadout(readout, "mass", "n/a", "", "density not in the report");
        setReadout(readout, "defl", "n/a", "", "stiffness not in the report");
      }
      // minimum thickness (σ governs)
      let tm = 1e-3; while (tm < 0.03 && (sigma(0, tm) > sa || tau(0, tm) > ta)) tm += 1e-5;
      setReadout(readout, "tmin", `${fmt(tm * 1000, 2)} mm`, "", "first t where σ and τ are allowable");
      tminLine.setAttribute("x1", TX(tm * 1000)); tminLine.setAttribute("x2", TX(tm * 1000));
      allowLine.setAttribute("y1", SY(sa / 1e6)); allowLine.setAttribute("y2", SY(sa / 1e6));
      allowTxt.setAttribute("y", SY(sa / 1e6) - 6); allowTxt.textContent = `σ_allow ${fmt(sa / 1e6)} MPa`;
      marker.setAttribute("cx", TX(t * 1000)); marker.setAttribute("cy", SY(s0 / 1e6));
      const mx = TX(t * 1000);
      markerTxt.setAttribute("x", mx > 640 ? mx - 10 : mx + 10); markerTxt.setAttribute("text-anchor", mx > 640 ? "end" : "start");
      markerTxt.setAttribute("y", SY(s0 / 1e6) - 10);
      markerTxt.textContent = `${fmt(t * 1000, 1)} mm → ${fmt(s0 / 1e6)} MPa`;
      // section inset
      const wpx = Math.min(18, 1 + t * 1000 * 0.6);
      csInner.setAttribute("x", wpx); csInner.setAttribute("y", wpx);
      csInner.setAttribute("width", 200 - 2 * wpx); csInner.setAttribute("height", Math.max(2, 40 - 2 * wpx));
      csT.textContent = `t = ${fmt(t * 1000, 1)} mm · I = ${I(0, t).toExponential(2)} m⁴`;
      // beam colours
      segs.forEach((p, i) => {
        const xm = (i + 0.5) * 35 / N;
        const r = sigma(xm, t) / sa;
        p.style.fill = r < 0.6 ? ramp(["#2fc3ff", "#3fd39a"], r / 0.6) : r < 0.9 ? ramp(["#3fd39a", "#ffc24d"], (r - 0.6) / 0.3) : ramp(["#ffc24d", "#ff3d3d"], (r - 0.9) / 0.1);
        p.style.stroke = p.style.fill;
      });
    }

    function drawBeam(amp) {
      const f = (x) => { const s = x / 35; return s * s * (3 - s) / 2; };
      const v = (x) => -amp * f(x);
      let top = "", bot = "", cl = "";
      for (let i = 0; i <= N; i++) {
        const x = i * 35 / N, h = 0.1 * C(x) * ky / 2, y = yc + v(x);
        top += `${i ? "L" : "M"}${X(x).toFixed(1)} ${(y - h).toFixed(1)}`;
        bot = `L${X(x).toFixed(1)} ${(y + h).toFixed(1)}` + bot;
        cl += `${i ? "L" : "M"}${X(x).toFixed(1)} ${y.toFixed(1)}`;
        if (i < N) {
          const xb = (i + 1) * 35 / N, hb = 0.1 * C(xb) * ky / 2, yb = yc + v(xb);
          segs[i].setAttribute("d", `M${X(x)} ${y - h}L${X(xb)} ${yb - hb}L${X(xb)} ${yb + hb}L${X(x)} ${y + h}Z`);
        }
      }
      outline.setAttribute("d", top + bot + "Z");
      centre.setAttribute("d", cl);
      const ye = yc + v(10) + 0.1 * C(10) * ky / 2;
      eng.setAttribute("transform", `translate(${X(10)},${ye})`);
      lifts.forEach(({ x, l }) => {
        const yb = yc + v(x) + 0.1 * C(x) * ky / 2;
        const len = 7.5 * C(x) * 0.55 * (0.85 + 0.15 * Math.sin(bendPhase * 2 + x * 0.3));
        l.setAttribute("x1", X(x)); l.setAttribute("x2", X(x));
        l.setAttribute("y1", yb + 8 + len + 40); l.setAttribute("y2", yb + 48);
      });
      tipTxt.textContent = `tip x = 35 m · bending shown ×${Math.round(amp / 0.5)}`;
    }

    select(controls, { label: "Material", value: mat, options: Object.entries(MATS).map(([k, m]) => ({ value: k, label: m.name })), onchange: (v) => { mat = v; update(); } });
    slider(controls, { label: "Wall thickness t", min: 1, max: 30, step: 0.1, value: 2.2, fmt: (v) => v.toFixed(1) + " mm", oninput: (v) => { t = v / 1000; update(); } });
    let flex = true;
    segmented(controls, { label: "Load animation", value: true, options: [{ value: true, label: "Flexing" }, { value: false, label: "Still" }], onchange: (v) => (flex = v) });
    update();

    const stop = loop((dt) => {
      if (flex) bendPhase += dt;
      const amp = 22 + 14 * Math.sin(bendPhase * 1.6);
      drawBeam(amp);
    });
    return () => stop();
  };

  /* ======================================================================
     3. Pipe-in-pipe heat exchanger — measured runs A and B
     ====================================================================== */
  SCH.heatx = function ({ host, controls, readout }) {
    const W = 820, Hh = 500;
    const svg = root(W, Hh, "Two-section pipe-in-pipe heat exchanger with animated hot and cold flow and measured temperature profiles");
    host.appendChild(svg);
    defs(svg);
    const tip = tooltip(host);

    const RUNS = {
      A: { label: "A · countercurrent, 95 % cold flow", counter: true, T: [17.3, 17.9, 22.8, 40.2, 24.9, 18.6], Vc: 17.8, vc: 2.7, Qh: 8.25, Qc: 6.82, lm: 6.21, UA: 1210, U: 3200, eff: 0.943, split: [70.8, 29.2] },
      B: { label: "B · cocurrent, 60 % cold flow", counter: false, T: [17.8, 25.4, 26.5, 47.6, 29.9, 27.2], Vc: 11.0, vc: 1.7, Qh: 7.76, Qc: 6.65, lm: 7.76, UA: 929, U: 2450, eff: 0.685, split: [86.8, 13.2] },
    };
    let run = "A", speed = 1;

    // geometry of the series path
    const xa = 200, xb = 600, y1 = 100, y2 = 250, r = (y2 - y1) / 2, ym = (y1 + y2) / 2;
    const L1 = xb - xa, La = Math.PI * r, LT = 2 * L1 + La;
    function at(d) { // distance along path → {x,y,nx,ny, z (physical m)}
      if (d <= L1) return { x: xa + d, y: y1, nx: 0, ny: -1, z: (d / L1) * 4.2 };
      if (d <= L1 + La) { const a = -Math.PI / 2 + (d - L1) / r; return { x: xb + r * Math.cos(a), y: ym + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a), z: 4.2 }; }
      const e = d - L1 - La; return { x: xb - e, y: y2, nx: 0, ny: 1, z: 4.2 + (e / L1) * 4.2 };
    }
    const pathD = `M${xa} ${y1} H${xb} A${r} ${r} 0 0 1 ${xb} ${y2} H${xa}`;

    const tempCol = (T) => ramp(TEMP_RAMP, (T - 15) / 35);
    // pipe layers
    const gHotBand = S("g", null, svg);
    const NB = 90, bands = [];
    for (let i = 0; i < NB; i++) bands.push(S("path", { style: "fill:none;stroke-width:46;stroke-linecap:butt;opacity:.30" }, gHotBand));
    S("path", { d: pathD, style: "fill:none;stroke:var(--ink-2);stroke-width:48;opacity:.0" }, svg);
    const wallO1 = S("path", { d: pathD, style: "fill:none;stroke:var(--ink-2);stroke-width:1.2", transform: "" }, svg);
    // outline of outer tube: draw two offset paths
    const off = (o) => `M${xa} ${y1 - o} H${xb} A${r + o} ${r + o} 0 0 1 ${xb} ${y2 + o} H${xa} M${xa} ${y1 + o} H${xb} A${r - o} ${r - o} 0 0 1 ${xb} ${y2 - o} H${xa}`;
    wallO1.setAttribute("d", off(23));
    S("path", { d: pathD, style: "fill:none;stroke:var(--bg);stroke-width:18" }, svg);
    const coldBand = [];
    const gCold = S("g", null, svg);
    for (let i = 0; i < NB; i++) coldBand.push(S("path", { style: "fill:none;stroke-width:16;opacity:.35" }, gCold));
    S("path", { d: off(9), style: "fill:none;stroke:#c97b4a;stroke-width:2" }, svg); // copper wall
    const gP = S("g", null, svg);
    // section labels
    S("text", { x: (xa + xb) / 2, y: y1 - 34, class: "d-text", "text-anchor": "middle" }, svg).textContent = "section 1 · 4.2 m";
    S("text", { x: (xa + xb) / 2, y: y2 + 44, class: "d-text", "text-anchor": "middle" }, svg).textContent = "section 2 · 4.2 m";
    // flow labels
    S("text", { x: xa - 46, y: y1 - 10, class: "d-text", "text-anchor": "end", style: "fill:var(--hot)" }, svg).textContent = "hot in";
    S("text", { x: xa - 46, y: y2 + 18, class: "d-text", "text-anchor": "end", style: "fill:var(--hot)" }, svg).textContent = "hot out";
    const coldTop = S("text", { x: xa - 46, y: y1 + 18, class: "d-text", "text-anchor": "end", style: "fill:var(--cold)" }, svg);
    const coldBot = S("text", { x: xa - 46, y: y2 - 10, class: "d-text", "text-anchor": "end", style: "fill:var(--cold)" }, svg);

    // sensors
    const sensors = [
      { id: 4, d: 0, side: -1, stream: "hot" }, { id: 5, d: L1 + La / 2, side: 1, stream: "hot" }, { id: 6, d: LT, side: 1, stream: "hot" },
      { id: 1, stream: "cold" }, { id: 2, d: L1 + La / 2, stream: "cold" }, { id: 3, stream: "cold" },
    ];
    const gS = S("g", null, svg);
    sensors.forEach((s) => {
      s.g = S("g", { class: "sx-hover", tabindex: 0 }, gS);
      s.c = S("circle", { r: 9, style: `fill:var(--panel);stroke:${s.stream === "hot" ? "var(--hot)" : "var(--cold)"};stroke-width:2` }, s.g);
      s.t = S("text", { "text-anchor": "middle", style: "font:600 9px var(--font-mono);fill:var(--ink)" }, s.g);
      s.t.textContent = "T" + s.id;
      s.g.addEventListener("mousemove", (e) => tip.show(`<b>T${s.id} · ${s.stream} ${["", "inlet", "intermediate", "outlet", "inlet", "intermediate", "outlet"][s.id]}</b><span>${fmt(RUNS[run].T[s.id - 1], 1)} °C in run ${run}</span>`, e));
      s.g.addEventListener("mouseleave", () => tip.hide());
    });

    // temperature chart
    const gx0 = 200, gx1 = 600, gy0 = 340, gy1 = 470;
    const GX = (z) => gx0 + (z / 8.4) * (gx1 - gx0);
    const GY = (T) => gy1 - ((T - 15) / 35) * (gy1 - gy0);
    const gC = S("g", null, svg);
    S("text", { x: gx0, y: gy0 - 14, style: "fill:var(--ink-2);font:600 11px var(--font-title);letter-spacing:.1em" }, gC).textContent = "TEMPERATURE ALONG THE EXCHANGER";
    [20, 30, 40, 50].forEach((T) => {
      S("line", { x1: gx0, x2: gx1, y1: GY(T), y2: GY(T), style: "stroke:var(--rule)" }, gC);
      S("text", { x: gx0 - 6, y: GY(T) + 4, class: "d-text", "text-anchor": "end" }, gC).textContent = T + "°";
    });
    [0, 4.2, 8.4].forEach((z) => {
      S("line", { x1: GX(z), x2: GX(z), y1: gy0, y2: gy1, style: "stroke:var(--rule)" }, gC);
      S("text", { x: GX(z), y: gy1 + 26, class: "d-text", "text-anchor": "middle" }, gC).textContent = z + " m";
    });
    const hotLine = S("path", { style: "fill:none;stroke:var(--hot);stroke-width:2.4", "marker-end": "url(#ah-hot)" }, gC);
    const coldLine = S("path", { style: "fill:none;stroke:var(--cold);stroke-width:2.4", "marker-end": "url(#ah-cold)" }, gC);
    const dots = S("g", null, gC);

    // section split bars (right)
    const bx = 672, gB = S("g", null, svg);
    S("text", { x: bx, y: gy0 - 14, style: "fill:var(--ink-2);font:600 11px var(--font-title);letter-spacing:.1em" }, gB).textContent = "HOT POWER SPLIT";
    const bar1 = S("rect", { x: bx, width: 36, rx: 3, style: "fill:var(--hot)" }, gB);
    const bar2 = S("rect", { x: bx + 56, width: 36, rx: 3, style: "fill:var(--hot);opacity:.5" }, gB);
    const b1t = S("text", { x: bx + 18, class: "d-text-strong", "text-anchor": "middle" }, gB);
    const b2t = S("text", { x: bx + 74, class: "d-text-strong", "text-anchor": "middle" }, gB);
    S("text", { x: bx + 18, y: gy1 + 14, class: "d-text", "text-anchor": "middle" }, gB).textContent = "sec 1";
    S("text", { x: bx + 74, y: gy1 + 14, class: "d-text", "text-anchor": "middle" }, gB).textContent = "sec 2";

    // temperature colour legend
    const lgr = S("linearGradient", { id: "hx-grad" }, svg.querySelector("defs"));
    TEMP_RAMP.forEach((c, i) => S("stop", { offset: i / (TEMP_RAMP.length - 1), "stop-color": c }, lgr));
    S("rect", { x: 690, y: 30, width: 110, height: 8, rx: 2, fill: "url(#hx-grad)" }, svg);
    S("text", { x: 690, y: 52, class: "d-text" }, svg).textContent = "15 °C";
    S("text", { x: 800, y: 52, class: "d-text", "text-anchor": "end" }, svg).textContent = "50 °C";

    // temperature models (piecewise linear between sensors)
    function hotT(z) { const T = RUNS[run].T; return z <= 4.2 ? lerp(T[3], T[4], z / 4.2) : lerp(T[4], T[5], (z - 4.2) / 4.2); }
    function coldT(z) {
      const R = RUNS[run], T = R.T;
      const zz = R.counter ? 8.4 - z : z; // distance from the cold inlet
      return zz <= 4.2 ? lerp(T[0], T[1], zz / 4.2) : lerp(T[1], T[2], (zz - 4.2) / 4.2);
    }

    const particles = [];
    for (let i = 0; i < 70; i++) particles.push({ hot: true, d: Math.random() * LT, o: (Math.random() < 0.5 ? -1 : 1) * (13 + Math.random() * 7), el: S("circle", { r: 2.6 }, gP) });
    for (let i = 0; i < 46; i++) particles.push({ hot: false, d: Math.random() * LT, o: (Math.random() - 0.5) * 8, el: S("circle", { r: 2.2 }, gP) });

    readouts(readout, [
      { key: "q", k: "Q hot / cold [kW]", v: "–" },
      { key: "lm", k: "ΔT_lm", v: "–" },
      { key: "ua", k: "UA", v: "–" },
      { key: "u", k: "U", v: "–" },
      { key: "eff", k: "Effectiveness", v: "–" },
    ]);

    function update() {
      const R = RUNS[run];
      for (let i = 0; i < NB; i++) {
        const d0 = (i / NB) * LT, d1 = ((i + 1) / NB) * LT + 0.5;
        const a = at(d0), b = at(d1);
        const dd = d0 > L1 && d0 < L1 + La ? `M${a.x} ${a.y} A${r} ${r} 0 0 1 ${b.x} ${b.y}` : `M${a.x} ${a.y} L${b.x} ${b.y}`;
        bands[i].setAttribute("d", dd); bands[i].style.stroke = tempCol(hotT(a.z));
        coldBand[i].setAttribute("d", dd); coldBand[i].style.stroke = tempCol(coldT(a.z));
      }
      // sensors: cold inlet/outlet positions depend on arrangement
      const s = Object.fromEntries(sensors.map((x) => [x.id, x]));
      const place = (sn, x, y) => { sn.g.setAttribute("transform", `translate(${x},${y})`); sn.t.setAttribute("y", 3); };
      place(s[4], xa - 28, y1 - 14); place(s[6], xa - 28, y2 + 14);
      place(s[5], xb + r + 40, ym - 14); place(s[2], xb + r + 40, ym + 14);
      if (R.counter) { place(s[3], xa - 28, y1 + 14); place(s[1], xa - 28, y2 - 14); }
      else { place(s[1], xa - 28, y1 + 14); place(s[3], xa - 28, y2 - 14); }
      coldTop.textContent = R.counter ? "cold out" : "cold in";
      coldBot.textContent = R.counter ? "cold in" : "cold out";
      // chart
      let hd = "", cd = "";
      for (let i = 0; i <= 84; i++) { const z = i / 10; hd += `${i ? "L" : "M"}${GX(z)} ${GY(hotT(z))}`; }
      const zs = R.counter ? [...Array(85).keys()].map((i) => 8.4 - i / 10) : [...Array(85).keys()].map((i) => i / 10);
      zs.forEach((z, i) => (cd += `${i ? "L" : "M"}${GX(z)} ${GY(coldT(z))}`));
      hotLine.setAttribute("d", hd); coldLine.setAttribute("d", cd);
      dots.innerHTML = "";
      const T = R.T;
      [[0, T[3], "T4", "hot"], [4.2, T[4], "T5", "hot"], [8.4, T[5], "T6", "hot"],
       [R.counter ? 8.4 : 0, T[0], "T1", "cold"], [4.2, T[1], "T2", "cold"], [R.counter ? 0 : 8.4, T[2], "T3", "cold"]].forEach(([z, v, n, sname]) => {
        S("circle", { cx: GX(z), cy: GY(v), r: 4, style: `fill:${sname === "hot" ? "var(--hot)" : "var(--cold)"}` }, dots);
        S("text", { x: GX(z) + (z === 0 ? 6 : z === 8.4 ? -6 : 0), y: GY(v) + (sname === "hot" ? -9 : 17), class: "d-text", "text-anchor": z === 0 ? "start" : z === 8.4 ? "end" : "middle" }, dots).textContent = `${n} ${fmt(v, 1)}°`;
      });
      // bars
      const bh = 120;
      [[bar1, b1t, R.split[0]], [bar2, b2t, R.split[1]]].forEach(([b, tx, v]) => {
        const h = (v / 100) * bh;
        b.setAttribute("y", gy1 - h); b.setAttribute("height", h);
        tx.setAttribute("y", gy1 - h - 6); tx.textContent = fmt(v, 1) + "%";
      });
      setReadout(readout, "q", `${fmt(R.Qh, 2)} / ${fmt(R.Qc, 2)}`, "", `imbalance ${fmt((R.Qh - R.Qc) / ((R.Qh + R.Qc) / 2) * 100, 1)} % (heat loss)`);
      setReadout(readout, "lm", `${fmt(R.lm, 2)} K`, "");
      setReadout(readout, "ua", `${fmt(R.UA)} W/K`, R.counter ? "ok" : "warn", `from Q_mean = ${fmt((R.Qh + R.Qc) / 2, 2)} kW`);
      setReadout(readout, "u", `${fmt(R.U)} W/m²K`, "", "A_m = 0.379 m²");
      setReadout(readout, "eff", fmt(R.eff, 3), "", R.counter ? "impossible in cocurrent (max 0.76)" : "hot side, (T4−T6)/(T4−T1)");
    }

    segmented(controls, { label: "Measured run", value: "A", options: [{ value: "A", label: "A · counter 95 %" }, { value: "B", label: "B · co 60 %" }], onchange: (v) => { run = v; update(); } });
    slider(controls, { label: "Playback speed", min: 0, max: 3, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + "×", oninput: (v) => (speed = v) });
    update();

    const stop = loop((dt) => {
      const R = RUNS[run];
      particles.forEach((p) => {
        const v = p.hot ? 0.62 : R.vc;
        const dir = p.hot || !R.counter ? 1 : -1;
        p.d += dir * v * dt * 55 * speed;
        if (p.d > LT) p.d -= LT; if (p.d < 0) p.d += LT;
        const q = at(p.d);
        p.el.setAttribute("cx", q.x + q.nx * p.o);
        p.el.setAttribute("cy", q.y + q.ny * p.o);
        p.el.style.fill = tempCol(p.hot ? hotT(q.z) : coldT(q.z));
      });
    });
    return () => stop();
  };

  /* ======================================================================
     4. Instant Quote — DXF to laser-cutting price
     ====================================================================== */
  SCH.quote = function ({ host, controls, readout }) {
    const W = 820, Hh = 460;
    const svg = root(W, Hh, "Five-step pipeline turning a motor plate drawing into a laser cutting quote, with animated laser");
    host.appendChild(svg);
    defs(svg);

    // geometry in mm (motor plate 120 × 80)
    const PW = 120, PH = 80, k = 2.9, ox = 50, oy = 110;
    const X = (x) => ox + x * k, Y = (y) => oy + (PH - y) * k;
    const circ = (cx, cy, r) => `M${X(cx + r)} ${Y(cy)} A${r * k} ${r * k} 0 1 0 ${X(cx - r)} ${Y(cy)} A${r * k} ${r * k} 0 1 0 ${X(cx + r)} ${Y(cy)}`;
    const rr = 8;
    const outer = `M${X(rr)} ${Y(0)} H${X(PW - rr)} A${rr * k} ${rr * k} 0 0 0 ${X(PW)} ${Y(rr)} V${Y(PH - rr)} A${rr * k} ${rr * k} 0 0 0 ${X(PW - rr)} ${Y(PH)} H${X(rr)} A${rr * k} ${rr * k} 0 0 0 ${X(0)} ${Y(PH - rr)} V${Y(rr)} A${rr * k} ${rr * k} 0 0 0 ${X(rr)} ${Y(0)}`;
    const slot = `M${X(49)} ${Y(60)} H${X(71)} A${4 * k} ${4 * k} 0 0 0 ${X(71)} ${Y(68)} H${X(49)} A${4 * k} ${4 * k} 0 0 0 ${X(49)} ${Y(60)}`;
    const CONTOURS = [
      { d: circ(10, 10, 3.25), len: 2 * Math.PI * 3.25, kind: "hole", type: "CIRCLE" },
      { d: circ(110, 10, 3.25), len: 2 * Math.PI * 3.25, kind: "hole", type: "CIRCLE" },
      { d: circ(110, 70, 3.25), len: 2 * Math.PI * 3.25, kind: "hole", type: "CIRCLE" },
      { d: circ(10, 70, 3.25), len: 2 * Math.PI * 3.25, kind: "hole", type: "CIRCLE" },
      { d: circ(60, 36, 11), len: 2 * Math.PI * 11, kind: "hole", type: "CIRCLE" },
      { d: slot, len: 2 * 22 + Math.PI * 8, kind: "hole", type: "LWPOLYLINE" },
      { d: outer, len: 2 * (PW + PH) - 8 * rr + 2 * Math.PI * rr, kind: "outer", type: "LINE + ARC" },
    ];
    const cutLen = CONTOURS.reduce((a, c) => a + c.len, 0);
    const pierces = CONTOURS.length;

    const MATS = {
      s235: { name: "Steel S235", rho: 7850, eur: 1.4, pf: 1.0, speed: { 2: 4500, 3: 3500, 5: 2500, 8: 1500 } },
      ss316: { name: "Stainless 316L", rho: 8000, eur: 4.2, pf: 1.3, speed: { 2: 4000, 3: 3000, 5: 1700, 8: 900 } },
      al: { name: "Aluminium 5754", rho: 2700, eur: 4.5, pf: 1.1, speed: { 2: 6000, 3: 4500, 5: 2600, 8: 1400 } },
    };
    const RATE = { machine: 120, setup: 35, margin: 0.25, minimum: 50, spacing: 10 };
    let mat = "s235", th = 3, qty = 10;

    function price(q) {
      const m = MATS[mat];
      const kg = ((PW + RATE.spacing) * (PH + RATE.spacing) * th) * 1e-9 * m.rho;
      const matCost = kg * m.eur;
      const sec = (cutLen / m.speed[th]) * 60 + pierces * (0.5 + 0.2 * th) * m.pf;
      const machine = (sec / 3600) * RATE.machine;
      const part = matCost + machine;
      const raw = (part * q + RATE.setup) * (1 + RATE.margin);
      const total = Math.max(RATE.minimum, raw);
      return { kg, matCost, sec, machine, part, total, unit: total / q, minApplied: raw < RATE.minimum };
    }

    // pipeline rail
    const STEPS = ["Read DXF", "Break into pieces", "Join contours", "Price", "Cut & quote"];
    const rail = S("g", null, svg);
    S("line", { x1: 90, x2: 730, y1: 44, y2: 44, style: "stroke:var(--rule);stroke-width:2" }, rail);
    const railFill = S("line", { x1: 90, y1: 44, y2: 44, style: "stroke:var(--accent);stroke-width:2" }, rail);
    const stepEls = STEPS.map((name, i) => {
      const x = 90 + i * 160;
      const g = S("g", { transform: `translate(${x},44)` }, rail);
      const c = S("circle", { r: 15, style: "fill:var(--panel);stroke:var(--rule);stroke-width:2" }, g);
      const n = S("text", { y: 4, "text-anchor": "middle", style: "font:600 12px var(--font-mono);fill:var(--ink-2)" }, g); n.textContent = i + 1;
      const l = S("text", { y: 34, "text-anchor": "middle", class: "d-text" }, g); l.textContent = name;
      return { c, n, l };
    });

    // part drawing
    const gPart = S("g", null, svg);
    const fill = S("path", { d: CONTOURS.map((c) => c.d).join(" "), style: "fill:var(--accent-soft);fill-rule:evenodd;opacity:0" }, gPart);
    const raw = CONTOURS.map((c) => S("path", { d: c.d, style: `fill:none;stroke-width:1.6;stroke:${c.type === "CIRCLE" ? "#2fc3ff" : c.type === "LWPOLYLINE" ? "#c08cf2" : "var(--ink)"}` }, gPart));
    const cuts = CONTOURS.map((c) => S("path", { d: c.d, style: "fill:none;stroke:var(--hot);stroke-width:2.6;opacity:.95" }, gPart));
    cuts.forEach((p) => { p._L = p.getTotalLength(); p.style.strokeDasharray = p._L; p.style.strokeDashoffset = p._L; });
    const gPts = S("g", { style: "opacity:0" }, gPart);
    raw.forEach((p) => { const L = p.getTotalLength(); for (let s = 0; s < L; s += 9) { const q = p.getPointAtLength(s); S("circle", { cx: q.x, cy: q.y, r: 1.5, style: "fill:var(--accent)" }, gPts); } });
    const gPierce = S("g", { style: "opacity:0" }, gPart);
    cuts.forEach((p, i) => {
      const q = p.getPointAtLength(0);
      S("circle", { cx: q.x, cy: q.y, r: 8, style: "fill:var(--bg);stroke:var(--hot);stroke-width:1.4" }, gPierce);
      S("text", { x: q.x, y: q.y + 3.5, "text-anchor": "middle", style: "font:600 9px var(--font-mono);fill:var(--hot)" }, gPierce).textContent = i + 1;
    });
    const head = S("g", { style: "opacity:0" }, gPart);
    S("circle", { r: 10, style: "fill:var(--hot);opacity:.25" }, head);
    S("circle", { r: 3.2, style: "fill:#fff;stroke:var(--hot);stroke-width:2" }, head);
    const sparks = S("g", null, gPart);
    // dims
    S("line", { x1: X(0), x2: X(PW), y1: Y(0) + 22, y2: Y(0) + 22, class: "d-dim", "marker-start": "url(#ah-ink)", "marker-end": "url(#ah-ink)" }, gPart);
    S("text", { x: X(PW / 2), y: Y(0) + 38, class: "d-text", "text-anchor": "middle" }, gPart).textContent = "120";
    S("line", { x1: X(PW) + 22, x2: X(PW) + 22, y1: Y(0), y2: Y(PH), class: "d-dim", "marker-start": "url(#ah-ink)", "marker-end": "url(#ah-ink)" }, gPart);
    S("text", { x: X(PW) + 30, y: Y(PH / 2) + 4, class: "d-text" }, gPart).textContent = "80";
    const status = S("text", { x: ox, y: Hh - 16, class: "d-text-strong" }, svg);

    // unit price chart
    const cx0 = 520, cx1 = 790, cy0 = 120, cy1 = 330;
    const gCh = S("g", null, svg);
    S("text", { x: cx0, y: cy0 - 16, style: "fill:var(--ink-2);font:600 11px var(--font-title);letter-spacing:.1em" }, gCh).textContent = "PRICE PER PART VS QUANTITY";
    const QX = (q) => cx0 + (Math.log10(q) / Math.log10(500)) * (cx1 - cx0);
    [1, 10, 100, 500].forEach((q) => {
      S("line", { x1: QX(q), x2: QX(q), y1: cy0, y2: cy1, style: "stroke:var(--rule)" }, gCh);
      S("text", { x: QX(q), y: cy1 + 14, class: "d-text", "text-anchor": "middle" }, gCh).textContent = q;
    });
    const curve = S("path", { style: "fill:none;stroke:var(--accent);stroke-width:2.2" }, gCh);
    const minZone = S("rect", { y: cy0, height: cy1 - cy0, style: "fill:var(--warn);opacity:.08" }, gCh);
    const yLbl = S("g", null, gCh);
    const mk = S("circle", { r: 5.5, style: "fill:var(--hot);stroke:var(--bg);stroke-width:2" }, gCh);
    const mkT = S("text", { class: "d-text-strong" }, gCh);
    S("text", { x: cx1, y: cy1 + 30, class: "d-text", "text-anchor": "end" }, gCh).textContent = "parts (log) · illustrative rates";

    readouts(readout, [
      { key: "len", k: "Cut length", v: `${fmt(cutLen, 1)} mm` },
      { key: "pierce", k: "Pierces", v: `${pierces}`, s: "6 holes first, outer last" },
      { key: "time", k: "Laser time / part", v: "–" },
      { key: "unit", k: "Price per part", v: "–" },
      { key: "total", k: "Order total", v: "–" },
    ]);

    function update() {
      const p = price(qty);
      setReadout(readout, "time", `${fmt(p.sec, 1)} s`, "", `${MATS[mat].speed[th]} mm/min at ${th} mm`);
      setReadout(readout, "unit", `€ ${fmt(p.unit, 2)}`, p.minApplied ? "warn" : "ok", `material € ${fmt(p.matCost, 2)} · laser € ${fmt(p.machine, 2)}`);
      setReadout(readout, "total", `€ ${fmt(p.total, 2)}`, p.minApplied ? "warn" : "", p.minApplied ? "minimum order applied" : `setup € ${RATE.setup} · margin ${RATE.margin * 100} %`);
      const qs = []; for (let i = 0; i <= 60; i++) qs.push(Math.pow(500, i / 60));
      const us = qs.map((q) => price(q).unit);
      const uMax = Math.max(...us) * 1.15, uMin = Math.min(...us) * 0.8;
      const UY = (u) => cy1 - (Math.log(u / uMin) / Math.log(uMax / uMin)) * (cy1 - cy0);
      curve.setAttribute("d", qs.map((q, i) => `${i ? "L" : "M"}${QX(q).toFixed(1)} ${UY(us[i]).toFixed(1)}`).join(""));
      yLbl.innerHTML = "";
      [0.5, 1, 2, 5, 10, 20, 50].filter((u) => u > uMin && u < uMax).forEach((u) => {
        S("line", { x1: cx0, x2: cx1, y1: UY(u), y2: UY(u), style: "stroke:var(--rule)" }, yLbl);
        S("text", { x: cx0 - 6, y: UY(u) + 4, class: "d-text", "text-anchor": "end" }, yLbl).textContent = "€" + u;
      });
      let qMin = 0; for (const q of qs) if (price(q).minApplied) qMin = q;
      minZone.setAttribute("x", cx0); minZone.setAttribute("width", qMin ? QX(qMin) - cx0 : 0);
      mk.setAttribute("cx", QX(qty)); mk.setAttribute("cy", UY(p.unit));
      const right = QX(qty) > 690;
      mkT.setAttribute("x", QX(qty) + (right ? -10 : 10)); mkT.setAttribute("y", UY(p.unit) - 10);
      mkT.setAttribute("text-anchor", right ? "end" : "start");
      mkT.textContent = `${qty} × € ${fmt(p.unit, 2)}`;
    }

    select(controls, { label: "Material", value: mat, options: Object.entries(MATS).map(([k2, m]) => ({ value: k2, label: m.name })), onchange: (v) => { mat = v; update(); } });
    select(controls, { label: "Thickness", value: th, options: [2, 3, 5, 8].map((t) => ({ value: t, label: t + " mm" })), onchange: (v) => { th = +v; update(); } });
    slider(controls, { label: "Quantity", min: 0, max: 100, step: 1, value: 37, fmt: () => qty, oninput: (v) => { qty = Math.max(1, Math.round(Math.pow(500, v / 100))); update(); } });
    controls.querySelector('input[type="range"]').dispatchEvent(new Event("input"));

    // timeline
    const T_STEP = [0, 1.6, 3.2, 4.8, 6.2], T_END = 14.5;
    const cutStart = 6.4, cutDur = 6.8, totalL = cuts.reduce((a, p) => a + p._L, 0);
    let time = 0;
    const sparkList = [];
    const stop = loop((dt) => {
      time += dt; if (time > T_END) time = 0;
      const step = T_STEP.filter((s) => time >= s).length - 1;
      stepEls.forEach((e, i) => {
        const on = i <= step;
        e.c.style.fill = i === step ? "var(--accent)" : on ? "var(--panel-2)" : "var(--panel)";
        e.c.style.stroke = on ? "var(--accent)" : "var(--rule)";
        e.n.style.fill = i === step ? "var(--bg)" : on ? "var(--accent)" : "var(--ink-2)";
      });
      railFill.setAttribute("x2", 90 + Math.min(4, step + clamp((time - T_STEP[step]) / ((T_STEP[step + 1] || T_END) - T_STEP[step]), 0, 1)) * 160);
      raw.forEach((p, i) => (p.style.opacity = clamp((time - i * 0.15) / 0.4, 0, 1)));
      gPts.style.opacity = step === 1 ? 1 : step >= 2 ? 0.25 : 0;
      fill.style.opacity = clamp((time - 3.2) / 0.6, 0, 1);
      gPierce.style.opacity = step >= 2 ? 1 : 0;
      const msgs = ["Reading entities: 4 CIRCLE + 1 CIRCLE + LWPOLYLINE + LINE/ARC outline · mm", "Flattening arcs every 2°, keeping exact lengths", `Joined ${pierces} closed contours · 1 outer + ${pierces - 1} holes`, `Pricing: ${fmt(cutLen, 0)} mm cut, ${pierces} pierces, ${MATS[mat].name} ${th} mm`, "Cutting: holes first, then the outer contour so the part stays put"];
      status.textContent = msgs[step];
      // laser
      let s = (time - cutStart) / cutDur * totalL;
      head.style.opacity = s > 0 && s < totalL ? 1 : 0;
      cuts.forEach((p) => {
        const local = clamp(s, 0, p._L);
        p.style.strokeDashoffset = p._L - local;
        if (s > 0 && s < p._L) {
          const q = p.getPointAtLength(local);
          head.setAttribute("transform", `translate(${q.x},${q.y})`);
          if (Math.random() < 0.7) sparkList.push({ x: q.x, y: q.y, vx: (Math.random() - 0.5) * 80, vy: (Math.random() - 0.2) * 70, life: 0.35, el: S("circle", { r: 1.3, style: "fill:#ffd27a" }, sparks) });
        }
        s -= p._L;
      });
      if (time < cutStart) cuts.forEach((p) => (p.style.strokeDashoffset = p._L));
      for (let i = sparkList.length - 1; i >= 0; i--) {
        const sp = sparkList[i]; sp.life -= dt; sp.x += sp.vx * dt; sp.y += sp.vy * dt; sp.vy += 200 * dt;
        if (sp.life <= 0) { sp.el.remove(); sparkList.splice(i, 1); continue; }
        sp.el.setAttribute("cx", sp.x); sp.el.setAttribute("cy", sp.y); sp.el.style.opacity = sp.life / 0.35;
      }
    });
    return () => stop();
  };

  /* ======================================================================
     5. SwageWork — AI builds a parametric pillow block
     ====================================================================== */
  SCH.swagework = function ({ host, controls, readout }) {
    const grid = H("div", { class: "sw-grid" });
    const side = H("div", { class: "sw-side" });
    const chat = H("div", { class: "sw-chat", "aria-live": "polite" });
    const code = H("pre", { class: "sw-code" });
    side.append(chat, code);
    const view = H("div", { class: "sw-view" });
    grid.append(side, view);
    host.appendChild(grid);
    const svg = root(600, 440, "Isometric view of a parametric pillow block assembly built by the AI");
    view.appendChild(svg);
    const tip = tooltip(host);

    const P = { d: 12, L: 90, explode: 0 };
    const c30 = Math.cos(Math.PI / 6), s30 = 0.5, sc = 2.3, ox = 300, oy = 250;
    const pr = (x, y, z) => [ox + (x - y) * c30 * sc, oy + (x + y) * s30 * sc - z * sc];
    const poly = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";

    const layers = { plate: S("g", null, svg), boltsBack: S("g", null, svg), shaftBack: S("g", null, svg), block: S("g", null, svg), shaftFront: S("g", null, svg), boltsFront: S("g", null, svg), dims: S("g", null, svg) };
    const appear = { plate: 0, block: 0, shaft: 0, bolts: 0 };
    const target = { plate: 0, block: 0, shaft: 0, bolts: 0 };
    const INFO = {
      plate: () => `<b>base_plate</b><span>box(plate_L = ${P.L}, 50, 8)</span>`,
      block: () => `<b>block</b><span>box(24, ${blockW()}, ${blockH()}) − bore Ø${P.d + 2}</span>`,
      shaft: () => `<b>shaft</b><span>cylinder(d = ${P.d}, L = ${P.L + 10}, axis = X)</span>`,
      bolts: () => `<b>bolts</b><span>array(bolt_M6, 2 × 2, pitch ${P.L - 16} × 34)</span>`,
    };
    Object.entries({ plate: ["plate"], block: ["block"], shaft: ["shaftBack", "shaftFront"], bolts: ["boltsBack", "boltsFront"] }).forEach(([k, gs]) => gs.forEach((g) => {
      layers[g].classList.add("sx-hover");
      layers[g].addEventListener("mousemove", (e) => tip.show(INFO[k](), e));
      layers[g].addEventListener("mouseleave", () => tip.hide());
    }));

    const blockW = () => Math.min(46, 30 + P.d);
    const blockH = () => Math.max(32, P.d + 24);
    const F = { top: "fill:var(--panel-2);stroke:var(--accent);stroke-width:1.2", sx: "fill:var(--accent-soft);stroke:var(--accent);stroke-width:1.2", sy: "fill:var(--bg-2);stroke:var(--accent);stroke-width:1.2" };

    function box(g, x0, x1, y0, y1, z0, z1, style) {
      const st2 = style || F;
      S("path", { d: poly([pr(x1, y0, z0), pr(x1, y1, z0), pr(x1, y1, z1), pr(x1, y0, z1)]), style: st2.sx }, g);
      S("path", { d: poly([pr(x0, y1, z0), pr(x1, y1, z0), pr(x1, y1, z1), pr(x0, y1, z1)]), style: st2.sy }, g);
      S("path", { d: poly([pr(x0, y0, z1), pr(x1, y0, z1), pr(x1, y1, z1), pr(x0, y1, z1)]), style: st2.top }, g);
    }
    function cyl(g, axis, c, r, a0, a1, style, capStyle) {
      // circle points in the plane normal to the axis
      const pt = (a, th) => axis === "x" ? [a, c[0] + r * Math.cos(th), c[1] + r * Math.sin(th)] : [c[0] + r * Math.cos(th), c[1] + r * Math.sin(th), a];
      const ring = (a) => { const out = []; for (let i = 0; i < 36; i++) out.push(pr(...pt(a, (i / 36) * Math.PI * 2))); return out; };
      const far = ring(a0), near = ring(a1);
      const p0 = pr(...pt(a0, 0)), p1 = pr(...(axis === "x" ? [a0 + 1, ...pt(a0, 0).slice(1)] : [...pt(a0, 0).slice(0, 2), a0 + 1]));
      let dx = p1[0] - p0[0], dy = p1[1] - p0[1]; const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
      const nx = -dy, ny = dx;
      let iMax = 0, iMin = 0;
      far.forEach((p, i) => { const v = p[0] * nx + p[1] * ny; if (v > far[iMax][0] * nx + far[iMax][1] * ny) iMax = i; if (v < far[iMin][0] * nx + far[iMin][1] * ny) iMin = i; });
      S("path", { d: poly(far), style }, g);
      S("path", { d: poly([far[iMax], near[iMax], near[iMin], far[iMin]]), style }, g);
      S("path", { d: poly(near), style: capStyle || style }, g);
    }

    function build() {
      Object.values(layers).forEach((g) => (g.innerHTML = ""));
      const e = P.explode, ease = (v) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
      const drop = (k) => (1 - ease(appear[k])) * 70;
      const vis = (k) => appear[k] > 0.001;
      const L = P.L, hb = blockH(), bw = blockW(), zc = 8 + hb * 0.55;
      const zPlate = drop("plate"), zBlock = e * 34 + drop("block"), zShaft = e * 70 + drop("shaft"), zBolt = e * 104 + drop("bolts");
      Object.entries({ plate: [layers.plate], block: [layers.block], shaft: [layers.shaftBack, layers.shaftFront], bolts: [layers.boltsBack, layers.boltsFront] })
        .forEach(([k, gs]) => gs.forEach((g) => (g.style.opacity = clamp(appear[k] * 1.6, 0, 1))));
      if (vis("plate")) box(layers.plate, -L / 2, L / 2, -25, 25, zPlate, zPlate + 8);
      if (vis("bolts")) {
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
          const g = sx + sy <= 0 ? layers.boltsBack : layers.boltsFront;
          const bx = sx * (L / 2 - 8), by = sy * 17;
          cyl(g, "z", [bx, by], 4.6, zBolt + 8, zBolt + 13, "fill:var(--panel-2);stroke:var(--ink-2);stroke-width:1", "fill:var(--ink-3);stroke:var(--ink-2);stroke-width:1");
        });
      }
      const shaftStyle = "fill:var(--hot-soft);stroke:var(--hot);stroke-width:1.3";
      const shaftCap = "fill:var(--panel);stroke:var(--hot);stroke-width:1.6";
      if (vis("shaft")) cyl(layers.shaftBack, "x", [0, zc + zShaft], P.d / 2, -(L + 10) / 2, -12, shaftStyle, shaftStyle);
      if (vis("block")) {
        box(layers.block, -12, 12, -bw / 2, bw / 2, zBlock + 8, zBlock + 8 + hb);
        // bore ring on the +x face
        const ring = []; for (let i = 0; i < 36; i++) { const th = (i / 36) * Math.PI * 2; ring.push(pr(12, ((P.d + 2) / 2) * Math.cos(th), zc + zBlock + ((P.d + 2) / 2) * Math.sin(th))); }
        S("path", { d: poly(ring), style: "fill:var(--bg);stroke:var(--accent);stroke-width:1.2" }, layers.block);
      }
      if (vis("shaft")) cyl(layers.shaftFront, "x", [0, zc + zShaft], P.d / 2, 12, (L + 10) / 2, shaftStyle, shaftCap);
      // dimensions
      if (vis("plate")) {
        const a = pr(-L / 2, 40, zPlate), b = pr(L / 2, 40, zPlate);
        const a0 = pr(-L / 2, 27, zPlate), b0 = pr(L / 2, 27, zPlate);
        S("line", { x1: a0[0], y1: a0[1], x2: a[0], y2: a[1], class: "d-dim" }, layers.dims);
        S("line", { x1: b0[0], y1: b0[1], x2: b[0], y2: b[1], class: "d-dim" }, layers.dims);
        S("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "d-dim" }, layers.dims);
        S("text", { x: (a[0] + b[0]) / 2 - 10, y: (a[1] + b[1]) / 2 + 18, class: "d-text-strong", "text-anchor": "end" }, layers.dims).textContent = `plate_L = ${L}`;
      }
      if (vis("shaft")) {
        const q = pr((L + 10) / 2, 0, zc + zShaft);
        S("text", { x: q[0] + 18, y: q[1] + 4, class: "d-text-strong", style: "fill:var(--hot)" }, layers.dims).textContent = `Ø${P.d}`;
      }
    }

    function renderCode(flash) {
      const n = (v, key) => `<span class="num${flash === key ? " flash" : ""}">${v}</span>`;
      code.innerHTML =
        `<span class="cm"># generated by the AI · edit any number</span>\n` +
        `shaft_d = ${n(P.d, "d")}\nplate_L = ${n(P.L, "L")}\n\n` +
        `plate = <span class="kw">box</span>(plate_L, 50, 8)\n` +
        `block = <span class="kw">box</span>(24, 30 + shaft_d, shaft_d + 24).at(z=8)\n` +
        `block -= <span class="kw">cylinder</span>(d=shaft_d + 2, axis=X)\n` +
        `shaft = <span class="kw">cylinder</span>(d=shaft_d, L=plate_L + 10, axis=X)\n` +
        `bolts = <span class="kw">array</span>(bolt_M6, 2, 2, pitch=(plate_L - 16, 34))`;
    }

    const SCRIPT = [
      [0.4, "user", "A pillow block for a 12 mm shaft on a 90 × 50 mm plate."],
      [1.4, "ai", "I'll build it as a parametric part in four steps."],
      [2.2, "tool", "✓ add_box(base_plate)", "plate"],
      [3.2, "tool", "✓ add_box(block) − bore", "block"],
      [4.2, "tool", "✓ add_cylinder(shaft)", "shaft"],
      [5.2, "tool", "✓ pattern(bolt_M6, 2 × 2)", "bolts"],
      [6.3, "ai", "Done. Change shaft_d or plate_L and the part rebuilds without re-prompting."],
    ];
    let t = 0, next = 0;
    function replay() {
      chat.innerHTML = ""; t = 0; next = 0;
      Object.keys(target).forEach((k) => { target[k] = 0; appear[k] = 0; });
    }

    readouts(readout, [
      { key: "turn", k: "AI turn", v: "1 undo step", s: "“Undo Claude's changes” reverts it" },
      { key: "params", k: "Named dimensions", v: "2", s: "shaft_d, plate_L" },
      { key: "parts", k: "Bodies", v: "0" },
      { key: "export", k: "Export", v: "STEP / STL", s: "also 3MF, OBJ, GLB, PLY" },
    ]);

    slider(controls, { label: "shaft_d", min: 8, max: 20, step: 1, value: 12, fmt: (v) => v + " mm", oninput: (v) => { P.d = v; renderCode("d"); } });
    slider(controls, { label: "plate_L", min: 70, max: 130, step: 2, value: 90, fmt: (v) => v + " mm", oninput: (v) => { P.L = v; renderCode("L"); } });
    slider(controls, { label: "Explode", min: 0, max: 100, step: 1, value: 0, fmt: (v) => v + " %", oninput: (v) => (P.explode = v / 100) });
    const wrap = H("div", { class: "ctl" }); wrap.appendChild(H("span", null, "Build"));
    const btn = H("button", { type: "button", class: "btn small" }, "↻ Replay the AI build"); btn.addEventListener("click", replay);
    wrap.appendChild(btn); controls.appendChild(wrap);

    renderCode();
    const stop = loop((dt) => {
      t += dt;
      while (next < SCRIPT.length && t >= SCRIPT[next][0]) {
        const [, who, text, part] = SCRIPT[next];
        chat.appendChild(H("div", { class: "sw-msg " + who }, text));
        if (part) target[part] = 1;
        next++;
      }
      Object.keys(appear).forEach((k) => (appear[k] += (target[k] - appear[k]) * Math.min(1, dt * 4)));
      setReadout(readout, "parts", String(Object.values(target).filter(Boolean).length + (target.bolts ? 3 : 0)));
      build();
    });
    return () => stop();
  };

  /* ======================================================================
     6. Startup HQ — strategy path and client project lifecycle
     ====================================================================== */
  SCH.startup = function ({ host, controls, readout }) {
    const W = 820, Hh = 470;
    const svg = root(W, Hh, "Startup strategy path and the six-step industrial client lifecycle");
    host.appendChild(svg);
    defs(svg);

    const PATH = [
      { t: "Services", d: "Sell AI-powered engineering software services to local SMEs. Take 30–50 % upfront so no project costs us money." },
      { t: "Spot patterns", d: "Track which requests repeat. Three clients wanting the same thing is a validated product idea." },
      { t: "Product", d: "Build the repeated solution as a SaaS product. Service income pays the bills while it grows." },
      { t: "Funding (optional)", d: "Only after traction: accelerators, grants, angels. Traction gives better terms, or makes funding unnecessary." },
    ];
    const LIFE = [
      { t: "Site visit", d: "Walk the shop floor. See the process, the machines and the manual work. Ask about volumes, cost of defects and who decides." },
      { t: "Feasibility", d: "Ask for sample data (photos, sensor logs, drawings, old quotes). Spend about a week proving it can work." },
      { t: "Paid pilot", d: "Fixed scope and price, 30–50 % upfront, with measurable success criteria agreed up front." },
      { t: "Shadow mode", d: "Run alongside the existing process while humans still decide. Compare results and fix edge cases." },
      { t: "Rollout", d: "Go live, train operators and engineers, document everything, collect the final payment." },
      { t: "Support & case study", d: "Monthly support fee, plus a case study with real numbers: the best sales tool for the next client." },
    ];

    // strategy path along the top
    const py = 70, px0 = 110, px1 = 710;
    S("line", { x1: px0, x2: px1, y1: py, y2: py, style: "stroke:var(--rule);stroke-width:2" }, svg);
    const flowLine = S("line", { x1: px0, x2: px1, y1: py, y2: py, style: "stroke:var(--accent);stroke-width:2;stroke-dasharray:6 10" }, svg);
    const token = S("circle", { r: 5, style: "fill:var(--hot)" }, svg);
    const pathNodes = PATH.map((p, i) => {
      const x = px0 + i * (px1 - px0) / 3;
      const g = S("g", { class: "sx-hover", tabindex: 0, transform: `translate(${x},${py})` }, svg);
      const c = S("circle", { r: 22, style: "fill:var(--panel);stroke:var(--accent);stroke-width:2" }, g);
      S("text", { y: 5, "text-anchor": "middle", style: "font:600 14px var(--font-mono);fill:var(--ink)" }, g).textContent = i + 1;
      S("text", { y: 42, "text-anchor": "middle", class: "d-text" }, g).textContent = p.t;
      return { g, c, ...p };
    });

    // lifecycle ring
    const rx = 300, ry = 305, R = 112;
    S("circle", { cx: rx, cy: ry, r: R, style: "fill:none;stroke:var(--rule);stroke-width:2" }, svg);
    const arc = S("path", { style: "fill:none;stroke:var(--accent);stroke-width:4;stroke-linecap:round" }, svg);
    S("circle", { cx: rx, cy: ry, r: 52, style: "fill:var(--accent-soft);stroke:var(--accent)" }, svg);
    S("text", { x: rx, y: ry - 4, "text-anchor": "middle", style: "font:600 14px var(--font-title);fill:var(--ink)" }, svg).textContent = "Industrial";
    S("text", { x: rx, y: ry + 14, "text-anchor": "middle", style: "font:600 14px var(--font-title);fill:var(--ink)" }, svg).textContent = "client";
    S("text", { x: 40, y: 160, style: "fill:var(--ink-2);font:600 11px var(--font-title);letter-spacing:.1em" }, svg).textContent = "CLIENT PROJECT LIFECYCLE";
    const lifeNodes = LIFE.map((p, i) => {
      const a = -Math.PI / 2 + (i / LIFE.length) * Math.PI * 2;
      const x = rx + R * Math.cos(a), y = ry + R * Math.sin(a);
      const g = S("g", { class: "sx-hover", tabindex: 0, transform: `translate(${x},${y})` }, svg);
      const c = S("circle", { r: 18, style: "fill:var(--panel);stroke:var(--accent);stroke-width:2" }, g);
      S("text", { y: 4.5, "text-anchor": "middle", style: "font:600 12px var(--font-mono);fill:var(--ink)" }, g).textContent = i + 1;
      const lx = Math.cos(a) * 34, ly = Math.sin(a) * 34;
      S("text", { x: lx, y: ly + 4, "text-anchor": Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end", class: "d-text" }, g).textContent = p.t;
      return { g, c, a, ...p };
    });

    // detail panel
    const card = S("g", { transform: "translate(520,190)" }, svg);
    S("rect", { width: 280, height: 210, rx: 10, style: "fill:var(--panel);stroke:var(--rule)" }, card);
    const cTag = S("text", { x: 18, y: 30, style: "fill:var(--accent);font:600 11px var(--font-title);letter-spacing:.1em" }, card);
    const cTitle = S("text", { x: 18, y: 56, style: "fill:var(--ink);font:600 20px var(--font-title)" }, card);
    const fo = S("foreignObject", { x: 18, y: 68, width: 250, height: 130 }, card);
    const body = H("div", { style: "font:13.5px/1.5 var(--font-body);color:var(--ink-2)" });
    fo.appendChild(body);

    let auto = true, idx = 0, phase = 0, sel = null;
    function show(kind, i) {
      const item = kind === "path" ? PATH[i] : LIFE[i];
      cTag.textContent = kind === "path" ? `STRATEGY · STEP ${i + 1} OF 4` : `CLIENT PROJECT · STEP ${i + 1} OF 6`;
      cTitle.textContent = item.t;
      body.textContent = item.d;
      pathNodes.forEach((n, j) => (n.c.style.fill = kind === "path" && j === i ? "var(--accent)" : "var(--panel)"));
      lifeNodes.forEach((n, j) => (n.c.style.fill = kind === "life" && j === i ? "var(--accent)" : j < i && kind === "life" ? "var(--accent-soft)" : "var(--panel)"));
      if (kind === "life") {
        const a0 = -Math.PI / 2, a1 = lifeNodes[i].a;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        arc.setAttribute("d", i === 0 ? "" : `M${rx} ${ry - R} A${R} ${R} 0 ${large} 1 ${rx + R * Math.cos(a1)} ${ry + R * Math.sin(a1)}`);
      }
      sel = { kind, i };
    }
    pathNodes.forEach((n, i) => { const f = () => { auto = false; show("path", i); }; n.g.addEventListener("click", f); n.g.addEventListener("focus", f); });
    lifeNodes.forEach((n, i) => { const f = () => { auto = false; show("life", i); }; n.g.addEventListener("click", f); n.g.addEventListener("focus", f); });

    segmented(controls, { label: "Tour", value: true, options: [{ value: true, label: "Auto-play" }, { value: false, label: "Manual" }], onchange: (v) => (auto = v) });
    readouts(readout, [
      { key: "up", k: "Upfront", v: "30–50 %", s: "no project costs money" },
      { key: "val", k: "Validation", v: "3 clients", s: "same request = product idea" },
      { key: "db", k: "Shared data", v: "Supabase", s: "login + row-level security" },
    ]);
    show("life", 0);

    let dash = 0;
    const stop = loop((dt) => {
      dash -= dt * 30; flowLine.style.strokeDashoffset = dash;
      phase += dt / 6; if (phase > 1) phase -= 1;
      token.setAttribute("cx", lerp(px0, px1, phase)); token.setAttribute("cy", py);
      if (auto) {
        idx += dt / 2.4;
        const all = PATH.length + LIFE.length, k = Math.floor(idx) % all;
        if (!sel || (k < PATH.length ? sel.kind !== "path" || sel.i !== k : sel.kind !== "life" || sel.i !== k - PATH.length)) show(k < PATH.length ? "path" : "life", k < PATH.length ? k : k - PATH.length);
      }
    });
    return () => stop();
  };

  window.SCHEMATICS = SCH;
})();
