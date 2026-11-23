/* ==========================================================================
   ALL SITE CONTENT LIVES HERE.
   Edit this file to change text, dates, links, experience and projects.
   Anything marked  TODO  is a value I could not find in your files: fill it in.
   ========================================================================== */

window.PROFILE = {
  name: "Boris Enev",
  eyebrow: "Mechanical Engineering · Eindhoven",
  role: "Mechanical engineering student who builds the hardware and the software around it.",
  summary:
    "I study Mechanical Engineering at Fontys in Eindhoven, in the middle of the Brainport region. " +
    "I design test rigs and structures, then write the tools that make engineering faster: " +
    "an AI-driven CAD app, an instant laser-cutting quote engine and the planning platform for our engineering startup.",
  location: "Eindhoven, the Netherlands",
  origin: "Sofia, Bulgaria",
  study: "BSc Mechanical Engineering, Fontys University of Applied Sciences",
  languages: "Bulgarian (native), English (fluent)", // TODO: add Dutch level if relevant
  status: "Open to internships and engineering projects",
  stats: [
    { value: "6", label: "projects with live schematics" },
    { value: "1", label: "commercial app shipped" },
    { value: "2", label: "countries lived & studied in" },
  ],
  about: [
    "I'm a <strong>mechanical engineering student at Fontys University of Applied Sciences</strong> in Eindhoven. I grew up in <strong>Sofia, Bulgaria</strong>, and moved to the Netherlands to study in the heart of Brainport, one of Europe's densest high-tech manufacturing regions.",
    "My coursework sits on the classic engineering core: <strong>dynamics, structural mechanics, heat transfer and product design</strong>. I like the moment a calculation turns into a part you can hold. In the EXPO51 project our team designed and built a membrane-less electrolyser cell, and in DG1 I sized the wing box of a long-range airliner in MATLAB.",
    "Alongside my studies I build software for engineers. <strong>SwageWork</strong> is a Windows 3D modelling app where an AI builds editable, parametric parts. <strong>Instant Quote</strong> turns a DXF drawing into a laser-cutting price in milliseconds. Together with fellow mechanical engineering and mechatronics students I'm setting up an <strong>AI engineering startup</strong> for manufacturing SMEs in the region.",
    "Before engineering took over, I spent years as a <strong>youth leader (madrich) in Hashomer Hatzair</strong>, running weekly activities and seminars and serving on the European movement's activism team. That is where I learned to plan, explain and lead a group.",
  ],
  links: {
    github: "https://github.com/borisenev01-dev",
    swagework: "https://swagework.github.io",
    email: "",     // TODO: your public contact email, e.g. "name@example.com"
    linkedin: "",  // TODO: your LinkedIn URL
    cv: "",        // TODO: path to a PDF of your CV, e.g. "assets/Boris-Enev-CV.pdf"
  },
};

/* kind: work | education | leadership */
window.EXPERIENCE = [
  {
    kind: "work",
    when: "2026 – now",
    title: "Co-founder",
    org: "AI engineering startup · Eindhoven",
    points: [
      "Setting up a company that builds AI software for engineering and manufacturing SMEs in Brainport.",
      "Wrote the strategy: start as a services business with paid pilots, then turn repeated client requests into a product.",
      "Built Startup HQ, the team's planning platform for strategy, Dutch legal and tax set-up, sales pipeline and project templates.",
    ],
  },
  {
    kind: "work",
    when: "2026",
    title: "Founder & developer, SwageWork",
    org: "Independent software product",
    points: [
      "Designed and shipped a Windows 3D modelling app where an AI builds and edits parametric parts while you watch.",
      "Works with Claude, ChatGPT, Gemini, local models (Ollama, LM Studio) and AI coding tools through one interface.",
      "Exports STEP, STL, 3MF, OBJ, GLB and PLY; includes a showroom with exploded views, section planes and parts lists.",
      "Handled the full launch: website, documentation, licensing and payments.",
    ],
  },
  {
    kind: "work",
    when: "2026",
    title: "Developer, Instant Quote",
    org: "Laser-cutting quote engine",
    points: [
      "Built a browser app that reads DXF drawings and prices laser-cut parts from cut length, pierces, material and quantity.",
      "Handles units, nested and mirrored blocks, bulge arcs, splines, open contours and duplicate lines.",
      "Covered the pipeline with 24 automated tests; produces a downloadable PDF quote.",
    ],
  },
  {
    kind: "education",
    when: "Current", // TODO: add your start year, e.g. "2024 – now"
    title: "BSc Mechanical Engineering",
    org: "Fontys University of Applied Sciences · Eindhoven",
    points: [
      "EXPO51: design and build of a membrane-less alkaline electrolyser test cell (team project).",
      "DG1 Dynamic System Behaviour: static, dynamic and thermal design of an aircraft wing box in MATLAB.",
      "Heat transfer practicum, dynamics (CM3T) and product design courses.",
    ],
  },
  {
    kind: "leadership",
    when: "2023",
    title: "Activism team member",
    org: "Hashomer Hatzair Europe · European coordination (mazkirut)",
    points: [
      "Part of the European team that promotes and organises coordinated local activism projects across the movement's branches.",
    ],
  },
  {
    kind: "leadership",
    when: "– 2025", // TODO: add the year you started
    title: "Youth leader (madrich)",
    org: "Hashomer Hatzair · Sofia",
    points: [
      "Planned and led weekly educational activities for a group of teenagers, tracking every session and its turnout.",
      "Led a leadership-training (hadracha) programme: how to write, run and improvise an activity.",
      "Co-organised seminars and joint events with other branches.",
    ],
  },
  {
    kind: "education",
    when: "Graduated", // TODO: add your graduation year
    title: "Secondary school",
    org: "134 SU \"Dimcho Debelyanov\" · Sofia, Bulgaria",
    points: ["Secondary education in Sofia before moving to the Netherlands."],
  },
];

