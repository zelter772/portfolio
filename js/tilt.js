/* =========================================================
   Project card hover glow — subtle blue shadow on hover,
   snaps back on mouse leave. No 3D tilt.
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.transition = "box-shadow 0.3s ease, border-color 0.3s ease";

    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 0 32px rgba(59, 130, 246, 0.1)";
      card.style.borderColor = "#2a4a7f";
    });

    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "none";
      card.style.borderColor = "";
    });
  });
})();
