/* =========================================================
   Split text hero entrance — each word of the hero name
   slides up from below its baseline independently,
   staggered for a cinematic first impression.
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const heroName = document.querySelector(".hero-name");
  if (!heroName) return;

  // get the raw HTML — preserves the <span> on Ademide.
  const raw = heroName.innerHTML;

  // split into words, preserving the <span> tag as one unit
  const words = raw.split(/(\s+|<br>)/);

  // rebuild with each word wrapped in a clip container
  heroName.innerHTML = words
    .map((word) => {
      if (!word.trim() || word === "<br>") return word;
      return `<span class="word-clip"><span class="word-inner">${word}</span></span>`;
    })
    .join("");

  // inject styles
  const style = document.createElement("style");
  style.textContent = `
    .word-clip {
      display: inline-block;
      overflow: hidden;
      vertical-align: bottom;
      margin-right: 0.18em;
    }
    .word-inner {
      display: inline-block;
      transform: translateY(110%);
      opacity: 0;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 0.4s ease;
    }
    .word-inner.is-visible {
      transform: translateY(0);
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // also animate the eyebrow and tagline
  const eyebrow = document.querySelector(".eyebrow");
  const tagline = document.querySelector(".hero-tagline");
  const cta = document.querySelector(".hero-cta");

  [eyebrow, tagline, cta].forEach((el) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  // stagger each word in after splash screen clears
  const SPLASH_DURATION = 2600;

  setTimeout(() => {
    const wordInners = heroName.querySelectorAll(".word-inner");

    wordInners.forEach((word, i) => {
      setTimeout(() => {
        word.classList.add("is-visible");
      }, i * 80);
    });

    // eyebrow comes in first, before the name
    if (eyebrow) {
      setTimeout(() => {
        eyebrow.style.opacity = "1";
        eyebrow.style.transform = "translateY(0)";
      }, 0);
    }

    // tagline after name finishes
    if (tagline) {
      setTimeout(() => {
        tagline.style.opacity = "1";
        tagline.style.transform = "translateY(0)";
      }, wordInners.length * 80 + 100);
    }

    // CTA last
    if (cta) {
      setTimeout(() => {
        cta.style.opacity = "1";
        cta.style.transform = "translateY(0)";
      }, wordInners.length * 80 + 250);
    }
  }, SPLASH_DURATION);
})();
