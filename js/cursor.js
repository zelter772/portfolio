// /* =========================================================
//    Custom cursor — trailing ring with elastic easing,
//    expands on hover over interactive elements
//    ========================================================= */

// (function () {
//   const ring = document.getElementById('cursor-ring');
//   const dot = document.getElementById('cursor-dot');

//   // Skip entirely on touch devices (CSS also hides these elements)
//   if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
//     return;
//   }

//   let mouseX = 0;
//   let mouseY = 0;
//   let ringX = 0;
//   let ringY = 0;
//   let ringSize = 28;
//   let targetSize = 28;
//   let hasMoved = false;

//   document.addEventListener('mousemove', (e) => {
//     mouseX = e.clientX;
//     mouseY = e.clientY;
//     dot.style.left = mouseX + 'px';
//     dot.style.top = mouseY + 'px';

//     if (!hasMoved) {
//       hasMoved = true;
//       ring.style.opacity = '1';
//       dot.style.opacity = '1';
//     }
//   });

//   document.addEventListener('mouseleave', () => {
//     ring.style.opacity = '0';
//     dot.style.opacity = '0';
//   });

//   document.addEventListener('mouseenter', () => {
//     if (hasMoved) {
//       ring.style.opacity = '1';
//       dot.style.opacity = '1';
//     }
//   });

//   // Expand the ring whenever hovering over an interactive element.
//   // Elements opt in via the `.hoverable` class.
//   function attachHoverListeners() {
//     document.querySelectorAll('.hoverable').forEach((el) => {
//       el.addEventListener('mouseenter', () => {
//         targetSize = 44;
//         ring.style.background = 'rgba(59, 130, 246, 0.08)';
//       });
//       el.addEventListener('mouseleave', () => {
//         targetSize = 28;
//         ring.style.background = 'transparent';
//       });
//     });
//   }
//   attachHoverListeners();

//   // Re-attach if new hoverable elements are added later (e.g. dynamic content)
//   window.refreshCursorHoverables = attachHoverListeners;

//   function animate() {
//     ringX += (mouseX - ringX) * 0.2;
//     ringY += (mouseY - ringY) * 0.2;
//     ringSize += (targetSize - ringSize) * 0.2;

//     ring.style.left = ringX + 'px';
//     ring.style.top = ringY + 'px';
//     ring.style.width = ringSize + 'px';
//     ring.style.height = ringSize + 'px';

//     requestAnimationFrame(animate);
//   }
//   animate();
// })();

// cursor.js — retired. Custom cursor now handled via CSS url() in style.css
