/* ==========================================================================
   PROJECTS UI & ACCESSIBLE CASE STUDY MODAL
   Renders 5 distinct project worlds + 10-point technical case study overlay
   ========================================================================== */

window.ProjectsUI = (function () {
  let modalBackdrop, modalPanel, modalContent, closeBtn;
  let lastFocusedEl = null;
  let currentProjectIndex = -1;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderProjectsList() {
    const container = document.getElementById('projects-container');
    if (!container || !window.PortfolioData) return;

    const html = window.PortfolioData.projects
      .map((proj, idx) => {
        const reversed = idx % 2 === 1 ? ' project-world--reversed' : '';
        const tags = proj.techStack
          .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
          .join('');

        return `
          <article class="project-world${reversed} reveal" data-project-id="${escapeHtml(proj.id)}">
            <div class="project-world__stage">
              <canvas
                class="project-world__canvas"
                data-visual="${escapeHtml(proj.visualType)}"
                role="img"
                aria-label="${escapeHtml(proj.name)} — ${escapeHtml(proj.visualCaption)}"
              ></canvas>
              <div class="project-world__caption">
                <span>${escapeHtml(proj.visualCaption)}</span>
                <span>WORLD // ${escapeHtml(proj.number)}</span>
              </div>
            </div>

            <div class="project-world__content">
              <div>
                <div class="project-meta">
                  <span class="project-index">PROJECT ${escapeHtml(proj.number)} / 05</span>
                  <span class="project-badge">${escapeHtml(proj.statusBadge)}</span>
                </div>
                <h3 class="project-title">${escapeHtml(proj.name)}</h3>
                <p class="project-tagline">${escapeHtml(proj.subtitle)}</p>
                <p class="body-copy" style="margin-top: 1.15rem;">${escapeHtml(proj.summary)}</p>
              </div>

              <div>
                <div class="tech-tags" aria-label="Technology stack">${tags}</div>
                <div class="project-world__actions" style="margin-top: 1.5rem;">
                  <button
                    type="button"
                    class="btn btn--primary magnetic"
                    data-open-project="${idx}"
                  >
                    Inspect Architecture &amp; Case Study
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                  <a
                    href="${escapeHtml(proj.caseStudy.repository.profileUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn--ghost"
                  >
                    GitHub Profile
                    <span aria-hidden="true">&#8599;</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    container.innerHTML = html;

    container.querySelectorAll('[data-open-project]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-open-project'), 10);
        openModal(idx, btn);
      });
    });
  }

  function renderModalContent(index) {
    const projects = window.PortfolioData.projects;
    const proj = projects[index];
    if (!proj || !modalContent) return;

    currentProjectIndex = index;
    const cs = proj.caseStudy;
    const prevIdx = (index - 1 + projects.length) % projects.length;
    const nextIdx = (index + 1) % projects.length;

    const tags = proj.techStack
      .map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`)
      .join('');
    const highlights = cs.highlights
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join('');
    const challenges = cs.challenges
      .map((c) => `<li>${escapeHtml(c)}</li>`)
      .join('');

    modalContent.innerHTML = `
      <div class="modal-header">
        <div>
          <span class="meta-label">PROJECT ${escapeHtml(proj.number)} / 05 &mdash; ${escapeHtml(proj.statusBadge)}</span>
          <h3 id="modal-project-title" class="section-subheading" style="margin-top: 0.45rem;">${escapeHtml(proj.name)}</h3>
          <p class="mono-code" style="margin-top: 0.35rem;">${escapeHtml(proj.subtitle)}</p>
        </div>
        <button type="button" class="modal-close" id="modal-close-btn" aria-label="Close project details">
          ESC / CLOSE
        </button>
      </div>

      <div class="modal-body">
        <div class="case-block">
          <h4 class="case-block__title">01. Project Overview</h4>
          <p class="body-copy">${escapeHtml(cs.overview)}</p>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">02. Problem Statement</h4>
          <p class="body-copy">${escapeHtml(cs.problem)}</p>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">03. Engineered Solution</h4>
          <p class="body-copy">${escapeHtml(cs.solution)}</p>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">04. Technology Stack</h4>
          <div class="tech-tags">${tags}</div>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">05. System Architecture</h4>
          <pre class="architecture-diagram">${escapeHtml(cs.architecture)}</pre>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">06. Technical Highlights</h4>
          <ul class="timeline-points">${highlights}</ul>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">07. Engineering Challenges</h4>
          <ul class="timeline-points">${challenges}</ul>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">08. Testing, Status &amp; Verification Notes</h4>
          <p class="body-copy">${escapeHtml(cs.testingAndResults)}</p>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">09. Source Repository</h4>
          <p class="body-copy">${escapeHtml(cs.repository.note)}</p>
          <p class="mono-code" style="margin-top: 0.4rem;">Status: ${escapeHtml(cs.repository.status)}</p>
          <div style="margin-top: 0.75rem;">
            <a href="${escapeHtml(cs.repository.profileUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary">
              View GitHub Profile (Shushant-556) &#8599;
            </a>
          </div>
        </div>

        <div class="case-block">
          <h4 class="case-block__title">10. Working Demo Availability</h4>
          <p class="body-copy">${escapeHtml(cs.demo.note)}</p>
        </div>

        <div style="display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; padding-top:1rem;">
          <button type="button" class="btn btn--ghost" id="modal-prev-btn">&larr; Prev: ${escapeHtml(projects[prevIdx].name)}</button>
          <button type="button" class="btn btn--ghost" id="modal-next-btn">Next: ${escapeHtml(projects[nextIdx].name)} &rarr;</button>
        </div>
      </div>
    `;

    closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
      closeBtn.focus();
    }

    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => renderModalContent(prevIdx));
    if (nextBtn) nextBtn.addEventListener('click', () => renderModalContent(nextIdx));

    if (modalPanel) modalPanel.scrollTop = 0;
  }

  function openModal(index, triggerEl) {
    lastFocusedEl = triggerEl || document.activeElement;
    renderModalContent(index);
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (window.AudioEngine) window.AudioEngine.playTick(540);
  }

  function closeModal() {
    if (!modalBackdrop.classList.contains('is-open')) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
    if (window.AudioEngine) window.AudioEngine.playTick(320);
  }

  function handleKeydown(e) {
    if (!modalBackdrop || !modalBackdrop.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modalPanel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return {
    init: function () {
      modalBackdrop = document.getElementById('project-modal');
      modalPanel = document.getElementById('project-modal-panel');
      modalContent = document.getElementById('project-modal-content');

      renderProjectsList();

      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) closeModal();
        });
      }
      document.addEventListener('keydown', handleKeydown);
    },
    openByIndex: openModal,
    close: closeModal
  };
})();
