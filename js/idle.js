/* =========================================================
   Idle prompt — appears after 5 seconds of no interaction,
   anywhere on the page. Text changes based on scroll position.
   Positioned bottom-right, above the scroll indicator.
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const prompt = document.createElement("div");
  prompt.style.cssText = `
    position: fixed;
    bottom: 2.5rem;
    right: 3rem;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: #3B82F6;
    letter-spacing: 0.08em;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 6px;
  `;

  const blink = `<span style="
    display: inline-block;
    width: 6px;
    height: 10px;
    background: #3B82F6;
    animation: idleBlink 0.8s step-end infinite;
    vertical-align: middle;
  "></span>`;

  document.body.appendChild(prompt);

  const style = document.createElement("style");
  style.textContent = `@keyframes idleBlink { 50% { opacity: 0; } }`;
  document.head.appendChild(style);

  // different messages depending on where the user is on the page
  function getContextMessage() {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollY / docHeight;

    if (progress < 0.1) return "scroll to explore_";
    if (progress < 0.35) return "see what I've built_";
    if (progress < 0.65) return "explore the projects_";
    if (progress < 0.98) return "let's work together_";
    return "back to the top?_";
  }

  function showPrompt() {
    prompt.innerHTML = getContextMessage() + " " + blink;
    prompt.style.opacity = "1";
  }

  function hidePrompt() {
    prompt.style.opacity = "0";
  }

  const IDLE_DELAY = 5000;
  let idleTimer = null;

  function resetTimer() {
    clearTimeout(idleTimer);
    hidePrompt();
    idleTimer = setTimeout(showPrompt, IDLE_DELAY);
  }

  ["mousemove", "keydown", "click", "touchstart", "scroll"].forEach((event) => {
    window.addEventListener(event, resetTimer, { passive: true });
  });

  // start on load
  idleTimer = setTimeout(showPrompt, IDLE_DELAY);
})();
