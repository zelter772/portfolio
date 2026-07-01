/* =========================================================
   Hero tagline typewriter — types out, pauses, deletes,
   cycles through a short list of lines.
   ========================================================= */

(function () {
  const el = document.getElementById('type-text');
  if (!el) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const lines = [
    'Turning ideas into fast, clean, scalable web apps.',
    'Built for real users and real businesses.',
    'From product strategy to production-grade code.'
  ];

  if (prefersReducedMotion) {
    // Just show the primary line statically, no animation.
    el.textContent = lines[0];
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED_MIN = 35;
  const TYPE_SPEED_MAX = 70;
  const DELETE_SPEED = 18;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_AFTER_DELETE = 400;

  function tick() {
    const current = lines[lineIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        setTimeout(() => {
          deleting = true;
          tick();
        }, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(
        tick,
        TYPE_SPEED_MIN + Math.random() * (TYPE_SPEED_MAX - TYPE_SPEED_MIN)
      );
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
})();
