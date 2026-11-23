# Boris Enev: portfolio website

A personal portfolio with an engineering-drawing look. Every project opens as a "drawing sheet" with a live, animated schematic you can control.

| Project | What the schematic does |
|---|---|
| EXPO51 electrolyser (Seal Stack 1.2) | Exploded stack you can pull apart, electrolyte flow and H₂/O₂ bubbles, rod torque → clamp force and PTFE pressure |
| Airliner wing box (DG1) | Tapered cantilever coloured by stress. Thickness and material sliders run the same equations as the MATLAB script (mass, deflection, min. thickness) |
| Pipe-in-pipe heat exchanger | Animated hot and cold flow coloured by temperature. Switch between the measured counter- and co-current runs |
| SwageWork | Replays an AI building a parametric pillow block. Drag `shaft_d` / `plate_L` and the part rebuilds |
| Instant Quote | Five-step DXF → price pipeline with a laser cutting the part. Material, thickness and quantity update the price curve |
| Startup HQ | Strategy path and client-project lifecycle, auto-touring or clickable |

## Structure

```
index.html          page shell
css/styles.css      all styling (dark blueprint + light paper theme)
js/data.js          ALL CONTENT: profile, experience, skills, projects, card thumbnails
js/svg.js           small SVG / control helpers
js/schematics.js    one interactive schematic per project
js/main.js          rendering, hero animation, project sheets, navigation
```

There's no build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Editing content

Everything you'd want to change lives in **`js/data.js`**. Search it for `TODO`: these are the details I couldn't find in your files:

- contact email, LinkedIn URL and a CV PDF link (`PROFILE.links`)
- start/graduation years for Fontys, secondary school and the youth-leader role
- whether to list Dutch under languages

To add a project, add an entry to `PROJECTS`. Then either point its `schematic` at an existing one, or add a new function to `js/schematics.js`.

Deep links work. For example, `#p-wingbox` opens the wing box sheet directly.

## Publishing on GitHub Pages

Settings → Pages → *Deploy from a branch* → pick the branch and `/ (root)`.
