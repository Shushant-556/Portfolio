/* ==========================================================================
   MAIN APPLICATION ORCHESTRATOR
   Initializes Data Rendering, 3D Engine, Interactive Worlds, Preloader & QA Hooks
   ========================================================================== */

(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  function renderExperience() {
    const container = document.getElementById('experience-list');
    if (!container || !window.PortfolioData) return;

    container.innerHTML = window.PortfolioData.experience
      .map((item) => {
        const points = item.focus.map((pt) => `<li>${escapeHtml(pt)}</li>`).join('');
        const highlight = item.highlight
          ? `<div class="project-badge" style="margin-top:0.65rem; display:inline-block;">${escapeHtml(item.highlight)}</div>`
          : '';
        const cert = item.certificateId
          ? `<div class="cert-id-badge"><span>CERTIFICATE ID</span><strong>${escapeHtml(item.certificateId)}</strong></div>`
          : '';

        return `
          <article class="timeline-item reveal">
            <div>
              <div class="timeline-date">${escapeHtml(item.period)}</div>
              <div class="timeline-org">${escapeHtml(item.organization)}</div>
              ${highlight}
            </div>
            <div>
              <h3 class="timeline-role">${escapeHtml(item.role)}</h3>
              <ul class="timeline-points">${points}</ul>
              ${cert}
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderEducation() {
    const container = document.getElementById('education-grid');
    if (!container || !window.PortfolioData) return;

    container.innerHTML = window.PortfolioData.education
      .map(
        (ed, i) => `
        <article class="edu-block reveal">
          <div>
            <div class="project-meta">
              <span class="meta-label">0${i + 1} // ${escapeHtml(ed.period)}</span>
              <span class="meta-label">${escapeHtml(ed.scoreLabel)}</span>
            </div>
            <h3 class="section-subheading" style="font-size:clamp(1.25rem, 1.05rem + 0.7vw, 1.65rem); margin-top:1rem;">
              ${escapeHtml(ed.institution)}
            </h3>
            <p class="mono-code" style="margin-top:0.5rem;">${escapeHtml(ed.credential)}</p>
            <p class="body-copy" style="margin-top:1rem; font-size:var(--text-sm);">${escapeHtml(ed.detail)}</p>
          </div>
          <div style="padding-top:1.25rem; border-top:1px solid var(--border-subtle);">
            <div class="edu-score">${escapeHtml(ed.scoreValue)}</div>
          </div>
        </article>
      `
      )
      .join('');
  }

  function renderCertifications() {
    const container = document.getElementById('certifications-grid');
    if (!container || !window.PortfolioData) return;

    container.innerHTML = window.PortfolioData.certifications
      .map((cert) => {
        const idBlock = cert.credentialId
          ? `<div class="mono-code" style="margin-top:0.75rem; color:var(--color-porcelain);">ID: ${escapeHtml(cert.credentialId)}</div>`
          : `<div class="mono-code" style="margin-top:0.75rem; color:var(--text-muted);">Credential verified in portfolio record</div>`;

        return `
          <article class="cert-item reveal">
            <div>
              <div class="project-meta">
                <span class="meta-label">CERT // ${escapeHtml(cert.index)}</span>
                <span class="meta-label">${escapeHtml(cert.category)}</span>
              </div>
              <h3 style="font-size:1.12rem; line-height:1.28; margin-top:1rem;">${escapeHtml(cert.title)}</h3>
              <p class="body-copy" style="font-size:var(--text-sm); margin-top:0.75rem;">${escapeHtml(cert.note)}</p>
            </div>
            <div style="padding-top:1rem; border-top:1px solid var(--border-subtle);">
              <div class="meta-label" style="color:var(--color-silver);">${escapeHtml(cert.issuer)}</div>
              ${idBlock}
            </div>
          </article>
        `;
      })
      .join('');
  }

  function bindCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    if (!btn || !window.PortfolioData) return;

    btn.addEventListener('click', () => {
      const email = window.PortfolioData.identity.email;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(() => showToast('Email copied: ' + email))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Email copied: ' + text);
    } catch (e) {
      showToast('Email: ' + text);
    }
  }

  function dismissPreloader() {
    const preloader = document.getElementById('preloader');
    const status = document.getElementById('preloader-status');
    if (!preloader) return;

    const finalize = () => {
      if (status) status.textContent = 'SYSTEM READY // ENTERING EXPERIENCE';
      window.setTimeout(() => {
        preloader.classList.add('is-hidden');
        preloader.setAttribute('aria-hidden', 'true');
      }, 220);
    };

    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 750))
      ]).then(finalize);
    } else {
      window.setTimeout(finalize, 250);
    }

    // Hard safety net: never trap users indefinitely
    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      preloader.setAttribute('aria-hidden', 'true');
    }, 1600);
  }

  function boot() {
    renderExperience();
    renderEducation();
    renderCertifications();

    if (window.ProjectsUI) window.ProjectsUI.init();
    if (window.ProjectScenes) window.ProjectScenes.init();
    if (window.SkillsNetwork) window.SkillsNetwork.init();
    if (window.HeroSceneEngine) window.HeroSceneEngine.init();
    if (window.NavigationManager) window.NavigationManager.init();
    if (window.ScrollManager) window.ScrollManager.init();
    if (window.AnimationManager) window.AnimationManager.init();
    if (window.CursorManager) window.CursorManager.init();
    if (window.AudioEngine) window.AudioEngine.init();

    bindCopyEmail();
    dismissPreloader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
