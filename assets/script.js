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
const eventTargets = Array.from(document.querySelectorAll('[data-events-target]'));
const menuTargets = Array.from(document.querySelectorAll('[data-menu-target]'));
const yearNodes = document.querySelectorAll('[data-year]');
const reservationForms = document.querySelectorAll('[data-reservation-form]');
const cinematicHero = document.querySelector('.hero-refined, .hero-cinematic');
const navTriggerSection = document.querySelector('.hero-entry, .page-hero, .hero, .about-parallax');
const aboutParallaxSection = document.querySelector('[data-about-parallax]');
let floatingHeroLogo = document.querySelector('.hero-logo-float');
const homeEntryBody = document.body.classList.contains('home-entry') ? document.body : null;
const isHomeEntryPage = Boolean(homeEntryBody);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cookiePreferenceKey = 'sniff_cookie_preference_v1';
const reservationStorageKey = 'sniff_reservations_v1';
const eventsStorageKey = 'sniff_events_v1';
const menuStorageKey = 'sniff_menu_items_v1';
const eventsSyncKey = 'sniff_events_sync_v1';
const eventsChannelKey = 'sniff_events_channel_v1';
const reservationStorageLimit = 500;
const eventsChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(eventsChannelKey) : null;

const defaultEvents = [
  {
    id: 'evt_dj_geceleri',
    meta: 'Her Cuma • 22:00',
    title: 'DJ Gecesi',
    description: 'Melodik setler, yüksek enerji ve kırmızı-neon lounge atmosferi.',
    image: 'https://images.unsplash.com/photo-1690021416125-56f8464a8b01?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
  },
  {
    id: 'evt_imza_kokteyl',
    meta: 'Her Cumartesi • 21:30',
    title: 'İmza Kokteyl Gecesi',
    description: 'Sınırlı sayıda hazırlanan özel tariflerle konsept gece.',
    image: 'https://images.unsplash.com/photo-1749314374163-185677265d63?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
  },
  {
    id: 'evt_hafta_sonu_partisi',
    meta: 'Hafta Sonu • Geç Saatler',
    title: 'Hafta Sonu Partisi',
    description: 'Küratörlü müzik akışı ve şehirli parti temposu.',
    image: 'https://images.unsplash.com/photo-1745060829956-dcd14b3511cb?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
  },
];

const defaultMenuItems = [
  {
    id: 'menu_velvet_negroni',
    title: 'Velvet Negroni',
    description: 'Barrel gin, kırmızı bitter, vermut ve kakao-narenciye parfümü.',
    image: 'https://images.unsplash.com/photo-1749314374163-185677265d63?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_midnight_citrus',
    title: 'Midnight Citrus',
    description: 'Yuzu, bergamot köpük ve canlı limon yağları.',
    image: 'https://images.unsplash.com/photo-1671741967944-cb60915f5823?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_golden_bloom',
    title: 'Golden Bloom',
    description: 'Reposado tekila, safran ve passionfruit dengesi.',
    image: 'https://images.unsplash.com/photo-1745052811236-a56a0f8718d1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_smoked_garden',
    title: 'Smoked Garden',
    description: 'Mezcal, taze fesleğen, salatalık ve aromatik is.',
    image: 'https://images.unsplash.com/photo-1761388545625-b233a6f35628?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_ruby_boulevard',
    title: 'Ruby Boulevard',
    description: 'Bourbon, kiraz reduksiyonu ve baharatlı bitiş.',
    image: 'https://images.unsplash.com/photo-1690021416125-56f8464a8b01?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_neon_spritz',
    title: 'Neon Spritz',
    description: 'Mürver çiçeği, prosecco ve narenciye sisi.',
    image: 'https://images.unsplash.com/photo-1690021416431-d10365a06a3d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_saffron_sour',
    title: 'Saffron Sour',
    description: 'Safran şurubu, beyaz şeftali ve ipeksi doku.',
    image: 'https://images.unsplash.com/photo-1632558608598-f90ec7b026dd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_after_dark_martini',
    title: 'After Dark Martini',
    description: 'Espresso likörü, vanilya is dokusu ve kakao.',
    image: 'https://images.unsplash.com/photo-1745060829956-dcd14b3511cb?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
];

const cinematicGroups = Array.from(cinematicParallaxContainers).map((container) => ({
  container,
  layers: Array.from(container.querySelectorAll('.parallax-layer')).map((layer) => ({
    el: layer,
    ratio: Number(layer.getAttribute('data-ratio') || 0.5),
  })),
}));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const sanitizeText = (value, maxLength = 220) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);

