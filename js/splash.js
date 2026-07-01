/* =========================================================
   Splash screen — shows the AD logo mark centered on a
   dark screen, holds for a moment, then zooms in and fades
   out to reveal the site underneath.
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // create overlay
  const splash = document.createElement("div");
  splash.id = "splash";
  splash.style.cssText = `
    position: fixed;
    inset: 0;
    background: #0A0A0A;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    transition: opacity 0.6s ease;
  `;

  // logo mark
  const logo = document.createElement("img");
  logo.src = "assets/icons/logo.svg";
  logo.alt = "Adeboyejo Ademide";
  logo.style.cssText = `
    width: 80px;
    height: 80px;
    border-radius: 14px;
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 0.5s ease, transform 0.5s ease;
  `;

  // name beneath logo
  const name = document.createElement("div");
  name.style.cssText = `
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #3B82F6;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 0.5s ease 0.2s;
  `;
  name.textContent = "adeboyejo ademide";

  splash.appendChild(logo);
  splash.appendChild(name);
  document.body.appendChild(splash);

  // prevent scrolling while splash is showing
  document.body.style.overflow = "hidden";

  if (prefersReducedMotion) {
    // skip animation entirely
    document.body.style.overflow = "";
    splash.remove();
    return;
  }

  // sequence: fade logo in → hold → zoom in and fade out
  function runSplash() {
    // step 1 — fade logo in
    requestAnimationFrame(() => {
      logo.style.opacity = "1";
      logo.style.transform = "scale(1)";
      name.style.opacity = "1";
    });

    // step 2 — hold, then zoom in and fade out
    setTimeout(() => {
      logo.style.transition =
        "opacity 0.5s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      logo.style.transform = "scale(12)";
      logo.style.opacity = "0";
      name.style.opacity = "0";
      splash.style.opacity = "0";

      // step 3 — remove splash and restore scroll
      setTimeout(() => {
        document.body.style.overflow = "";
        splash.remove();
      }, 650);
    }, 1600);
  }

  // slight delay so fonts are loaded before we start
  setTimeout(runSplash, 200);
})();
