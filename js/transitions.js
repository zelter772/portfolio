/* =========================================================
   Page transitions:
   - Regular links (nav, back) — smooth fade + slight slide up
   - Next/prev project links — page turn effect
   ========================================================= */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  /* -------------------------------------------------------
     Inject styles
     ------------------------------------------------------- */
  const style = document.createElement("style");
  style.textContent = `
    /* ---- base overlay ---- */
    #page-transition-overlay {
      position: fixed;
      inset: 0;
      z-index: 8000;
      pointer-events: none;
      display: flex;
    }

    /* ---- regular transition — single dark panel ---- */
    .transition-panel {
      position: fixed;
      inset: 0;
      background: #0A0A0A;
      z-index: 8000;
      transform: translateY(100%);
      transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .transition-panel.slide-in {
      transform: translateY(0);
    }

    .transition-panel.slide-out {
      transform: translateY(-100%);
      transition: transform 0.45s cubic-bezier(0.7, 0, 0.84, 0);
    }

    /* ---- page turn — two panels ---- */
    .turn-panel-left {
      position: fixed;
      top: 0; left: 0;
      width: 50%;
      height: 100%;
      background: #0A0A0A;
      z-index: 8000;
      transform-origin: left center;
      transform: scaleX(0);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .turn-panel-right {
      position: fixed;
      top: 0; right: 0;
      width: 50%;
      height: 100%;
      background: #0A0A0A;
      z-index: 8000;
      transform-origin: right center;
      transform: scaleX(0);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .turn-panel-left.turn-in,
    .turn-panel-right.turn-in {
      transform: scaleX(1);
    }

    .turn-panel-left.turn-out {
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.45s cubic-bezier(0.7, 0, 0.84, 0) 0.05s;
    }

    .turn-panel-right.turn-out {
      transform: scaleX(0);
      transform-origin: right center;
      transition: transform 0.45s cubic-bezier(0.7, 0, 0.84, 0);
    }

    /* blue accent line that runs across center during page turn */
    .turn-line {
      position: fixed;
      top: 0;
      left: 50%;
      width: 1px;
      height: 100%;
      background: #3B82F6;
      z-index: 8001;
      transform: scaleY(0);
      transform-origin: top;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .turn-line.line-in {
      transform: scaleY(1);
    }

    .turn-line.line-out {
      transform: scaleY(0);
      transform-origin: bottom;
      transition: transform 0.35s cubic-bezier(0.7, 0, 0.84, 0);
    }

    /* page enters from below after transition */
    body.page-entering .page {
      animation: pageEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes pageEnter {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  /* -------------------------------------------------------
     Create elements
     ------------------------------------------------------- */

  // regular transition panel
  const panel = document.createElement("div");
  panel.className = "transition-panel";
  document.body.appendChild(panel);

  // page turn panels
  const turnLeft = document.createElement("div");
  turnLeft.className = "turn-panel-left";
  const turnRight = document.createElement("div");
  turnRight.className = "turn-panel-right";
  const turnLine = document.createElement("div");
  turnLine.className = "turn-line";
  document.body.appendChild(turnLeft);
  document.body.appendChild(turnRight);
  document.body.appendChild(turnLine);

  /* -------------------------------------------------------
     Page enter animation on load
     ------------------------------------------------------- */
  document.body.classList.add("page-entering");
  setTimeout(() => document.body.classList.remove("page-entering"), 700);

  /* -------------------------------------------------------
     Regular transition — fade + slide
     ------------------------------------------------------- */
  function regularTransition(href) {
    panel.classList.remove("slide-out");
    panel.classList.add("slide-in");

    setTimeout(() => {
      window.location.href = href;
    }, 500);
  }

  function regularTransitionOut() {
    setTimeout(() => {
      panel.classList.remove("slide-in");
      panel.classList.add("slide-out");
    }, 50);
  }

  /* -------------------------------------------------------
     Page turn transition
     ------------------------------------------------------- */
  function pageTurnTransition(href) {
    // both panels close inward simultaneously
    turnLeft.classList.add("turn-in");
    turnRight.classList.add("turn-in");
    turnLine.classList.add("line-in");

    setTimeout(() => {
      window.location.href = href;
    }, 520);
  }

  function pageTurnTransitionOut() {
    setTimeout(() => {
      turnLeft.classList.remove("turn-in");
      turnLeft.classList.add("turn-out");
      turnRight.classList.remove("turn-in");
      turnRight.classList.add("turn-out");
      turnLine.classList.remove("line-in");
      turnLine.classList.add("line-out");
    }, 50);
  }

  /* -------------------------------------------------------
     Wire up links
     ------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // ignore: external links, anchor links, new tab links
    if (
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto") ||
      href.startsWith("tel") ||
      link.target === "_blank"
    )
      return;

    e.preventDefault();

    // next project links get the page turn
    if (link.classList.contains("cs-next-link")) {
      pageTurnTransition(href);
    } else {
      // everything else gets the regular slide
      regularTransition(href);
    }
  });

  /* -------------------------------------------------------
     On page load — run exit animation of whichever
     transition brought us here. We store which type
     was used in sessionStorage.
     ------------------------------------------------------- */
  window.addEventListener("beforeunload", () => {
    const activeLink = document.querySelector("a:focus");
    if (activeLink && activeLink.classList.contains("cs-next-link")) {
      sessionStorage.setItem("lastTransition", "turn");
    } else {
      sessionStorage.setItem("lastTransition", "regular");
    }
  });

  const lastTransition = sessionStorage.getItem("lastTransition");
  if (lastTransition === "turn") {
    pageTurnTransitionOut();
  } else if (lastTransition === "regular") {
    regularTransitionOut();
  }

  sessionStorage.removeItem("lastTransition");
})();