const readStorageArray = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};

const writeStorageArray = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (_) {
    return false;
  }
};

const sanitizeImage = (value, fallbackImage = defaultEvents[0].image) => {
  const cleaned = String(value || '').trim().replace(/["'<>`]/g, '');
  return cleaned || fallbackImage;
};

const normalizeEvent = (event, index) => {
  if (!event || typeof event !== 'object') return null;
  const title = sanitizeText(event.title, 90);
  const description = sanitizeText(event.description, 220);
  if (!title || !description) return null;
  return {
    id: sanitizeText(event.id, 64) || `evt_${Date.now()}_${index}`,
    meta: sanitizeText(event.meta, 70) || 'Özel Etkinlik',
    title,
    description,
    image: sanitizeImage(event.image),
  };
};

const getEvents = () => {
  const normalized = readStorageArray(eventsStorageKey)
    .map((event, index) => normalizeEvent(event, index))
    .filter(Boolean);
  if (normalized.length > 0) return normalized;
  writeStorageArray(eventsStorageKey, defaultEvents);
  return defaultEvents;
};

const normalizeMenuItem = (item, index) => {
  if (!item || typeof item !== 'object') return null;
  const title = sanitizeText(item.title, 90);
  const description = sanitizeText(item.description, 220);
  if (!title || !description) return null;
  return {
    id: sanitizeText(item.id, 64) || `menu_${Date.now()}_${index}`,
    title,
    description,
    image: sanitizeImage(item.image, defaultMenuItems[0].image),
    price: sanitizeText(item.price, 32),
  };
};

const getMenuItems = () => {
  const normalized = readStorageArray(menuStorageKey)
    .map((item, index) => normalizeMenuItem(item, index))
    .filter(Boolean);
  if (normalized.length > 0) return normalized;
  writeStorageArray(menuStorageKey, defaultMenuItems);
  return [...defaultMenuItems];
};

const getReservations = () =>
  readStorageArray(reservationStorageKey).filter(
    (item) => item && typeof item === 'object' && sanitizeText(item.id, 80)
  );

const persistReservation = (reservation) => {
  const reservations = getReservations();
  reservations.unshift(reservation);
  if (reservations.length > reservationStorageLimit) {
    reservations.length = reservationStorageLimit;
  }
  writeStorageArray(reservationStorageKey, reservations);
};

const submitReservationToEndpoint = async (endpoint, reservation) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(reservation),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok || !payload || payload.ok !== true) {
    throw new Error((payload && payload.error) || 'Rezervasyon sunucuya iletilemedi.');
  }

  return payload;
};

const createEventCard = (event) => {
  const article = document.createElement('article');
  article.className = 'photo-card';
  article.setAttribute('data-reveal', '');
  article.style.setProperty('--card-image', `url('${sanitizeImage(event.image)}')`);

  const body = document.createElement('div');
  body.className = 'card-body';

  const meta = document.createElement('span');
  meta.className = 'event-meta';
  meta.textContent = sanitizeText(event.meta, 70);

  const title = document.createElement('h3');
  title.textContent = sanitizeText(event.title, 90);

  const description = document.createElement('p');
  description.textContent = sanitizeText(event.description, 220);

  body.append(meta, title, description);
  article.appendChild(body);
  return article;
};

const createMenuCard = (item) => {
  const article = document.createElement('article');
  article.className = 'photo-card';
  article.setAttribute('data-reveal', '');
  article.style.setProperty('--card-image', `url('${sanitizeImage(item.image, defaultMenuItems[0].image)}')`);

  const body = document.createElement('div');
  body.className = 'card-body';

  const price = sanitizeText(item.price, 32);
  if (price) {
    const priceNode = document.createElement('span');
    priceNode.className = 'menu-price';
    priceNode.textContent = price;
    body.appendChild(priceNode);
  }

  const title = document.createElement('h3');
  title.textContent = sanitizeText(item.title, 90);

  const description = document.createElement('p');
  description.textContent = sanitizeText(item.description, 220);

  body.append(title, description);
  article.appendChild(body);
  return article;
};

const renderEvents = () => {
  if (eventTargets.length === 0) return;
  const events = getEvents();

  eventTargets.forEach((target) => {
    const mode = target.getAttribute('data-events-target') || 'events';
    const list = mode === 'home' ? events.slice(0, 3) : events;
    target.innerHTML = '';

    if (list.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'lead';
      empty.textContent = 'Henüz etkinlik eklenmedi.';
      target.appendChild(empty);
      return;
    }

    list.forEach((event) => {
      const card = createEventCard(event);
      target.appendChild(card);
      observer.observe(card);
    });
  });
};

