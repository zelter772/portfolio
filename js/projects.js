/* =========================================================
   Project preview iframes — lazy-loaded only when scrolled
   into view, with a graceful fallback if a site refuses to
   load inside an iframe (some hosts block embedding via
   X-Frame-Options / CSP headers).
   ========================================================= */

(function () {
  const frameWraps = document.querySelectorAll('.preview-frame-wrap[data-src]');

  if (!frameWraps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadPreview(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '200px' } // start loading slightly before it's on screen
  );

  frameWraps.forEach((wrap) => {
    const src = wrap.getAttribute('data-src');
    if (src) {
      observer.observe(wrap);
    }
    // If data-src is empty (e.g. project not deployed yet), leave the
    // static placeholder exactly as authored in the HTML.
  });

  function loadPreview(wrap) {
    const src = wrap.getAttribute('data-src');
    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.setAttribute('title', 'Live preview of ' + src);
    iframe.setAttribute('referrerpolicy', 'no-referrer');

    // Fallback: if the iframe fails to load (blocked by the target site's
    // headers), keep the placeholder text visible instead of a blank box.
    let loaded = false;
    iframe.addEventListener('load', () => {
      loaded = true;
    });

    // Some blocked iframes still technically "load" an empty/error page
    // without throwing — there's no 100% reliable cross-origin way to
    // detect this from JS. This timeout is a best-effort safety net for
    // iframes that never fire `load` at all.
    setTimeout(() => {
      if (!loaded) {
        const placeholder = wrap.querySelector('.preview-placeholder');
        if (placeholder) {
          placeholder.querySelector('.placeholder-text').textContent =
            'preview unavailable — view live site instead';
        }
      }
    }, 6000);

    wrap.innerHTML = '';
    wrap.appendChild(iframe);
  }
})();
