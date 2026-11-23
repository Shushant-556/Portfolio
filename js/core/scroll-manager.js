/* ==========================================================================
   SCROLL MANAGER
   Lenis Smooth Scroll (when loaded & non-reduced-motion) + Native Progress Sync
   ========================================================================== */

window.ScrollManager = (function () {
  let lenis = null;

  function updateProgress() {
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));

    const bar = document.getElementById('scroll-progress-bar');
    if (bar) bar.style.width = (ratio * 100).toFixed(2) + '%';

    if (window.HeroSceneEngine) {
      window.HeroSceneEngine.setScrollProgress(ratio);
    }

    // Update Experience timeline rail fill
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    if (timeline && timelineProgress) {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const pct = Math.max(0, Math.min(1, (vh * 0.65 - rect.top) / Math.max(1, rect.height)));
      timelineProgress.style.height = (pct * 100).toFixed(1) + '%';
    }
  }

  return {
    init: function () {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isTouch = window.matchMedia('(pointer: coarse)').matches;

      if (!reducedMotion && !isTouch && typeof window.Lenis === 'function') {
        try {
          lenis = new window.Lenis({
            duration: 1.05,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
          });

          const raf = (time) => {
            lenis.raf(time);
            window.requestAnimationFrame(raf);
          };
          window.requestAnimationFrame(raf);

          if (window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function') {
            lenis.on('scroll', window.ScrollTrigger.update);
          }
        } catch (err) {
          lenis = null;
        }
      }

      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      updateProgress();
    }
  };
})();