const renderMenu = () => {
  if (menuTargets.length === 0) return;
  const items = getMenuItems();
  menuTargets.forEach((target) => {
    target.innerHTML = '';

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'lead';
      empty.textContent = 'Henüz menü öğesi eklenmedi.';
      target.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const card = createMenuCard(item);
      target.appendChild(card);
      observer.observe(card);
    });
  });
};

const ensureSubpageFloatingLogo = () => {
  if (isHomeEntryPage) return;
  if (!nav || !nav.classList.contains('entry-nav')) return;
  if (floatingHeroLogo) return;

  const logo = document.createElement('div');
  logo.className = 'hero-logo-float visible';
  logo.setAttribute('aria-hidden', 'true');
  logo.style.setProperty('--logo-progress', '1');
  logo.innerHTML = '<img src=\"assets/sniff-logo-white.png\" alt=\"\">';

  if (nav.nextSibling) {
    nav.parentNode?.insertBefore(logo, nav.nextSibling);
  } else {
    document.body.appendChild(logo);
  }

  floatingHeroLogo = logo;
};

const initAboutParallax = () => {
  if (!aboutParallaxSection) return;

  const composition = aboutParallaxSection.querySelector('.logo-composition');
  const logo = aboutParallaxSection.querySelector('.sniff-logo');
  const leftGlass = aboutParallaxSection.querySelector('.glass-left');
  const rightGlass = aboutParallaxSection.querySelector('.glass-right');
  const impact = aboutParallaxSection.querySelector('.impact');
  const flash = aboutParallaxSection.querySelector('.clink-flash');
  if (!composition || !logo || !leftGlass || !rightGlass || !impact || !flash) return;

  const gsapLib = window.gsap;
  const scrollTriggerPlugin = window.ScrollTrigger;

  if (!gsapLib || !scrollTriggerPlugin) {
    leftGlass.style.opacity = '1';
    rightGlass.style.opacity = '1';
    leftGlass.style.transform = 'translateX(-50%)';
    rightGlass.style.transform = 'translateX(-50%)';
    impact.style.transform = 'translateX(-50%)';
    impact.style.opacity = '1';
    logo.style.transform = 'translateX(-50%)';
    logo.style.opacity = '1';
    flash.style.opacity = '0';
    return;
  }

  gsapLib.registerPlugin(scrollTriggerPlugin);

  let audioCtx = null;
  let canPlayClink = false;

  const unlockClinkSound = () => {
    if (canPlayClink) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      audioCtx = new AudioCtx();
      canPlayClink = true;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    } catch (_) {
      canPlayClink = false;
    }
  };

  window.addEventListener('pointerdown', unlockClinkSound, { once: true, passive: true });
  window.addEventListener('keydown', unlockClinkSound, { once: true });

  const playClinkSound = () => {
    if (!canPlayClink || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      const now = audioCtx.currentTime;
      const gain = audioCtx.createGain();
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      const createTone = (frequency, startOffset, endOffset) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, now + startOffset);
        osc.connect(gain);
        osc.start(now + startOffset);
        osc.stop(now + endOffset);
      };

      createTone(1360, 0, 0.12);
      createTone(1880, 0.012, 0.18);
    } catch (_) {
      // Ignore audio failures silently.
    }
  };

  if (prefersReducedMotion) {
    gsapLib.set(leftGlass, { x: 0, y: 0, rotation: 0 });
    gsapLib.set(rightGlass, { x: 0, y: 0, rotation: 0 });
    gsapLib.set(impact, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsapLib.set(logo, { autoAlpha: 1, y: 0, scale: 1 });
    gsapLib.set(flash, { autoAlpha: 0, scale: 1 });
    return;
  }

  const mm = gsapLib.matchMedia();
  mm.add(
    {
      mobile: '(max-width: 900px)',
      desktop: '(min-width: 901px)',
    },
    (context) => {
      const isMobile = Boolean(context.conditions?.mobile);
      const stageWidth = () => composition.getBoundingClientRect().width || window.innerWidth;
      const stageHeight = () => composition.getBoundingClientRect().height || window.innerHeight;
      const offscreenX = () => stageWidth() * (isMobile ? 0.82 : 0.74);
      const approachX = () => stageWidth() * (isMobile ? 0.038 : 0.03);
      const bounceX = () => stageWidth() * (isMobile ? 0.022 : 0.016);
      const bounceLift = () => stageHeight() * (isMobile ? 0.012 : 0.01);

      gsapLib.set(leftGlass, {
        x: () => -offscreenX(),
        y: () => stageHeight() * 0.024,
        rotation: -7,
        transformOrigin: '88% 84%',
      });
      gsapLib.set(rightGlass, {
        x: () => offscreenX(),
        y: () => stageHeight() * 0.024,
        rotation: 7,
        transformOrigin: '12% 84%',
      });
      gsapLib.set(impact, {
        autoAlpha: 0,
        x: 0,
        y: 20,
        scale: 0.86,
        transformOrigin: '50% 100%',
      });
      gsapLib.set(logo, {
        autoAlpha: 0,
        y: 92,
        scale: 0.94,
        transformOrigin: '50% 50%',
      });
      gsapLib.set(flash, {
        autoAlpha: 0,
        scale: 0.7,
        transformOrigin: '50% 50%',
      });

      let previousProgress = 0;
      let clinkArmed = true;

      const timeline = gsapLib.timeline({
        defaults: { ease: 'power3.out', overwrite: 'auto' },
        scrollTrigger: {
          trigger: aboutParallaxSection,
          start: 'top top',
          end: '+=175%',
          scrub: 1.05,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress >= 0.5 && previousProgress < 0.5 && clinkArmed) {
              playClinkSound();
              clinkArmed = false;
            }
            if (progress <= 0.34) {
              clinkArmed = true;
            }
            previousProgress = progress;
          },
        },
      });

      // Phase 1: glasses enter from off-screen and approach center.
      timeline
        .to(
          leftGlass,
          { x: () => approachX(), y: 0, rotation: -1.2, duration: 0.46, ease: 'power3.out' },
          0
        )
        .to(
          rightGlass,
          { x: () => -approachX(), y: 0, rotation: 1.2, duration: 0.46, ease: 'power3.out' },
          0
        );

      // Phase 2: clink moment with a tiny bounce.
      timeline
        .to(
          leftGlass,
          { x: () => bounceX(), y: () => -bounceLift(), rotation: -0.2, duration: 0.09, ease: 'power2.out' },
          0.5
        )
        .to(
          rightGlass,
          { x: () => -bounceX(), y: () => -bounceLift(), rotation: 0.2, duration: 0.09, ease: 'power2.out' },
          0.5
        )
        .to(
          leftGlass,
          { x: 0, y: 0, rotation: 0, duration: 0.18, ease: 'power2.out' },
          0.59
        )
        .to(
          rightGlass,
          { x: 0, y: 0, rotation: 0, duration: 0.18, ease: 'power2.out' },
          0.59
        )
        .fromTo(
          flash,
          { autoAlpha: 0, scale: 0.72 },
          { autoAlpha: 0.95, scale: 1.32, duration: 0.08, ease: 'power2.out', repeat: 1, yoyo: true },
          0.56
        )

        // Phase 3: steam rises in above glasses.
        .to(
          impact,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.24,
            ease: 'power3.out',
          },
          0.64
        );

      // Phase 4: logo rises from below.
      timeline.to(
        logo,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: 'power3.out' },
        0.74
      );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    }
  );
};

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
  const delay = (index % 4) * 14;
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
    threshold: 0.06,
    rootMargin: '0px 0px -8% 0px',
  }
);

