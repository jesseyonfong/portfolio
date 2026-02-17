// Parallax and Interactive Effects for Homepage

// Mouse parallax effect on cards
const cards = document.querySelectorAll('.card, .service-card, .fab');
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    const distX = e.clientX - cardCenterX;
    const distY = e.clientY - cardCenterY;
    
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDistance = 200;
    
    if (distance < maxDistance) {
      const angle = Math.atan2(distY, distX);
      const force = (1 - distance / maxDistance) * 0.15;
      
      card.style.setProperty('--mouse-x', `${mouseX * 100}%`);
      card.style.setProperty('--mouse-y', `${mouseY * 100}%`);
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = getComputedStyle(entry.target).animation || 'slideInUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.card, .service-card, .section-title, .skill-category, .timeline-item, .subsection-title').forEach(el => {
  observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Dynamic background parallax on scroll
let scrollProgress = 0;
window.addEventListener('scroll', () => {
  scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.body.style.backgroundPosition = `${scrollProgress * 0.5}% ${scrollProgress * 0.5}%`;
  
  // Floating effect on FABs
  const fabs = document.querySelectorAll('.fab');
  fabs.forEach(fab => {
    const scrollOffset = window.scrollY * 0.05;
    fab.style.transform = `translateY(${scrollOffset}px)`;
  });
});

// CTA button ripple effect
const buttons = document.querySelectorAll('.btn, .fab');
buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      animation: ripple-animation 0.6s ease-out;
    `;
    
    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    from {
      opacity: 1;
      transform: scale(0);
    }
    to {
      opacity: 0;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

// Enhance hero section with staggered animations
const heroElements = document.querySelectorAll('.hero > *');
heroElements.forEach((el, index) => {
  el.style.animation = `slideInUp 0.8s ease ${index * 0.1}s backwards`;
});

// Add glow effect on scroll for CTA section
const ctaSection = document.querySelector('.cta-section');
if (ctaSection) {
  window.addEventListener('scroll', () => {
    const rect = ctaSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      ctaSection.style.animation = 'glow 3s ease-in-out infinite';
    }
  });
}

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Could close any open menus here
  }
});

// Prefetch projects page for faster navigation
const link = document.createElement('link');
link.rel = 'prefetch';
link.href = 'projects.html';
document.head.appendChild(link);

// Add subtle cursor glow effect
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  display: none;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.display = 'block';
  cursor.style.left = (e.clientX - 15) + 'px';
  cursor.style.top = (e.clientY - 15) + 'px';
});

document.addEventListener('mouseleave', () => {
  cursor.style.display = 'none';
});