window.SKILLS = [
  {
    group: "Engineering",
    icon: "gear",
    items: [
      { name: "Structural mechanics & stress analysis", level: 85, note: "beams, thin-walled sections, bolted joints" },
      { name: "Heat transfer & thermodynamics", level: 75, note: "LMTD, film coefficients, lab analysis" },
      { name: "Dynamics", level: 75 },
      { name: "Product design & prototyping", level: 80, note: "3D printing, laser cutting, seals" },
      { name: "Material selection (Ansys Granta EduPack)", level: 70 },
    ],
  },
  {
    group: "Software & computation",
    icon: "code",
    items: [
      { name: "MATLAB (symbolic & numeric)", level: 80 },
      { name: "TypeScript / JavaScript", level: 85 },
      { name: "HTML / CSS / SVG", level: 85 },
      { name: "CAD geometry & DXF / STEP / mesh formats", level: 80 },
      { name: "Supabase / SQL", level: 60 },
    ],
  },
  {
    group: "AI & product",
    icon: "spark",
    items: [
      { name: "LLM integration (Claude, OpenAI, Gemini, local)", level: 85 },
      { name: "Shipping software products", level: 75, note: "licensing, payments, docs, releases" },
      { name: "Business & strategy for a startup", level: 65 },
    ],
  },
  {
    group: "People",
    icon: "people",
    items: [
      { name: "Leading groups & teaching", level: 90, note: "years as a youth leader" },
      { name: "Team projects & reporting", level: 85 },
      { name: "Languages", level: 100, note: "Bulgarian (native) · English (fluent)" },
    ],
  },
];