revealNodes.forEach((node) => observer.observe(node));
renderEvents();
renderMenu();
ensureSubpageFloatingLogo();
initAboutParallax();

const updateVisuals = (scrollYValue) => {
  const y = scrollYValue;
  const rawY = window.scrollY;
  const viewportCenter = window.innerHeight / 2;
  const triggerSection = navTriggerSection || cinematicHero;
  const triggerHeight = triggerSection ? triggerSection.offsetHeight || window.innerHeight : window.innerHeight;
  const transitionTravel = Math.max(window.innerHeight * 0.56, triggerHeight * 0.5);
  const entryMotionProgress = clamp((rawY - 18) / transitionTravel, 0, 1);

  if (homeEntryBody) {
    homeEntryBody.classList.toggle('top-fade-active', entryMotionProgress > 0.11);
  }

  if (nav) {
    if (nav.classList.contains('entry-nav') && navTriggerSection) {
      if (isHomeEntryPage) {
        nav.style.setProperty('--entry-nav-progress', entryMotionProgress.toFixed(3));
        nav.classList.toggle('scrolled', entryMotionProgress > 0.01);
      } else {
        nav.style.setProperty('--entry-nav-progress', '1');
        nav.classList.add('scrolled');
      }
    } else {
      nav.classList.toggle('scrolled', rawY > 14);
    }
  }

  if (cinematicHero) {
    const heroTravel = Math.max(window.innerHeight * 0.86, cinematicHero.offsetHeight * 0.62);
    const progress = clamp(rawY / heroTravel, 0, 1);
    cinematicHero.style.setProperty('--entry-progress', progress.toFixed(3));
  }

  if (floatingHeroLogo) {
    if (isHomeEntryPage) {
      const logoProgress = entryMotionProgress;
      floatingHeroLogo.style.setProperty('--logo-progress', logoProgress.toFixed(3));
      floatingHeroLogo.classList.toggle('visible', logoProgress > 0.08);
    } else {
      floatingHeroLogo.style.setProperty('--logo-progress', '1');
      floatingHeroLogo.classList.add('visible');
    }
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const endpoint = form.getAttribute('data-reservation-endpoint') || 'api/reservation.php';
    const note = form.querySelector('.form-note');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonLabel = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Gönderiliyor...';
    }

    if (note) {
      note.textContent = 'Rezervasyon talebiniz gönderiliyor...';
      note.style.color = '#d8c8bb';
    }

    const formData = new FormData(form);
    const record = {
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      name: sanitizeText(formData.get('reservation_name'), 90),
      phone: sanitizeText(formData.get('reservation_phone'), 40),
      guests: sanitizeText(formData.get('reservation_guests'), 30),
      date: sanitizeText(formData.get('reservation_date'), 20),
      time: sanitizeText(formData.get('reservation_time'), 10),
      notes: sanitizeText(formData.get('reservation_notes'), 260),
      consent: Boolean(formData.get('reservation_consent')),
      website: sanitizeText(formData.get('website'), 120),
    };

    try {
      await submitReservationToEndpoint(endpoint, record);
      persistReservation(record);

      if (note) {
        note.textContent = 'Rezervasyon talebiniz alındı. Ekibimiz kısa süre içinde sizinle iletişime geçecektir.';
        note.style.color = '#e6b6a8';
      }
      form.reset();
    } catch (_) {
      persistReservation(record);
      if (note) {
        note.textContent = 'Sunucuya bağlanırken sorun oluştu. Talep yerel olarak kaydedildi; lütfen telefonla da teyit edin.';
        note.style.color = '#f1b6a9';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel || 'Hemen Rezervasyon Yap';
      }
    }
  });
});

