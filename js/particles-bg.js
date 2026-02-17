// Particle/starfield background for homepage
const canvas = document.createElement('canvas');
canvas.id = 'bg-particles';
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = -2;
// Always keep canvas as first child
function ensureCanvasFirst() {
  if (document.body.firstChild !== canvas) {
    document.body.insertBefore(canvas, document.body.firstChild);
  }
}
ensureCanvasFirst();
document.addEventListener('DOMContentLoaded', ensureCanvasFirst);
window.addEventListener('resize', ensureCanvasFirst);
// Force resize after DOMContentLoaded
document.addEventListener('DOMContentLoaded', resize);
canvas.style.pointerEvents = 'none';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let w, h, dpr;
function resize() {
  dpr = window.devicePixelRatio || 1;
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resize);
resize();

// Starfield/particle config
const STAR_COUNT = Math.floor((w * h) / 1800);
const STARS = [];
for (let i = 0; i < STAR_COUNT; i++) {
  STARS.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2 + 0.3,
    dx: (Math.random() - 0.5) * 0.08,
    dy: (Math.random() - 0.5) * 0.08,
    alpha: Math.random() * 0.5 + 0.5
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  // Glow effect
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const s of STARS) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 2.2, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(139,92,246,0.08)`;
    ctx.fill();
  }
  ctx.restore();
  for (const s of STARS) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(6,182,212,${s.alpha})`;
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function animate() {
  for (const s of STARS) {
    s.x += s.dx;
    s.y += s.dy;
    if (s.x < 0) s.x = w;
    if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h;
    if (s.y > h) s.y = 0;
  }
  draw();
  requestAnimationFrame(animate);
}
animate();