/* Each project's "schematic" key must match an entry in js/schematics.js */
window.PROJECTS = [
  {
    id: "electrolyser",
    schematic: "electrolyser",
    title: "EXPO51 electrolyser cell",
    subtitle: "Seal Stack 1.2",
    context: "Fontys · team project",
    year: "2026",
    category: "hardware",
    blurb: "A membrane-less alkaline electrolyser test cell whose 0.75 mm electrode gap is set by PTFE film, not by bolt torque.",
    lead:
      "The team's final design for a flow-through alkaline electrolyser test cell. Three 0.25 mm PTFE films fix the electrode gap at 0.75 mm, the electrodes drop in from the top, and every fastener stays outside the electrolyte. Explode the stack, run the current and drag the torque to see why the gap no longer depends on the bolts.",
    points: [
      "<b>Compared four concepts</b> (existing round cell, square \"ideal\" cell, flat-sheet cell, toggle-clamp) in the team's 3D design sketchpad.",
      "<b>Iterated the Seal Stack three times</b>: moved all PTFE between the electrodes, switched the outer seals to EPDM, ran the ports through the cell for stacking, then separated the gas outlets.",
      "<b>Calculated the clamping</b>: 7 Nm per M8 rod gives about 3.3 kN each, 13.3 kN in total, and 14.2–14.5 MPa on the PTFE.",
      "<b>Checked the design</b> against 12 user requirements and wrote the assembly and leak-test procedure.",
    ],
    figs: [
      ["Electrode gap", "0.75 mm"],
      ["Clamp force", "13.3 kN"],
      ["Stack length", "54.35 mm"],
      ["Flow", "laminar, Re ≈ 90"],
    ],
    tags: ["Product design", "Sealing", "316L", "PTFE / EPDM", "POM-C", "3D printing"],
    links: [],
  },
  {
    id: "wingbox",
    schematic: "wingbox",
    title: "Airliner wing box",
    subtitle: "DG1 static design",
    context: "Fontys · DG1 course",
    year: "2026",
    category: "analysis",
    blurb: "Sizing the 35 m wing box of a long-range wide-body aircraft: stress, material, mass and deflection in MATLAB.",
    lead:
      "The wing box of a B777- or A350-class aircraft, modelled as a tapered thin-walled cantilever carrying the lift and a 7 t engine. The drawing below runs the same equations as my MATLAB script: change the wall thickness and material and watch stress, mass and deflection respond.",
    points: [
      "<b>Derived D(x) and M(x)</b> symbolically in MATLAB for a piecewise chord and the engine point load.",
      "<b>Wrote the section properties</b> (I, Q, y_max) of a hollow rectangle and studied how stress scales with thickness.",
      "<b>Selected the material</b> in EduPack from three composites, weighing specific strength against thermal conductivity for de-icing.",
      "<b>Estimated the tip deflection</b> by splitting the wing into a prismatic and a tapered segment.",
    ],
    figs: [
      ["Material", "Al–65% Al₂O₃"],
      ["Wall thickness", "2.2 mm"],
      ["Root stress", "1203 MPa"],
      ["Mass / tip deflection", "3029 kg / 5.1 cm"],
    ],
    tags: ["MATLAB", "Beam theory", "Material selection", "EduPack"],
    links: [],
  },
  {
    id: "heatx",
    schematic: "heatx",
    title: "Pipe-in-pipe heat exchanger",
    subtitle: "Heat transfer practicum",
    context: "Fontys · MEAEP22P lab",
    year: "2026",
    category: "analysis",
    blurb: "Measured and analysed an 8.4 m double-pipe exchanger in counter- and co-current flow, with a full LMTD analysis.",
    lead:
      "Two 4.2 m copper pipe-in-pipe sections in series, hot boiler water in the annulus and tap water in the core. Switch between the two measured runs to see the flow reverse, the temperature profiles change and the overall heat-transfer coefficient drop from 1210 to 929 W/K.",
    points: [
      "<b>Found two logging errors</b> in the data: flows logged as L/min were really mL/min, and the flow-arrangement labels were swapped (proven from the temperature profiles).",
      "<b>Calculated power, LMTD, UA and effectiveness</b> for each run, with an uncertainty range on UA.",
      "<b>Compared the measured UA</b> with a film-coefficient estimate, which came out 50 % low.",
      "<b>Split the power per section</b> using the intermediate sensors: the first section does 70–87 % of the work.",
    ],
    figs: [
      ["Power", "7.2–7.5 kW"],
      ["UA counter / co", "1210 / 929 W/K"],
      ["Effectiveness", "0.94 / 0.69"],
      ["Length", "2 × 4.2 m"],
    ],
    tags: ["Heat transfer", "LMTD", "Lab analysis", "Data validation"],
    links: [],
  },
  {
    id: "swagework",
    schematic: "swagework",
    title: "SwageWork",
    subtitle: "3D modelling with AI",
    context: "Own product",
    year: "2026",
    category: "software",
    blurb: "A Windows CAD app where an AI builds parametric parts while you watch. Every dimension stays editable.",
    lead:
      "Describe a part and an AI builds it with SwageWork's modelling tools as a small parametric script with named dimensions. Change a number and the part rebuilds instantly, without re-prompting. Replay the build below, then drag the shaft diameter or plate length.",
    points: [
      "<b>Built the modeller</b>: booleans, mirrors, arrays, extrusions, sketches with typed dimensions, mesh repair.",
      "<b>Connected any AI</b>: API keys for Claude, ChatGPT and Gemini, free local models, or Claude Code, Codex and Cursor through MCP.",
      "<b>Made AI edits safe</b>: each AI turn is one undo step and projects save themselves.",
      "<b>Shipped it</b>: showroom viewer with exploded views and section planes, website, docs, licensing and payments.",
    ],
    figs: [
      ["Platform", "Windows"],
      ["Export", "STEP · STL · 3MF · …"],
      ["AI providers", "10+"],
      ["Pricing", "one-time"],
    ],
    tags: ["Product", "CAD kernel", "LLM tools", "MCP", "3D"],
    links: [{ label: "swagework.github.io", href: "https://swagework.github.io" }],
  },
  {
    id: "quote",
    schematic: "quote",
    title: "Instant Quote",
    subtitle: "DXF → laser-cutting price",
    context: "Own project",
    year: "2026",
    category: "software",
    blurb: "Drop in a DXF and get a laser-cutting price: geometry, cut length, pierces, material and quantity breaks.",
    lead:
      "A five-step pipeline that turns a drawing into a price in a few milliseconds. Watch the laser cut the holes before the outer contour, and change material, thickness and quantity to see how setup cost and the minimum order shape the unit price. (Rates on this page are illustrative.)",
    points: [
      "<b>Wrote a DXF parser</b> that converts units, expands nested, rotated and mirrored blocks, and sets aside text and hatches.",
      "<b>Flattened arcs, bulges, ellipses and splines</b> while keeping the exact length for pricing.",
      "<b>Joined pieces into contours</b>, found the outer contour and holes, and flagged gaps and duplicates.",
      "<b>Priced the part</b> from material, laser time, pierces, setup and margin, with a PDF quote and 24 automated tests.",
    ],
    figs: [
      ["Pipeline", "5 steps"],
      ["Tests", "24 passing"],
      ["Runtime", "< 10 ms"],
      ["Output", "PDF quote"],
    ],
    tags: ["TypeScript", "Geometry", "DXF", "Pricing", "Testing"],
    links: [],
  },
  {
    id: "startup",
    schematic: "startup",
    title: "Startup HQ",
    subtitle: "Planning platform",
    context: "AI engineering startup",
    year: "2026",
    category: "software",
    blurb: "The shared planning platform for our AI-for-manufacturing startup: strategy, legal, sales and project playbooks.",
    lead:
      "Our startup's strategy is to fund itself: sell AI engineering services to manufacturing SMEs, spot the requests that repeat, and turn those into a product. Startup HQ holds that plan and the playbook for every client project. Click a step to read it.",
    points: [
      "<b>Wrote the strategy</b> and the six-step project lifecycle for industrial clients, from site visit to support contract.",
      "<b>Built the platform</b> as a plain HTML/CSS/JS site on GitHub Pages, with all content in one data file.",
      "<b>Added shared progress</b> through Supabase with login and row-level security for team members only.",
    ],
    figs: [
      ["Stack", "HTML · JS · Supabase"],
      ["Hosting", "GitHub Pages"],
      ["Region", "Brainport"],
      ["Model", "services → product"],
    ],
    tags: ["Strategy", "JavaScript", "Supabase", "RLS"],
    links: [{ label: "GitHub", href: "https://github.com/Startup-nameTBD/startup-hq" }],
  },
];