window.addEventListener('storage', (event) => {
  if (event.key === eventsStorageKey || event.key === eventsSyncKey) {
    renderEvents();
  }
  if (event.key === menuStorageKey) {
    renderMenu();
  }
});

eventsChannel?.addEventListener('message', (event) => {
  if (event?.data?.type === 'events-updated') {
    renderEvents();
  }
  if (event?.data?.type === 'menu-updated') {
    renderMenu();
  }
});

const saveCookiePreference = (value) => {
  try {
    localStorage.setItem(cookiePreferenceKey, value);
  } catch (_) {
    // No-op when localStorage is unavailable.
  }
};

const getCookiePreference = () => {
  try {
    return localStorage.getItem(cookiePreferenceKey);
  } catch (_) {
    return null;
  }
};

const mountCookieBanner = () => {
  if (getCookiePreference()) return;

  const banner = document.createElement('aside');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <div class=\"cookie-banner-inner\">
      <p>Bu site, rezervasyon deneyimi ve temel tercihleriniz için çerezler kullanır. Detaylar için <a href=\"cerez-politikasi.html\">Çerez Politikası</a> ve <a href=\"gizlilik-politikasi.html\">Gizlilik Politikası</a> sayfalarını inceleyin.</p>
      <div class=\"cookie-actions\">
        <button type=\"button\" class=\"cookie-btn accept\" data-cookie-choice=\"accept\">Kabul Et</button>
        <button type=\"button\" class=\"cookie-btn\" data-cookie-choice=\"reject\">Reddet</button>
      </div>
    </div>
  `;

  banner.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const choice = target.getAttribute('data-cookie-choice');
    if (!choice) return;
    saveCookiePreference(choice);
    banner.remove();
  });

  document.body.appendChild(banner);
};

window.addEventListener('pageshow', () => {
  reservationForms.forEach((form) => {
    clearReservationForm(form);
  });
  renderEvents();
  renderMenu();
  queueAnimation();
});

window.addEventListener('focus', () => {
  renderEvents();
  renderMenu();
});

queueAnimation();
mountCookieBanner();
