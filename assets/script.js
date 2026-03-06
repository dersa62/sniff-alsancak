const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
const splitNodes = Array.from(document.querySelectorAll('[data-split]'));
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
const cinematicHero = document.querySelector('.hero-refined, .hero-cinematic');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cinematicGroups = Array.from(cinematicParallaxContainers).map((container) => ({
  container,
  layers: Array.from(container.querySelectorAll('.parallax-layer')).map((layer) => ({
    el: layer,
    ratio: Number(layer.getAttribute('data-ratio') || 0.5),
  })),
}));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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

const splitTextNode = (node) => {
  if (node.classList.contains('split-ready')) return;

  const source = node.textContent || '';
  const text = source.replace(/\s+/g, ' ').trim();
  if (!text) return;

  const fragment = document.createDocumentFragment();

  Array.from(text).forEach((char, index) => {
    const span = document.createElement('span');
    if (char === ' ') {
      span.className = 'split-space';
      span.textContent = '\u00a0';
    } else {
      span.className = 'split-char';
      span.style.setProperty('--char-index', String(index));
      span.textContent = char;
    }
    fragment.appendChild(span);
  });

  node.textContent = '';
  node.appendChild(fragment);
  node.classList.add('split-ready');
};

splitNodes.forEach(splitTextNode);

revealNodes.forEach((node, index) => {
  const delay = (index % 8) * 40;
  node.style.setProperty('--reveal-delay', `${delay}ms`);
});

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

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

const updateVisuals = (scrollYValue) => {
  const y = scrollYValue;
  const viewportCenter = window.innerHeight / 2;

  if (nav) {
    nav.classList.toggle('scrolled', y > 14);
  }

  if (cinematicHero) {
    const heroTravel = Math.max(window.innerHeight * 0.9, cinematicHero.offsetHeight * 0.66);
    const progress = clamp(y / heroTravel, 0, 1);
    cinematicHero.style.setProperty('--entry-progress', progress.toFixed(3));
  }

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

};

let smoothY = window.scrollY;
let targetY = window.scrollY;
let rafId = null;

const animate = () => {
  targetY = window.scrollY;

  if (prefersReducedMotion) {
    smoothY = targetY;
  } else {
    smoothY += (targetY - smoothY) * 0.12;
    if (Math.abs(targetY - smoothY) < 0.12) {
      smoothY = targetY;
    }
  }

  updateVisuals(smoothY);

  if (!prefersReducedMotion && Math.abs(targetY - smoothY) > 0.12) {
    rafId = requestAnimationFrame(animate);
    return;
  }

  rafId = null;
};

const queueAnimation = () => {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(animate);
};

window.addEventListener(
  'scroll',
  () => {
    targetY = window.scrollY;
    queueAnimation();
  },
  { passive: true }
);

window.addEventListener('resize', queueAnimation, { passive: true });

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
  queueAnimation();
});

queueAnimation();