/* Small animated thumbnails for the project cards (inline SVG, 320 × 180) */
window.THUMBS = {
  electrolyser: `
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <rect x="70" y="30" width="26" height="120" class="d-fill"/>
      <rect x="98" y="48" width="22" height="84" class="d-fill"/>
      <rect x="124" y="58" width="6" height="64" fill="var(--ink-2)"/>
      <rect x="133" y="54" width="3" height="72" fill="var(--warn)"/><rect x="138" y="54" width="3" height="72" fill="var(--warn)"/><rect x="143" y="54" width="3" height="72" fill="var(--warn)"/>
      <rect x="149" y="58" width="6" height="64" fill="var(--ink-2)"/>
      <rect x="159" y="48" width="22" height="84" class="d-fill"/>
      <rect x="183" y="30" width="26" height="120" class="d-fill"/>
      <line x1="60" y1="40" x2="220" y2="40" class="d-center"/><line x1="60" y1="140" x2="220" y2="140" class="d-center"/>
      <g fill="none" stroke="var(--o2)" stroke-width="1.4"><circle class="t-rise" cx="106" cy="125" r="3"/><circle class="t-rise" style="animation-delay:-1.3s" cx="112" cy="120" r="2.4"/></g>
      <g fill="none" stroke="var(--h2)" stroke-width="1.4"><circle class="t-rise" cx="167" cy="125" r="3"/><circle class="t-rise" style="animation-delay:-.6s" cx="173" cy="118" r="2.2"/><circle class="t-rise" style="animation-delay:-1.7s" cx="164" cy="112" r="2.6"/><circle class="t-rise" style="animation-delay:-2.2s" cx="171" cy="128" r="2"/></g>
      <text x="240" y="70" class="d-text">gap</text><text x="240" y="86" class="d-text-strong">0.75 mm</text>
      <path d="M140 150 v18" class="d-line t-flow"/>
    </svg>`,
  wingbox: `
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <rect x="20" y="40" width="14" height="100" fill="none" stroke="var(--ink-3)"/>
      <path d="M34 40 l-14 14 M34 60 l-14 14 M34 80 l-14 14 M34 100 l-14 14 M34 120 l-14 14" class="d-thin"/>
      <g class="t-bend"><path d="M34 70 L80 70 L300 84 L300 92 L80 102 L34 102 Z" class="d-fill"/></g>
      <g stroke="var(--ok)" stroke-width="1.5"><path d="M60 140 v-30 M100 140 v-28 M140 140 v-25 M180 140 v-22 M220 140 v-19 M260 140 v-16"/></g>
      <path d="M118 104 q-12 0 -12 14 h28 q0 -14 -16 -14" fill="var(--panel-2)" stroke="var(--ink-2)"/>
      <text x="200" y="40" class="d-text">σ_root</text><text x="200" y="56" class="d-text-strong">1203 MPa</text>
    </svg>`,
  heatx: `
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <path d="M40 60 H250 A35 35 0 0 1 250 130 H40" fill="none" stroke="var(--hot)" stroke-width="22" stroke-opacity=".25"/>
      <path d="M40 60 H250 A35 35 0 0 1 250 130 H40" fill="none" stroke="var(--hot)" stroke-width="2" class="t-flow"/>
      <path d="M40 60 H250 A35 35 0 0 1 250 130 H40" fill="none" stroke="var(--cold)" stroke-width="6" stroke-opacity=".5"/>
      <path d="M40 60 H250 A35 35 0 0 1 250 130 H40" fill="none" stroke="var(--cold)" stroke-width="2" class="t-flow rev"/>
      <text x="44" y="38" class="d-text">T4 40.2 °C</text><text x="44" y="160" class="d-text">T6 18.6 °C</text>
      <text x="230" y="38" class="d-text-strong">UA 1210 W/K</text>
    </svg>`,
  swagework: `
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <rect x="16" y="22" width="120" height="26" rx="10" fill="var(--accent)" opacity=".9"/>
      <text x="24" y="39" font-size="10" font-family="var(--font-mono)" fill="var(--bg)">pillow block, Ø12</text>
      <rect x="16" y="56" width="96" height="18" rx="8" fill="var(--panel-2)" stroke="var(--rule)"/>
      <text x="24" y="69" font-size="9" font-family="var(--font-mono)" fill="var(--ok)">✓ add_box</text>
      <g class="t-pop">
        <path d="M190 120 l60 -30 l60 30 l-60 30 z" class="d-fill"/>
        <path d="M220 100 l30 -15 l30 15 v-34 l-30 -15 l-30 15 z" fill="var(--panel-2)" stroke="var(--accent)" stroke-width="1.5"/>
        <ellipse cx="250" cy="72" rx="9" ry="6" fill="var(--bg-2)" stroke="var(--hot)" stroke-width="2"/>
      </g>
    </svg>`,
  quote: `
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <rect x="40" y="40" width="150" height="100" rx="10" fill="var(--accent-soft)" stroke="var(--ink-3)"/>
      <rect x="40" y="40" width="150" height="100" rx="10" fill="none" stroke="var(--hot)" stroke-width="2.5" class="t-trace"/>
      <circle cx="58" cy="58" r="6" fill="var(--bg-2)" stroke="var(--accent)"/><circle cx="172" cy="58" r="6" fill="var(--bg-2)" stroke="var(--accent)"/>
      <circle cx="58" cy="122" r="6" fill="var(--bg-2)" stroke="var(--accent)"/><circle cx="172" cy="122" r="6" fill="var(--bg-2)" stroke="var(--accent)"/>
      <circle cx="115" cy="90" r="18" fill="var(--bg-2)" stroke="var(--accent)"/>
      <text x="212" y="76" class="d-text">10 × part</text><text x="212" y="96" class="d-text-strong" font-size="16">€ 8.42</text>
      <circle cx="212" cy="120" r="3" fill="var(--hot)" class="t-blink"/>
    </svg>`,
  startup: `
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <path d="M40 90 H280" class="d-thin"/><path d="M40 90 H280" class="d-line t-flow"/>
      <g fill="var(--panel-2)" stroke="var(--accent)" stroke-width="1.5">
        <circle cx="50" cy="90" r="16"/><circle cx="125" cy="90" r="16"/><circle cx="200" cy="90" r="16"/><circle cx="275" cy="90" r="16"/>
      </g>
      <g font-family="var(--font-mono)" font-size="11" fill="var(--ink)" text-anchor="middle"><text x="50" y="94">1</text><text x="125" y="94">2</text><text x="200" y="94">3</text><text x="275" y="94">4</text></g>
      <g class="d-text" text-anchor="middle"><text x="50" y="130">services</text><text x="125" y="130">patterns</text><text x="200" y="130">product</text><text x="275" y="130">scale</text></g>
    </svg>`,
};
