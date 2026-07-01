/* =========================================================
   Background — floating particles with connection lines,
   mouse repulsion, and click ripple
   ========================================================= */

(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", () => {
    resize();
    seedParticles();
  });

  if (prefersReducedMotion) {
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const PARTICLE_COUNT = 55;
  const CONNECTION_DISTANCE = 160;
  const PARTICLE_SPEED = 0.35;
  const PARTICLE_COLOR = "59, 130, 246";
  const REPULSION_RADIUS = 120;
  const REPULSION_STRENGTH = 2.5;

  let mouseX = -9999;
  let mouseY = -9999;
  const ripples = [];

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // click ripple
  window.addEventListener("click", (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 180,
      opacity: 0.5,
      speed: 4,
    });
  });

  const particles = [];

  function seedParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED,
        baseVx: (Math.random() - 0.5) * PARTICLE_SPEED,
        baseVy: (Math.random() - 0.5) * PARTICLE_SPEED,
        radius: 1 + Math.random() * 1.2,
        opacity: 0.2 + Math.random() * 0.3,
      });
    }
  }
  seedParticles();

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${r.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // also push nearby particles outward as ripple expands
      particles.forEach((p) => {
        const dx = p.x - r.x;
        const dy = p.y - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - r.radius) < 20 && dist > 0) {
          const force = (1 - Math.abs(dist - r.radius) / 20) * 1.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });

      r.radius += r.speed;
      r.opacity -= 0.012;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // — ripples —
    drawRipples();

    // — connection lines —
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const lineOpacity = (1 - dist / CONNECTION_DISTANCE) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${lineOpacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // — particles —
    particles.forEach((p) => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPULSION_RADIUS && dist > 0) {
        const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
        p.vx += (dx / dist) * force * 0.08;
        p.vy += (dy / dist) * force * 0.08;
      }

      p.vx += (p.baseVx - p.vx) * 0.03;
      p.vy += (p.baseVy - p.vy) * 0.03;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.opacity})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) {
        p.vx *= -1;
        p.baseVx *= -1;
      }
      if (p.y < 0 || p.y > canvas.height) {
        p.vy *= -1;
        p.baseVy *= -1;
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
