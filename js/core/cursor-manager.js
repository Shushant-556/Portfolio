/* ==========================================================================
   PROGRESSIVE-ENHANCEMENT CUSTOM CURSOR & MAGNETIC CONTROLS
   Desktop fine-pointer only; native pointer always remains intact.
   ========================================================================== */

window.CursorManager = (function () {
  let dot, ring;
  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let active = false;

  function animate() {
    if (!active) return;
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    window.requestAnimationFrame(animate);
  }

  function bindMagnetics() {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  return {
    init: function () {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!finePointer || reducedMotion) return;

      dot = document.getElementById('custom-cursor');
      ring = document.getElementById('custom-cursor-ring');
      if (!dot || !ring) return;

      window.addEventListener(
        'pointermove',
        (e) => {
          mx = e.clientX;
          my = e.clientY;
          if (!active) {
            active = true;
            rx = mx;
            ry = my;
            document.body.classList.add('cursor-active');
            window.requestAnimationFrame(animate);
          }
        },
        { passive: true }
      );

      document.addEventListener('pointerover', (e) => {
        const interactive = e.target.closest('a, button, [role="button"], .project-world__canvas, #skills-canvas');
        document.body.classList.toggle('cursor-hover', Boolean(interactive));
      });

      bindMagnetics();
    }
  };
})();
