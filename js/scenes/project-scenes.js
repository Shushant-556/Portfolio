/* ==========================================================================
   PROJECT-SPECIFIC PROCEDURAL VISUAL ENVIRONMENTS
   Each of the 5 projects renders its own interactive monochrome world.
   Paused automatically when offscreen via IntersectionObserver.
   ========================================================================== */

window.ProjectScenes = (function () {
  const instances = [];

  function drawNotePilot(ctx, w, h, t, mouse) {
    ctx.fillStyle = '#0B0C0F';
    ctx.fillRect(0, 0, w, h);

    // Subtle frequency grid
    ctx.strokeStyle = 'rgba(196, 201, 208, 0.07)';
    ctx.lineWidth = 1;
    for (let y = 36; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Spectrum bars
    const bars = 42;
    const barW = (w - 64) / bars;
    for (let i = 0; i < bars; i++) {
      const freq = Math.sin(t * 2.8 + i * 0.35) * Math.cos(t * 1.4 - i * 0.18);
      const boost = 1 + Math.max(0, 1 - Math.abs(mouse.x - i / bars) * 4) * 0.85;
      const barH = Math.max(8, Math.abs(freq) * (h * 0.34) * boost);
      const x = 32 + i * barW;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(242, 243, 244, 0.72)' : 'rgba(196, 201, 208, 0.28)';
      ctx.fillRect(x, h * 0.46 - barH / 2, Math.max(2, barW - 4), barH);
    }

    // Live audio waveform ribbon
    ctx.strokeStyle = '#F2F3F4';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const norm = x / w;
      const amp = Math.sin(norm * Math.PI) * 38;
      const y = h * 0.46 + Math.sin(norm * 16 + t * 4.2) * amp * Math.cos(t * 1.3 + norm * 4);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Simulated live STT transcript stream
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(196, 201, 208, 0.65)';
    const lines = [
      'WS://LOCALHOST :: CHUNK_SEQ #' + String(Math.floor(t * 6) % 999).padStart(3, '0'),
      'WHISPER_STT :: [00:14.2] "Capturing Google Meet tab audio..."',
      'PIPELINE    :: WEB_AUDIO -> FFMPEG -> LOCAL_TRANSCRIPT'
    ];
    lines.forEach((line, idx) => {
      ctx.fillText(line, 24, 34 + idx * 18);
    });
  }

  function drawMedChain(ctx, w, h, t, mouse) {
    ctx.fillStyle = '#0B0C0F';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.46;
    const nodes = 10;
    const pts = [];

    for (let i = 0; i < nodes; i++) {
      const a = (i / nodes) * Math.PI * 2 + t * 0.28 + (mouse.x - 0.5) * 0.6;
      const rx = Math.min(w, h) * (i % 2 === 0 ? 0.34 : 0.2);
      const ry = Math.min(w, h) * (i % 2 === 0 ? 0.26 : 0.16);
      pts.push({
        x: cx + Math.cos(a) * rx,
        y: cy + Math.sin(a) * ry,
        core: i % 2 === 0
      });
    }

    // Encrypted mesh edges
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if ((i + j) % 3 === 0) {
          ctx.strokeStyle = 'rgba(196, 201, 208, 0.18)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();

          // Encrypted packet pulse
          const p = (t * 0.45 + (i * 0.17 + j * 0.11)) % 1;
          const px = pts[i].x + (pts[j].x - pts[i].x) * p;
          const py = pts[i].y + (pts[j].y - pts[i].y) * p;
          ctx.fillStyle = '#F2F3F4';
          ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        }
      }
    }

    // Central cryptographic vault ring
    ctx.strokeStyle = 'rgba(242, 243, 244, 0.42)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 34 + Math.sin(t * 2) * 3, 0, Math.PI * 2);
    ctx.stroke();

    // Nodes
    pts.forEach((pt) => {
      ctx.fillStyle = pt.core ? '#F2F3F4' : '#777E87';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.core ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(196, 201, 208, 0.65)';
    ctx.fillText('CIPHER :: AES-256-GCM (WEBCRYPTO)', 24, 34);
    ctx.fillText('STORAGE :: IPFS CID + EVM AUDIT LEDGER', 24, 52);
  }

  function drawWeather(ctx, w, h, t, mouse) {
    ctx.fillStyle = '#0B0C0F';
    ctx.fillRect(0, 0, w, h);

    // Topographic atmospheric contour layers
    const layers = 9;
    for (let l = 0; l < layers; l++) {
      ctx.strokeStyle = `rgba(196, 201, 208, ${(0.08 + l * 0.032).toFixed(2)})`;
      ctx.lineWidth = l === layers - 1 ? 1.5 : 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const nx = x / w;
        const y =
          h * 0.24 +
          l * 24 +
          Math.sin(nx * 6 + t * 0.7 + l * 0.55) * 18 +
          Math.cos(nx * 11 - t * 0.45 + mouse.x * 2) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Atmospheric station markers
    const markers = [
      { x: 0.28, y: 0.42, label: 'TEMP' },
      { x: 0.54, y: 0.52, label: 'PM2.5' },
      { x: 0.76, y: 0.38, label: 'FOG_IDX' }
    ];
    ctx.font = '10px "IBM Plex Mono", monospace';
    markers.forEach((m, i) => {
      const mx = m.x * w;
      const my = m.y * h + Math.sin(t * 1.4 + i) * 6;
      ctx.strokeStyle = '#F2F3F4';
      ctx.beginPath();
      ctx.arc(mx, my, 12 + Math.sin(t * 2 + i) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#F2F3F4';
      ctx.fillRect(mx - 2, my - 2, 4, 4);
      ctx.fillText(m.label, mx + 16, my + 4);
    });

    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(196, 201, 208, 0.65)';
    ctx.fillText('REGION :: DELHI NCR HYPERLOCAL SERIES', 24, 34);
    ctx.fillText('TARGETS :: TEMP / PM2.5 / PM10 / FOG', 24, 52);
  }

  function drawGfg(ctx, w, h, t) {
    ctx.fillStyle = '#0B0C0F';
    ctx.fillRect(0, 0, w, h);

    // Editor chrome lines
    ctx.strokeStyle = 'rgba(196, 201, 208, 0.14)';
    ctx.strokeRect(24, 24, w - 48, h - 88);

    const stages = ['01. CAPTURE', '02. AI_GEN(JAVA)', '03. COMPILE_CHK', '04. GITHUB_API'];
    const activeStage = Math.floor(t * 0.9) % stages.length;

    const startX = 40;
    const stepW = (w - 80) / stages.length;
    ctx.font = '10px "IBM Plex Mono", monospace';

    stages.forEach((s, i) => {
      const x = startX + i * stepW;
      const y = h * 0.34;
      const active = i === activeStage;
      ctx.strokeStyle = active ? '#F2F3F4' : 'rgba(196, 201, 208, 0.25)';
      ctx.fillStyle = active ? 'rgba(242, 243, 244, 0.12)' : 'rgba(23, 25, 29, 0.8)';
      ctx.fillRect(x, y, stepW - 12, 44);
      ctx.strokeRect(x, y, stepW - 12, 44);
      ctx.fillStyle = active ? '#F2F3F4' : '#9BA2AC';
      ctx.fillText(s, x + 8, y + 26);
    });

    // Procedural code bars below
    const codeY = h * 0.54;
    for (let row = 0; row < 5; row++) {
      const indent = (row % 3) * 18;
      const barLen = ((Math.sin(t * 1.6 + row * 1.4) + 1.4) * 0.28) * (w - 110);
      ctx.fillStyle = row === activeStage ? 'rgba(242, 243, 244, 0.65)' : 'rgba(119, 126, 135, 0.35)';
      ctx.fillRect(42 + indent, codeY + row * 18, barLen, 6);
    }

    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(196, 201, 208, 0.65)';
    ctx.fillText('FASTAPI + DOCKER COMPOSE + APSCHEDULER // ACTIVE REDEV', 40, 52);
  }

  function drawPlaceWise(ctx, w, h, t, mouse) {
    ctx.fillStyle = '#0B0C0F';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.58;

    // Perspective spatial floor grid
    ctx.strokeStyle = 'rgba(196, 201, 208, 0.14)';
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 26, cy - 40);
      ctx.lineTo(cx + i * 95, h);
      ctx.stroke();
    }
    for (let j = 0; j < 6; j++) {
      const y = cy - 40 + j * j * 11;
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // 3D wireframe cube (product bounding box)
    const angle = t * 0.7 + (mouse.x - 0.5) * 1.8;
    const tilt = 0.45 + (mouse.y - 0.5) * 0.6;
    const size = Math.min(w, h) * 0.14;
    const verts = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ].map(([vx, vy, vz]) => {
      const x1 = vx * Math.cos(angle) - vz * Math.sin(angle);
      const z1 = vx * Math.sin(angle) + vz * Math.cos(angle);
      const y2 = vy * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z2 = vy * Math.sin(tilt) + z1 * Math.cos(tilt);
      const p = 320 / (4.5 + z2);
      return { x: cx + x1 * size * (p / 75), y: cy - 48 + y2 * size * (p / 75) };
    });

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    ctx.strokeStyle = '#F2F3F4';
    ctx.lineWidth = 1.4;
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(verts[a].x, verts[a].y);
      ctx.lineTo(verts[b].x, verts[b].y);
      ctx.stroke();
    });

    // Surface placement reticle
    ctx.strokeStyle = 'rgba(196, 201, 208, 0.55)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 16, 62, 18, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(196, 201, 208, 0.65)';
    ctx.fillText('SPATIAL_PLANE :: CV_ASSISTED_PLACEMENT + WEBGL', 24, 34);
  }

  const RENDERERS = {
    notepilot: drawNotePilot,
    medchain: drawMedChain,
    weather: drawWeather,
    gfg: drawGfg,
    placewise: drawPlaceWise
  };

  function setupCanvas(canvas) {
    const type = canvas.getAttribute('data-visual');
    const drawFn = RENDERERS[type];
    if (!drawFn) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = {
      canvas,
      ctx,
      drawFn,
      visible: false,
      mouse: { x: 0.5, y: 0.5 },
      raf: null
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(280, Math.floor(rect.width * dpr));
      canvas.height = Math.max(240, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFn(ctx, rect.width || 480, rect.height || 360, 1.2, state.mouse);
    }

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = (e.clientX - rect.left) / Math.max(1, rect.width);
      state.mouse.y = (e.clientY - rect.top) / Math.max(1, rect.height);
    }, { passive: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function loop(now) {
      if (!state.visible || reducedMotion) {
        state.raf = null;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      drawFn(ctx, rect.width || 480, rect.height || 360, now * 0.001, state.mouse);
      state.raf = window.requestAnimationFrame(loop);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          state.visible = entry.isIntersecting;
          if (state.visible && !state.raf && !reducedMotion) {
            state.raf = window.requestAnimationFrame(loop);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    resize();
    window.addEventListener('resize', resize, { passive: true });
    instances.push(state);
  }

  return {
    init: function () {
      const canvases = document.querySelectorAll('.project-world__canvas');
      canvases.forEach(setupCanvas);
    }
  };
})();
