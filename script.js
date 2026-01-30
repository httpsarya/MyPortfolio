// Typed text effect for roles
const roles = [
  'Video Editor',
  'Engineer',
  'Photo Editor',
  'Camera Operator',
  'Social Media Manager'
];

const typedEl = document.getElementById('typed');
const cursorEl = document.querySelector('.cursor');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex % roles.length];
  const speed = deleting ? 45 : 70; // typing speed

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1000);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex++;
    }
  }
  setTimeout(typeLoop, speed);
}

// Cursor blink
setInterval(() => {
  cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0';
}, 500);

// Mobile nav toggle with outside-click close and Escape key
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('primary-menu');
if (toggle && menu) {
  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// Smooth scrolling for internal anchors + active link highlight
const links = document.querySelectorAll('a[href^="#"]');
const navLinks = document.querySelectorAll('#primary-menu a');
links.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const el = document.querySelector(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Highlight active section in nav
const sections = Array.from(document.querySelectorAll('section[id]'));
const makeActive = (id) => {
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
};
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      makeActive(entry.target.id);
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
sections.forEach(sec => sectionObserver.observe(sec));

// Reveal on scroll (base)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .card, .info-card, .tool-card, .contact-card').forEach(el => observer.observe(el));

// Extra scroll animations: fade/slide variants with stagger
const extraObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = Array.from(entry.target.children || []);
      if (children.length > 0 && (entry.target.classList.contains('card-grid') || entry.target.classList.contains('tool-grid') || entry.target.classList.contains('contact-grid'))) {
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 60}ms`;
          child.classList.add('in');
        });
      }
      entry.target.classList.add('in');
      extraObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .card-grid.slide-in-right, .tool-grid.fade-in').forEach(el => extraObserver.observe(el));

// Auto year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Kick off typing when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  typeLoop();

  // Subtle parallax for background layers
  const bgGradient = document.querySelector('.bg-gradient');
  const orbA = document.querySelector('.orb-a');
  const orbB = document.querySelector('.orb-b');
  let ticking = false;
  // Back to top visibility + parallax
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const t1 = y * -0.02; // slower
        const t2 = y * -0.04; // faster
        if (bgGradient) bgGradient.style.transform = `translate3d(0, ${t1}px, 0)`;
        if (orbA) orbA.style.transform = `translate3d(0, ${t2}px, 0)`;
        if (orbB) orbB.style.transform = `translate3d(0, ${t1}px, 0)`;

        // Toggle back to top
        if (backToTop) {
          if (y > 400) backToTop.classList.add('show');
          else backToTop.classList.remove('show');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Back to top behavior
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});