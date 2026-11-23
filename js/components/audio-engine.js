/* ==========================================================================
   OPTIONAL SUBTLE UI SOUND DESIGN ENGINE (WEB AUDIO API)
   Strictly user-initiated (OFF by default; zero autoplay).
   ========================================================================== */

window.AudioEngine = (function () {
  let ctx = null;
  let enabled = false;

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  function playTick(freq) {
    if (!enabled) return;
    ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq || 420, now);
      osc.frequency.exponentialRampToValueAtTime((freq || 420) * 0.65, now + 0.045);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch (e) {
      // Ignore audio errors silently
    }
  }

  return {
    init: function () {
      const toggle = document.getElementById('sound-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        enabled = !enabled;
        toggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        const label = toggle.querySelector('.sound-toggle__label');
        if (label) label.textContent = enabled ? 'Audio On' : 'Audio Off';
        if (enabled) playTick(520);
      });
    },
    playTick: playTick
  };
})();
