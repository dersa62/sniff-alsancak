const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
const revealNodes = document.querySelectorAll('[data-reveal]');
const parallaxNodes = document.querySelectorAll('[data-speed]');
const heroParallaxNodes = document.querySelectorAll('.hero, .page-hero');
const sectionParallaxNodes = document.querySelectorAll('.bg-cover-section');
const cardParallaxNodes = document.querySelectorAll('.photo-card');
const tileParallaxNodes = document.querySelectorAll('.gallery-tile');
const scrollDividerNodes = document.querySelectorAll('[data-scroll-divider]');
const cinematicParallaxContainers = document.querySelectorAll('[data-cinematic-parallax]');
const yearNodes = document.querySelectorAll('[data-year]');
const reservationForms = document.querySelectorAll('[data-reservation-form]');
const floatingGlass = document.querySelector('.floating-glass');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cinematicGroups = Array.from(cinematicParallaxContainers).map((container) => ({
  container,
  layers: Array.from(container.querySelectorAll('.parallax-layer')).map((layer) => ({
    el: layer,
    ratio: Number(layer.getAttribute('data-ratio') || 0.5),
  })),
}));

const clearReservationForm = (form) => {
  form.reset();
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach((field) => {
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.value = '';
    }
    if (field instanceof HTMLSelectElement) {
      field.selectedIndex = 0;
    }
  });
};

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

window.addEventListener(
  'scroll',
  () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 14);
  },
  { passive: true }
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
  }
);

revealNodes.forEach((node) => observer.observe(node));

let ticking = false;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const handleParallax = () => {
  if (prefersReducedMotion) {
    ticking = false;
    return;
  }

  const y = window.scrollY;
  const viewportCenter = window.innerHeight / 2;

  parallaxNodes.forEach((node) => {
    const speed = Number(node.dataset.speed || 0.1);
    node.style.transform = `translate3d(0, ${-(y * speed)}px, 0)`;
  });

  heroParallaxNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const centerDelta = rect.top + rect.height / 2 - viewportCenter;
    const offset = clamp(centerDelta * -0.14, -90, 90);
    node.style.setProperty('--hero-offset', `${offset}px`);
  });

  sectionParallaxNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const centerDelta = rect.top + rect.height / 2 - viewportCenter;
    const offset = clamp(centerDelta * -0.1, -70, 70);
    node.style.setProperty('--section-offset', `${offset}px`);
  });

  cardParallaxNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const centerDelta = rect.top + rect.height / 2 - viewportCenter;
    const offset = clamp(centerDelta * -0.06, -36, 36);
    node.style.setProperty('--card-offset', `${offset}px`);
  });

  tileParallaxNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const centerDelta = rect.top + rect.height / 2 - viewportCenter;
    const offset = clamp(centerDelta * -0.06, -34, 34);
    node.style.setProperty('--tile-offset', `${offset}px`);
  });

  const cinematicDepth = window.innerWidth < 840 ? 105 : 170;

  cinematicGroups.forEach(({ container, layers }) => {
    const rect = container.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
    const depth = (progress - 0.5) * 2;
    layers.forEach(({ el, ratio }) => {
      const offset = depth * cinematicDepth * ratio;
      el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });
  });

  scrollDividerNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const total = window.innerHeight + rect.height;
    const rawProgress = (window.innerHeight - rect.top) / total;
    const progress = clamp(rawProgress, 0.05, 1);
    const value = progress.toFixed(3);
    node.style.setProperty('--divider-progress', value);

    // Decorative lines live in inner wrappers; keep the variable in sync there too.
    const innerTargets = node.querySelectorAll('.contact-art-card, .footer-modern');
    innerTargets.forEach((target) => {
      target.style.setProperty('--divider-progress', value);
    });
  });

  if (floatingGlass) {
    const drift = Math.min(320, y * 0.18);
    const sway = Math.sin(y * 0.0025) * 5;
    const rotate = -7 + sway;
    const scale = 1 + Math.min(y * 0.00006, 0.12);
    floatingGlass.style.transform = `translate3d(0, ${drift}px, 0) rotate(${rotate}deg) scale(${scale})`;
  }

  ticking = false;
};

window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(handleParallax);
  },
  { passive: true }
);

const currentYear = new Date().getFullYear();
yearNodes.forEach((node) => {
  node.textContent = String(currentYear);
});

reservationForms.forEach((form) => {
  clearReservationForm(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = form.querySelector('.form-note');
    if (!note) return;
    note.textContent = 'Rezervasyon talebiniz alındı. Kısa süre içinde telefonla onay verilecektir.';
    note.style.color = '#ffe08a';
    form.reset();
  });
});

window.addEventListener('pageshow', () => {
  reservationForms.forEach((form) => {
    clearReservationForm(form);
  });
});

handleParallax();
