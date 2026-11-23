/* ==========================================================================
   NAVIGATION MANAGER
   Desktop Nav | Accessible Mobile Drawer | Active Section & 3D Narrative Sync
   ========================================================================== */

window.NavigationManager = (function () {
  let menuBtn, drawer;
  let lastTrigger = null;

  function openMenu() {
    if (!drawer || !menuBtn) return;
    lastTrigger = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.textContent = 'Close';
    document.body.classList.add('menu-open');
    const firstLink = drawer.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!drawer || !menuBtn || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
    document.body.classList.remove('menu-open');
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  function setActiveSection(sectionId, sectionIndex) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      const target = link.getAttribute('href') === '#' + sectionId;
      link.classList.toggle('is-active', target);
      if (target) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    document.querySelectorAll('.section-rail__dot').forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === sectionIndex);
    });

    if (window.HeroSceneEngine) {
      window.HeroSceneEngine.setSection(sectionIndex);
    }

    const hudEl = document.getElementById('scene-narrative-indicator');
    if (hudEl && window.PortfolioData && window.PortfolioData.sectionNarratives[sectionIndex]) {
      const info = window.PortfolioData.sectionNarratives[sectionIndex];
      hudEl.textContent = `${info.index} // ${info.sceneState.toUpperCase()}`;
    }
  }

  return {
    init: function () {
      menuBtn = document.getElementById('menu-toggle');
      drawer = document.getElementById('mobile-drawer');

      if (menuBtn && drawer) {
        menuBtn.addEventListener('click', () => {
          if (drawer.classList.contains('is-open')) closeMenu();
          else openMenu();
        });

        drawer.querySelectorAll('a').forEach((a) => {
          a.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') closeMenu();
        });
      }

      // Section observation for active indicators & 3D scene choreography
      const sections = Array.from(document.querySelectorAll('main > section[id]'));
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = sections.indexOf(entry.target);
              if (idx !== -1) setActiveSection(entry.target.id, idx);
            }
          });
        },
        { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
      );

      sections.forEach((sec) => observer.observe(sec));

      // Floating right-edge rail clicks
      document.querySelectorAll('.section-rail__dot').forEach((dot) => {
        dot.addEventListener('click', () => {
          const targetId = dot.getAttribute('data-target');
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
      });

      // Back to top button
      const topBtn = document.getElementById('back-to-top');
      if (topBtn) {
        topBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }
  };
})();
