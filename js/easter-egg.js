/* =========================================================
   Easter egg — double-clicking the AD_ logo triggers a
   brief terminal-style message in the corner, styled to
   match the CLI aesthetic of the portfolio.
   ========================================================= */

(function () {
  const logo = document.querySelector(".logo");
  if (!logo) return;

  // create the terminal window
  const terminal = document.createElement("div");
  terminal.style.cssText = `
    position: fixed;
    bottom: 5rem;
    left: 2rem;
    background: #0d0d0d;
    border: 0.5px solid #1e3a5f;
    border-radius: 8px;
    padding: 0;
    width: 320px;
    z-index: 200;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    overflow: hidden;
  `;

  // terminal title bar
  const titleBar = document.createElement("div");
  titleBar.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #131313;
    border-bottom: 0.5px solid #1f1f1f;
  `;
  titleBar.innerHTML = `
    <span style="width:7px;height:7px;border-radius:50%;background:#2a2a2a;display:inline-block;"></span>
    <span style="width:7px;height:7px;border-radius:50%;background:#2a2a2a;display:inline-block;"></span>
    <span style="width:7px;height:7px;border-radius:50%;background:#2a2a2a;display:inline-block;"></span>
    <span style="font-family:'Space Mono',monospace;font-size:9px;color:#555;margin-left:6px;letter-spacing:0.06em;">
      ademide ~ portfolio
    </span>
  `;

  // terminal body
  const body = document.createElement("div");
  body.style.cssText = `
    padding: 1rem 1.25rem;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #555;
    line-height: 1.8;
    letter-spacing: 0.04em;
  `;

  const lines = [
    { text: "$ whoami", color: "#3B82F6", delay: 0 },
    { text: "adeboyejo ademide", color: "#aaa", delay: 400 },
    { text: "$ cat skills.txt", color: "#3B82F6", delay: 900 },
    { text: "react · next.js · supabase · node", color: "#aaa", delay: 1300 },
    { text: "paystack · seo · real-time systems", color: "#aaa", delay: 1700 },
    { text: "$ echo $status", color: "#3B82F6", delay: 2200 },
    { text: "open to freelance work ✓", color: "#4ade80", delay: 2600 },
  ];

  terminal.appendChild(titleBar);
  terminal.appendChild(body);
  document.body.appendChild(terminal);

  let hideTimer = null;
  let isVisible = false;

  function showTerminal() {
    // clear any previous content and timers
    body.innerHTML = "";
    clearTimeout(hideTimer);

    // show the terminal
    terminal.style.opacity = "1";
    terminal.style.transform = "translateY(0)";
    terminal.style.pointerEvents = "auto";
    isVisible = true;

    // type out lines one by one
    lines.forEach((line) => {
      setTimeout(() => {
        const el = document.createElement("div");
        el.style.color = line.color;
        el.textContent = line.text;
        body.appendChild(el);
      }, line.delay);
    });

    // auto-hide after all lines have shown + a pause
    hideTimer = setTimeout(hideTerminal, 2600 + 2500);
  }

  function hideTerminal() {
    terminal.style.opacity = "0";
    terminal.style.transform = "translateY(10px)";
    terminal.style.pointerEvents = "none";
    isVisible = false;
  }

  // double-click to show, click again to dismiss if visible
  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener("click", (e) => {
    e.preventDefault();
    clickCount++;

    if (clickCount === 2) {
      clickCount = 0;
      clearTimeout(clickTimer);
      if (isVisible) {
        hideTerminal();
      } else {
        showTerminal();
      }
      return;
    }

    // reset click count after 400ms if second click doesn't come
    clickTimer = setTimeout(() => {
      clickCount = 0;
      // single click — navigate normally
      window.location.href = logo.getAttribute("href");
    }, 400);
  });

  // also dismiss on single click anywhere else while visible
  document.addEventListener("click", (e) => {
    if (isVisible && !terminal.contains(e.target) && e.target !== logo) {
      hideTerminal();
    }
  });
})();
