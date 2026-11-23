# Shushant Tiwari — Cinematic 3D Immersive Developer Portfolio

## 1. Project Overview
A premium monochrome, 8-section interactive developer portfolio engineered for **Shushant Tiwari** (BTech Computer Science & Engineering, IILM University, Greater Noida). The site integrates a continuous 3D visual storytelling canvas across all eight sections—morphing from a liquid-metal sculpture in the hero, separating into orbital components in About, forming project nodes, a technical constellation, a chronological spine, an architectural lattice, a credential gallery, and reassembling in Contact—while maintaining high readability, keyboard accessibility, and smooth performance on 8 GB RAM laptops.

> **Source Audit Note:** No original portfolio ZIP archive was attached to the build session, so this project was engineered cleanly from scratch using all verified personal, academic, project, experience, certification, and contact information provided in the specification (cross-checked against Shushant Tiwari's verified resume record). No individual project repository URLs, live demo URLs, certificate verification URLs, or resume download files were invented.

---

## 2. Technologies Used
- **Markup & Styling:** Semantic HTML5, modular CSS3 (`variables.css`, `reset.css`, `typography.css`, `layout.css`, `components.css`, `animations.css`, `responsive.css`)
- **Color Identity:** Strict monochrome palette (`#090A0C` Obsidian, `#17191D` Graphite, `#292D33` Gunmetal, `#777E87` Steel, `#C4C9D0` Silver, `#F2F3F4` Porcelain)
- **Typography:** Space Grotesk (display), Inter (body), IBM Plex Mono (technical metadata)
- **3D & Shaders:** Three.js `r128`, custom GLSL vertex/fragment shaders (3D Simplex noise liquid-metal displacement + Fresnel studio lighting), plus an automatic 3D-projected Canvas 2D fallback when WebGL or CDNs are unavailable
- **Motion & Scroll:** GSAP `3.12.5`, ScrollTrigger `3.12.5`, Lenis `1.1.18` (with automatic `IntersectionObserver` and `prefers-reduced-motion` fallbacks)
- **Interactive Visualizations:** Five dedicated procedural Canvas 2D project worlds (NotePilot, MedChain, Hyperlocal Weather Forecasting, GFG AutoSolver Pro, PlaceWise AI) and an interactive 6-domain Technical Expertise constellation graph
- **Optional Audio:** Web Audio API subtle UI feedback (disabled by default; user-controlled toggle in header)

---

## 3. Folder Structure
```text
Shushant_Tiwari_Portfolio/
├── index.html
├── README.md
├── robots.txt
├── sitemap.xml
├── favicon/
│   └── favicon.svg
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── typography.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
└── js/
    ├── main.js
    ├── data/
    │   └── portfolio-data.js
    ├── scenes/
    │   ├── shader-library.js
    │   ├── hero-scene.js
    │   └── project-scenes.js
    ├── components/
    │   ├── audio-engine.js
    │   ├── projects-ui.js
    │   └── skills-network.js
    └── core/
        ├── animation-manager.js
        ├── cursor-manager.js
        ├── navigation-manager.js
        └── scroll-manager.js
```

---

## 4. Installation
No build tools, bundlers, Docker containers, or `npm install` steps are required. This keeps the setup fast and lightweight on Windows laptops with limited RAM/SSD space.

1. Extract `Shushant_Tiwari_Cinematic_Portfolio_FINAL.zip`.
2. Open the extracted `Shushant_Tiwari_Portfolio/` folder.

---

## 5. Local Execution (Windows / macOS / Linux)
You can open `index.html` directly in Chrome or Edge, or run a lightweight local HTTP server (recommended for fonts and clean URLs):

**Option A — Python (Built-in, Lightweight):**
```bash
cd Shushant_Tiwari_Portfolio
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — Node.js (`npx`):**
```bash
cd Shushant_Tiwari_Portfolio
npx serve .
```

**Option C — VS Code Live Server:**
Right-click `index.html` and choose **Open with Live Server**.

---

## 6. Deployment to GitHub Pages
1. Create or open your repository (`Shushant-556/Portfolio`).
2. Copy all files from inside `Shushant_Tiwari_Portfolio/` into the repository root (`index.html` at root).
3. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "Deploy cinematic 3D monochrome portfolio"
   git push origin main
   ```
4. In GitHub: go to **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/ (root)`, and save.
5. Your site will publish at `https://shushant-556.github.io/Portfolio/`.

---

## 7. Configuration
All personal content, projects, skills, experience, education, certifications, and links live in a single clean data module:
- `js/data/portfolio-data.js`

To add individual project repository URLs or live demo URLs later, update the `caseStudy.repository` and `caseStudy.demo` fields inside `js/data/portfolio-data.js`.

---

## 8. Performance Notes
- **Adaptive Pixel Ratio:** WebGL pixel ratio is capped at `1.75` on desktop and `1.25` on mobile to prevent GPU thermal throttling on integrated laptop graphics.
- **Offscreen Pausing:** All 5 project canvases and the skills constellation use `IntersectionObserver` to pause `requestAnimationFrame` loops when scrolled out of view. The main 3D scene pauses automatically when `document.hidden` is true.
- **Particle Budget:** Particle counts scale down automatically on mobile screens (`160` vs `380` on desktop).
- **Zero Build Bloat:** Pure vanilla JS + CSS with deferred scripts and no heavy framework runtime.

---

## 9. Testing Status
- **Verified Automated Checks:**
  - **JavaScript Syntax Validation (`node --check`):** Passed with 0 errors across all 11 modular JS files.
  - **Static DOM, Handler & Asset Audit (`check_web_app.py` + `verify_all.py`):** Passed with 0 errors and 0 warnings across all local CSS/JS/SVG asset links, DOM IDs, event handlers, and verified personal facts.
  - **Archive & Local Server Smoke Test:** Verified clean ZIP extraction and HTTP `200 OK` responses for `index.html`, stylesheets, and scripts via Python's `http.server`.
- **Testing Limitations (Honest Disclosure):**
  - The sandbox Linux environment blocks local URLs inside headless Chromium via a container organization URLBlocklist policy (`This page is blocked`) and has outbound internet disabled. Because of this, live browser screenshot capture, interactive WebGL/CDN rendering (`three.min.js`, `gsap.min.js`, `lenis.min.js`, Google Fonts), and Lighthouse performance scores could not be measured inside the sandbox.
  - Cross-browser testing in Chrome, Microsoft Edge, and Firefox should be performed locally after extraction.

---

## 10. Known Limitations & Items to Update
- **Individual Project Repo URLs:** Currently point to `https://github.com/Shushant-556` with a transparent status note in each case study modal until exact per-project repo URLs are added to `js/data/portfolio-data.js`.
- **Project Visuals:** Original software screenshots and videos were not attached; each project uses a clearly labeled procedural Canvas visualization (`Original Conceptual Render`).
- **Certificate Verification Links:** Certificate IDs (`4b0da287dc6d33b93827`, `4845ac603a932aaabd28`, `8c8f93d7a2acdb412456`) are displayed verbatim without fabricating external verification URLs.
