/* ==========================================================================
   ANIMATION MANAGER
   GSAP + ScrollTrigger Choreography with IntersectionObserver Fallback
   ========================================================================== */

window.AnimationManager = (function () {
  function revealAllImmediately() {
    document.querySelectorAll('.reveal, .reveal-mask').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  function runIntersectionFallback() {
    const targets = document.querySelectorAll('.reveal, .reveal-mask');
    if (!('IntersectionObserver' in window)) {
      revealAllImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  function initGSAP() {
    if (typeof window.gsap === 'undefined') return false;

    try {
      const gsap = window.gsap;
      if (window.ScrollTrigger) {
        gsap.registerPlugin(window.ScrollTrigger);
      }

      // Hero masked entrance
      gsap.fromTo(
        '.hero-title .line-inner',
        { yPercent: 108, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.12, ease: 'power4.out', delay: 0.15 }
      );

      gsap.fromTo(
        '.hero-stagger',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.35 }
      );

      // Scroll-triggered reveals
      if (window.ScrollTrigger) {
        document.querySelectorAll('.reveal, .reveal-mask').forEach((el) => {
          window.ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => el.classList.add('is-visible')
          });
        });
      } else {
        runIntersectionFallback();
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  return {
    init: function () {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        revealAllImmediately();
        return;
      }

      document.documentElement.classList.add('js-ready');
      const usedGsap = initGSAP();
      if (!usedGsap) {
        runIntersectionFallback();
      }

      // Guarantee hero elements are visible immediately on load
      document.querySelectorAll('#hero .reveal, #hero .reveal-mask').forEach((el) => {
        el.classList.add('is-visible');
      });
    }
  };
})();
