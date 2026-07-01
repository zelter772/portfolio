/* =========================================================
   Scroll progress indicator — a thin vertical line on the
   right edge of the screen that fills as you scroll down.
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  // create the track (background line)
  const track = document.createElement("div");
  track.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 120px;
    background: #1f1f1f;
    z-index: 100;
    border-radius: 1px;
  `;

  // create the fill (progress line)
  const fill = document.createElement("div");
  fill.style.cssText = `
    width: 100%;
    height: 0%;
    background: #3B82F6;
    border-radius: 1px;
    transition: height 0.1s ease;
  `;

  // create the percentage label
  const label = document.createElement("div");
  label.style.cssText = `
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: #3B82F6;
    letter-spacing: 0.06em;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  label.textContent = "0%";

  track.appendChild(fill);
  track.appendChild(label);
  document.body.appendChild(track);

  let scrollTimeout;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min((scrollTop / docHeight) * 100, 100);

    fill.style.height = progress + "%";
    label.textContent = Math.round(progress) + "%";

    // show label while scrolling, hide when stopped
    label.style.opacity = "1";
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      label.style.opacity = "0";
    }, 1000);
  });
})();
