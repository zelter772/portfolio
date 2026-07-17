/* =========================================================
   interactions.js — bundles six enhancements:
   3. Text scramble on section labels
   4. Magnetic buttons
   5. Parallax layers in hero
   7. Smooth anchor scroll with momentum
   8. Image reveal on scroll
   10. Cursor label on project cards
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -------------------------------------------------------
     3. TEXT SCRAMBLE on section labels
     ------------------------------------------------------- */
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01";

  function scramble(el) {
    const original = el.getAttribute("data-label") || el.textContent.trim();
    el.setAttribute("data-label", original);
    let frame = 0;
    const totalFrames = 18;
    const interval = setInterval(() => {
      el.textContent = original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame / totalFrames > i / original.length) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      frame++;
      if (frame > totalFrames) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 30);
  }

  if (!prefersReducedMotion) {
    const labels = document.querySelectorAll(".section-label");
    const scrambleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scramble(entry.target);
            scrambleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    labels.forEach((label) => scrambleObserver.observe(label));
  }

  /* -------------------------------------------------------
     4. MAGNETIC BUTTONS
     ------------------------------------------------------- */
  //   if (!prefersReducedMotion) {
  //     const magnetics = document.querySelectorAll(
  //       ".btn-primary, .btn-ghost, .project-link, .social-link"
  //     );

  //     magnetics.forEach((el) => {
  //       el.style.transition =
  //         "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease, border-color 0.3s ease";

  //       el.addEventListener("mousemove", (e) => {
  //         const rect = el.getBoundingClientRect();
  //         const cx = e.clientX - rect.left - rect.width / 2;
  //         const cy = e.clientY - rect.top - rect.height / 2;
  //         el.style.transform = `translate(${cx * 0.25}px, ${cy * 0.25}px)`;
  //       });

  //       el.addEventListener("mouseleave", () => {
  //         el.style.transform = "translate(0, 0)";
  //       });
  //     });
  //   }

  /* -------------------------------------------------------
     5. PARALLAX LAYERS in hero
     ------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const heroName = document.querySelector(".hero-name");
    const heroTagline = document.querySelector(".hero-tagline");
    const heroCta = document.querySelector(".hero-cta");
    const eyebrow = document.querySelector(".eyebrow");

    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (heroName) heroName.style.transform = `translateY(${y * 0.18}px)`;
        if (eyebrow) eyebrow.style.transform = `translateY(${y * 0.12}px)`;
        if (heroTagline)
          heroTagline.style.transform = `translateY(${y * 0.1}px)`;
        if (heroCta) heroCta.style.transform = `translateY(${y * 0.07}px)`;
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------
     7. SMOOTH ANCHOR SCROLL with momentum easing
     ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();

      const targetY = target.getBoundingClientRect().top + window.scrollY - 80;
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 900;
      let startTime = null;

      function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutQuart(progress));
        if (elapsed < duration) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  });

  /* -------------------------------------------------------
     8. IMAGE REVEAL on scroll
     A blue block slides away left-to-right to unveil
     each project screenshot as it enters the viewport.
     ------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const style = document.createElement("style");
    style.textContent = `
      .cs-shot-frame {
        position: relative;
      }
      .img-reveal-block {
        position: absolute;
        inset: 0;
        background: #3B82F6;
        z-index: 2;
        transform-origin: left;
        transform: scaleX(1);
        transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        border-radius: 0 0 8px 8px;
      }
      .img-reveal-block.revealed {
        transform: scaleX(0);
        transform-origin: right;
      }
    `;
    document.head.appendChild(style);

    const shotFrames = document.querySelectorAll(".cs-shot-frame");
    shotFrames.forEach((frame) => {
      const block = document.createElement("div");
      block.className = "img-reveal-block";
      frame.appendChild(block);
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const block = entry.target.querySelector(".img-reveal-block");
            if (block) {
              setTimeout(() => block.classList.add("revealed"), 150);
            }
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    shotFrames.forEach((frame) => revealObserver.observe(frame));
  }

  /* -------------------------------------------------------
     10. CURSOR LABEL on project cards
     A small label appears next to the cursor ring when
     hovering over a project card.
     ------------------------------------------------------- */
  //   if (!prefersReducedMotion) {
  //     const label = document.createElement("div");
  //     label.style.cssText = `
  //       position: fixed;
  //       font-family: 'Space Mono', monospace;
  //       font-size: 10px;
  //       color: #F5F5F5;
  //       background: #3B82F6;
  //       padding: 4px 10px;
  //       border-radius: 20px;
  //       pointer-events: none;
  //       z-index: 998;
  //       opacity: 0;
  //       transform: translate(18px, -50%) scale(0.85);
  //       transition: opacity 0.2s ease, transform 0.2s ease;
  //       white-space: nowrap;
  //       letter-spacing: 0.06em;
  //     `;
  //     label.textContent = "View case study";
  //     document.body.appendChild(label);

  //     let labelX = 0;
  //     let labelY = 0;

  //     document.addEventListener("mousemove", (e) => {
  //       labelX = e.clientX;
  //       labelY = e.clientY;
  //       label.style.left = labelX + "px";
  //       label.style.top = labelY + "px";
  //     });

  //     const cards = document.querySelectorAll(".project-card");
  //     cards.forEach((card) => {
  //       card.addEventListener("mouseenter", () => {
  //         label.style.opacity = "1";
  //         label.style.transform = "translate(18px, -50%) scale(1)";
  //       });
  //       card.addEventListener("mouseleave", () => {
  //         label.style.opacity = "0";
  //         label.style.transform = "translate(18px, -50%) scale(0.85)";
  //       });
  //     });
  //   }
})();
