/* ==========================================================================
   INTERACTIVE TECHNICAL EXPERTISE NETWORK
   Spatial Constellation Canvas + Accessible Category Filters & Inspector
   Zero invented proficiency percentages, rankings, or years of experience.
   ========================================================================== */

window.SkillsNetwork = (function () {
  let canvas, ctx;
  let nodes = [];
  let edges = [];
  let activeCategory = 'all';
  let hoveredNode = null;
  let visible = false;
  let rafId = null;
  let reducedMotion = false;
  const mouse = { x: -999, y: -999 };

  function buildGraph() {
    const categories = window.PortfolioData.skills;
    nodes = [];
    edges = [];

    const totalCats = categories.length;
    categories.forEach((cat, cIdx) => {
      const cAngle = (cIdx / totalCats) * Math.PI * 2 - Math.PI / 2;
      const hubX = 0.5 + Math.cos(cAngle) * 0.28;
      const hubY = 0.5 + Math.sin(cAngle) * 0.28;

      const hubIndex = nodes.length;
      nodes.push({
        id: 'hub-' + cat.id,
        label: cat.label,
        category: cat.id,
        isHub: true,
        nx: hubX,
        ny: hubY,
        phase: cIdx * 0.9
      });

      const count = cat.items.length;
      cat.items.forEach((skill, sIdx) => {
        const spreadAngle = cAngle + ((sIdx / Math.max(1, count - 1)) - 0.5) * 1.45;
        const radius = 0.12 + (sIdx % 2) * 0.065;
        const nodeIdx = nodes.length;
        nodes.push({
          id: cat.id + '-' + sIdx,
          label: skill,
          category: cat.id,
          isHub: false,
          nx: Math.max(0.08, Math.min(0.92, hubX + Math.cos(spreadAngle) * radius)),
          ny: Math.max(0.1, Math.min(0.9, hubY + Math.sin(spreadAngle) * radius)),
          phase: (cIdx * 5 + sIdx) * 0.55
        });
        edges.push([hubIndex, nodeIdx, cat.id]);
      });
    });

    // Connect category hubs in an ecosystem ring
    const hubIndices = nodes
      .map((n, i) => (n.isHub ? i : -1))
      .filter((i) => i !== -1);
    for (let i = 0; i < hubIndices.length; i++) {
      const next = (i + 1) % hubIndices.length;
      edges.push([hubIndices[i], hubIndices[next], 'ecosystem']);
    }
  }

  function renderInspector(categoryId, focusedSkill) {
    const titleEl = document.getElementById('skills-inspector-title');
    const descEl = document.getElementById('skills-inspector-desc');
    const listEl = document.getElementById('skills-inspector-list');
    if (!titleEl || !descEl || !listEl) return;

    const categories = window.PortfolioData.skills;
    if (categoryId === 'all') {
      titleEl.textContent = 'Full Technical Ecosystem';
      descEl.textContent =
        'Select a domain filter or hover over any node in the spatial graph to isolate connected technologies across all six engineering categories.';
      listEl.innerHTML = categories
        .map(
          (cat) => `
          <div style="width:100%; margin-bottom:0.85rem;">
            <div class="meta-label" style="margin-bottom:0.45rem;">${cat.label}</div>
            <div class="skills-list-accessible">
              ${cat.items
                .map(
                  (item) =>
                    `<span class="skill-node-pill${focusedSkill === item ? ' is-highlighted' : ''}">${item}</span>`
                )
                .join('')}
            </div>
          </div>
        `
        )
        .join('');
    } else {
      const cat = categories.find((c) => c.id === categoryId);
      if (!cat) return;
      titleEl.textContent = cat.label;
      descEl.textContent = cat.description;
      listEl.innerHTML = `
        <div class="skills-list-accessible">
          ${cat.items
            .map(
              (item) =>
                `<span class="skill-node-pill${focusedSkill === item ? ' is-highlighted' : ''}">${item}</span>`
            )
            .join('')}
        </div>
      `;
    }
  }

  function renderFilters() {
    const container = document.getElementById('skills-filters');
    if (!container) return;

    const buttons = [{ id: 'all', label: 'All Domains' }].concat(
      window.PortfolioData.skills.map((c) => ({ id: c.id, label: c.label }))
    );

    container.innerHTML = buttons
      .map(
        (b, idx) => `
        <button
          type="button"
          class="filter-btn${idx === 0 ? ' is-active' : ''}"
          data-skill-filter="${b.id}"
          aria-pressed="${idx === 0 ? 'true' : 'false'}"
        >
          ${b.label}
        </button>
      `
      )
      .join('');

    container.querySelectorAll('[data-skill-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-skill-filter');
        container.querySelectorAll('.filter-btn').forEach((other) => {
          const active = other === btn;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        renderInspector(activeCategory, null);
        if (window.AudioEngine) window.AudioEngine.playTick(480);
        draw(performance.now() * 0.001);
      });
    });
  }

  function resize() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(360, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now() * 0.001);
  }

  function draw(t) {
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 500;

    ctx.fillStyle = '#090A0C';
    ctx.fillRect(0, 0, w, h);

    // Compute live node positions
    const coords = nodes.map((n) => {
      const driftX = reducedMotion ? 0 : Math.cos(t * 0.65 + n.phase) * 5;
      const driftY = reducedMotion ? 0 : Math.sin(t * 0.55 + n.phase) * 5;
      return {
        node: n,
        x: n.nx * w + driftX,
        y: n.ny * h + driftY,
        active: activeCategory === 'all' || n.category === activeCategory
      };
    });

    // Hit-test hover
    hoveredNode = null;
    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      if (!c.active) continue;
      if (Math.hypot(mouse.x - c.x, mouse.y - c.y) < (c.node.isHub ? 22 : 16)) {
        hoveredNode = c.node;
        break;
      }
    }

    // Draw edges
    edges.forEach(([aIdx, bIdx, edgeCat]) => {
      const a = coords[aIdx];
      const b = coords[bIdx];
      const isHighlighted =
        activeCategory === 'all' ||
        edgeCat === activeCategory ||
        (hoveredNode && (hoveredNode === a.node || hoveredNode === b.node));

      ctx.strokeStyle = isHighlighted
        ? edgeCat === 'ecosystem'
          ? 'rgba(196, 201, 208, 0.24)'
          : 'rgba(196, 201, 208, 0.34)'
        : 'rgba(119, 126, 135, 0.07)';
      ctx.lineWidth = hoveredNode && (hoveredNode === a.node || hoveredNode === b.node) ? 1.5 : 0.9;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    // Draw nodes & labels
    coords.forEach((c) => {
      const isHovered = hoveredNode === c.node;
      const alpha = c.active ? (isHovered ? 1 : 0.88) : 0.16;

      ctx.fillStyle = c.node.isHub
        ? `rgba(242, 243, 244, ${alpha})`
        : `rgba(196, 201, 208, ${alpha})`;

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.node.isHub ? (isHovered ? 7 : 5.5) : isHovered ? 5 : 3.2, 0, Math.PI * 2);
      ctx.fill();

      if (c.node.isHub && c.active) {
        ctx.strokeStyle = `rgba(242, 243, 244, ${isHovered ? 0.8 : 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (c.active) {
        ctx.font = c.node.isHub
          ? '600 11px "IBM Plex Mono", monospace'
          : '10px "IBM Plex Mono", monospace';
        ctx.fillStyle = isHovered
          ? '#F2F3F4'
          : c.node.isHub
          ? 'rgba(242, 243, 244, 0.92)'
          : 'rgba(196, 201, 208, 0.72)';
        ctx.fillText(c.node.label, c.x + (c.node.isHub ? 15 : 8), c.y + 3);
      }
    });
  }

  function loop(now) {
    if (!visible || reducedMotion) {
      rafId = null;
      return;
    }
    draw(now * 0.001);
    rafId = window.requestAnimationFrame(loop);
  }

  return {
    init: function () {
      canvas = document.getElementById('skills-canvas');
      if (!canvas || !window.PortfolioData) return;
      ctx = canvas.getContext('2d');
      reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      buildGraph();
      renderFilters();
      renderInspector('all', null);
      resize();

      canvas.addEventListener(
        'pointermove',
        (e) => {
          const rect = canvas.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
          if (reducedMotion) draw(0);
        },
        { passive: true }
      );

      canvas.addEventListener('pointerleave', () => {
        mouse.x = -999;
        mouse.y = -999;
      });

      canvas.addEventListener('click', () => {
        if (hoveredNode) {
          activeCategory = hoveredNode.category;
          document.querySelectorAll('[data-skill-filter]').forEach((btn) => {
            const match = btn.getAttribute('data-skill-filter') === activeCategory;
            btn.classList.toggle('is-active', match);
            btn.setAttribute('aria-pressed', match ? 'true' : 'false');
          });
          renderInspector(activeCategory, hoveredNode.isHub ? null : hoveredNode.label);
          if (window.AudioEngine) window.AudioEngine.playTick(600);
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible = entry.isIntersecting;
            if (visible && !rafId && !reducedMotion) {
              rafId = window.requestAnimationFrame(loop);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(canvas);

      window.addEventListener('resize', resize, { passive: true });
    }
  };
})();
