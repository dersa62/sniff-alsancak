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
const menuCategoriesStorageKey = 'sniff_menu_categories_v1';
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
    category: 'kokteyller',
    title: 'Velvet Negroni',
    description: 'Barrel gin, kırmızı bitter, vermut ve kakao-narenciye parfümü.',
    image: 'https://images.unsplash.com/photo-1749314374163-185677265d63?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺480',
  },
  {
    id: 'menu_midnight_citrus',
    category: 'kokteyller',
    title: 'Midnight Citrus',
    description: 'Yuzu, bergamot köpük ve canlı limon yağları.',
    image: 'https://images.unsplash.com/photo-1671741967944-cb60915f5823?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺470',
  },
  {
    id: 'menu_golden_bloom',
    category: 'kokteyller',
    title: 'Golden Bloom',
    description: 'Reposado tekila, safran ve passionfruit dengesi.',
    image: 'https://images.unsplash.com/photo-1745052811236-a56a0f8718d1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺490',
  },
  {
    id: 'menu_smoked_garden',
    category: 'kokteyller',
    title: 'Smoked Garden',
    description: 'Mezcal, taze fesleğen, salatalık ve aromatik is.',
    image: 'https://images.unsplash.com/photo-1761388545625-b233a6f35628?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺500',
  },
  {
    id: 'menu_ruby_boulevard',
    category: 'kokteyller',
    title: 'Ruby Boulevard',
    description: 'Bourbon, kiraz reduksiyonu ve baharatlı bitiş.',
    image: 'https://images.unsplash.com/photo-1690021416125-56f8464a8b01?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺520',
  },
  {
    id: 'menu_neon_spritz',
    category: 'soguk-icecekler',
    title: 'Neon Spritz',
    description: 'Mürver çiçeği, prosecco ve narenciye sisi.',
    image: 'https://images.unsplash.com/photo-1690021416431-d10365a06a3d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺430',
  },
  {
    id: 'menu_saffron_sour',
    category: 'kokteyller',
    title: 'Saffron Sour',
    description: 'Safran şurubu, beyaz şeftali ve ipeksi doku.',
    image: 'https://images.unsplash.com/photo-1632558608598-f90ec7b026dd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺460',
  },
  {
    id: 'menu_after_dark_martini',
    category: 'kokteyller',
    title: 'After Dark Martini',
    description: 'Espresso likörü, vanilya is dokusu ve kakao.',
    image: 'https://images.unsplash.com/photo-1745060829956-dcd14b3511cb?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺510',
  },
  {
    id: 'menu_truf_patates',
    category: 'yiyecekler',
    title: 'Trüf Patates',
    description: 'Parmesan, trüf yağı ve sarımsak aioli ile servis edilir.',
    image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺320',
  },
  {
    id: 'menu_mini_slider',
    category: 'yiyecekler',
    title: 'Mini Slider',
    description: 'Karamelize soğan, cheddar ve özel Sniff sosu.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺360',
  },
  {
    id: 'menu_ev_limonata',
    category: 'soft-icecekler',
    title: 'Ev Yapımı Limonata',
    description: 'Taze limon, nane ve hafif zencefil dokunuşu.',
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺150',
  },
  {
    id: 'menu_zencefilli_soda',
    category: 'soft-icecekler',
    title: 'Zencefilli Soda',
    description: 'Soğuk soda, lime ve aromatik zencefil şurubu.',
    image: 'https://images.unsplash.com/photo-1571073175840-9d0904c9843a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '₺160',
  },
];

const defaultMenuCategories = [
  { key: 'kokteyller', label: 'Kokteyller', visible: true },
  { key: 'yiyecekler', label: 'Yiyecekler', visible: true },
  { key: 'soguk-icecekler', label: 'Soğuk İçecekler', visible: true },
  { key: 'soft-icecekler', label: 'Soft İçecekler', visible: true },
];

const defaultMenuPriceById = new Map(defaultMenuItems.map((item) => [item.id, item.price]));

const cinematicGroups = Array.from(cinematicParallaxContainers).map((container) => ({
  container,
  layers: Array.from(container.querySelectorAll('.parallax-layer')).map((layer) => ({
    el: layer,
    ratio: Number(layer.getAttribute('data-ratio') || 0.5),
  })),
}));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const sanitizeText = (value, maxLength = 220) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);

const normalizePrice = (value) => {
  const cleaned = sanitizeText(value, 32);
  if (!cleaned) return '';
  if (/₺|(?:^|\s)(TL|TRY)(?:\s|$)/i.test(cleaned)) return cleaned;
  const compact = cleaned.replace(/\s+/g, '');
  if (/^\d+([.,]\d{1,2})?$/.test(compact)) {
    return `₺${compact}`;
  }
  return `₺${cleaned}`;
};

const normalizeMenuCategory = (value) => {
  const categories = getMenuCategories();
  const fallbackKey = categories[0]?.key || defaultMenuCategories[0].key;
  const cleaned = sanitizeText(value, 40).toLocaleLowerCase('tr-TR');
  if (!cleaned) return fallbackKey;

  const categoryMap = new Map(categories.map((category) => [category.key, category]));
  if (categoryMap.has(cleaned)) return cleaned;

  const matched = categories.find((category) => category.label.toLocaleLowerCase('tr-TR') === cleaned);
  return matched ? matched.key : fallbackKey;
};

const getMenuCategoryLabel = (value) => {
  const categories = getMenuCategories();
  const fallbackLabel = categories[0]?.label || defaultMenuCategories[0].label;
  const key = normalizeMenuCategory(value);
  const categoryMap = new Map(categories.map((category) => [category.key, category]));
  return categoryMap.get(key)?.label || fallbackLabel;
};

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

const createMenuCategoryKey = (value, fallback = 'kategori') => {
  const key = String(value || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return key || fallback;
};

const normalizeMenuCategoryList = (list) => {
  const normalized = [];
  const usedKeys = new Set();
  (Array.isArray(list) ? list : []).forEach((entry, index) => {
    const label = sanitizeText(entry?.label, 40);
    if (!label) return;
    const rawKey = sanitizeText(entry?.key, 40) || label || `kategori-${index + 1}`;
    const baseKey = createMenuCategoryKey(rawKey, `kategori-${index + 1}`);
    let key = baseKey;
    let suffix = 2;
    while (usedKeys.has(key)) {
      key = `${baseKey}-${suffix++}`;
    }
    usedKeys.add(key);
    normalized.push({ key, label, visible: entry?.visible !== false });
  });
  return normalized;
};

const getMenuCategories = () => {
  const stored = normalizeMenuCategoryList(readStorageArray(menuCategoriesStorageKey));
  if (stored.length > 0) return stored;
  writeStorageArray(menuCategoriesStorageKey, defaultMenuCategories);
  return [...defaultMenuCategories];
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
    category: normalizeMenuCategory(item.category),
    title,
    description,
    image: sanitizeImage(item.image, defaultMenuItems[0].image),
    price: normalizePrice(item.price),
  };
};

const getMenuItems = () => {
  const normalized = readStorageArray(menuStorageKey)
    .map((item, index) => normalizeMenuItem(item, index))
    .filter(Boolean);
  if (normalized.length > 0) {
    const hasAnyPrice = normalized.some((item) => normalizePrice(item.price));
    if (hasAnyPrice) return normalized;

    // Backward compatibility for old records where all menu prices were empty.
    const hydrated = normalized.map((item) => {
      const fallbackPrice = defaultMenuPriceById.get(item.id) || '';
      return fallbackPrice ? { ...item, price: fallbackPrice } : item;
    });
    writeStorageArray(menuStorageKey, hydrated);
    return hydrated;
  }
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

const createMenuRow = (item) => {
  const row = document.createElement('article');
  row.className = 'menu-item-row';

  const thumb = document.createElement('img');
  thumb.className = 'menu-item-thumb';
  thumb.loading = 'lazy';
  thumb.decoding = 'async';
  thumb.src = sanitizeImage(item.image, defaultMenuItems[0].image);
  thumb.alt = `${sanitizeText(item.title, 90)} görseli`;

  const content = document.createElement('div');
  content.className = 'menu-item-content';

  const title = document.createElement('h3');
  title.className = 'menu-item-title';
  title.textContent = sanitizeText(item.title, 90);

  const description = document.createElement('p');
  description.className = 'menu-item-description';
  description.textContent = sanitizeText(item.description, 220);

  content.append(title, description);
  row.append(thumb, content);

  const price = normalizePrice(item.price);
  if (price) {
    const priceNode = document.createElement('span');
    priceNode.className = 'menu-item-price';
    priceNode.textContent = price;
    row.appendChild(priceNode);
  }

  return row;
};

const buildMenuCategories = (items) => {
  const visibleCategories = getMenuCategories().filter((category) => category.visible !== false);
  const grouped = visibleCategories.map((category) => ({ ...category, items: [] }));
  const groupedMap = new Map(grouped.map((category) => [category.key, category]));

  items.forEach((item) => {
    const key = normalizeMenuCategory(item.category);
    const group = groupedMap.get(key);
    if (group) {
      group.items.push(item);
    }
  });

  return grouped;
};

const bindMenuAccordion = (target) => {
  if (target.dataset.menuAccordionBound === '1') return;

  const setOpenCategory = (nextCategoryNode, keepOpen = true) => {
    if (!(nextCategoryNode instanceof HTMLElement)) return;
    const allCategories = target.querySelectorAll('.menu-category');
    allCategories.forEach((node) => {
      const toggleButton = node.querySelector('[data-menu-toggle]');
      const shouldOpen = node === nextCategoryNode ? keepOpen : false;
      node.classList.toggle('is-open', shouldOpen);
      if (toggleButton instanceof HTMLElement) {
        toggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      }
    });

    const activeKey = keepOpen ? nextCategoryNode.getAttribute('data-menu-key') || '' : '';
    const chips = target.querySelectorAll('[data-menu-jump]');
    chips.forEach((chip) => {
      const isActive = chip.getAttribute('data-menu-jump') === activeKey;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  target.addEventListener('click', (event) => {
    const jumpButton = event.target instanceof HTMLElement ? event.target.closest('[data-menu-jump]') : null;
    if (jumpButton instanceof HTMLButtonElement) {
      const targetKey = jumpButton.getAttribute('data-menu-jump');
      if (!targetKey) return;
      const categoryNode = target.querySelector(`.menu-category[data-menu-key="${targetKey}"]`);
      if (!(categoryNode instanceof HTMLElement)) return;
      setOpenCategory(categoryNode, true);
      categoryNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const targetButton = event.target instanceof HTMLElement ? event.target.closest('[data-menu-toggle]') : null;
    if (!(targetButton instanceof HTMLButtonElement)) return;

    const categoryNode = targetButton.closest('.menu-category');
    if (!(categoryNode instanceof HTMLElement)) return;

    const isOpen = categoryNode.classList.contains('is-open');
    setOpenCategory(categoryNode, !isOpen);
  });

  target.dataset.menuAccordionBound = '1';
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
    bindMenuAccordion(target);
    target.classList.add('menu-accordion');
    target.innerHTML = '';

    const categories = buildMenuCategories(items);
    if (categories.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'menu-accordion-empty';
      empty.textContent = 'Menü kategorileri geçici olarak gizlenmiştir.';
      target.appendChild(empty);
      return;
    }

    const categoryStrip = document.createElement('div');
    categoryStrip.className = 'menu-category-strip';
    categoryStrip.setAttribute('aria-label', 'Hızlı kategori geçişi');

    categories.forEach((category, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'menu-category-chip';
      if (index === 0) chip.classList.add('is-active');
      chip.setAttribute('data-menu-jump', category.key);
      chip.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      chip.textContent = getMenuCategoryLabel(category.key);
      categoryStrip.appendChild(chip);
    });

    target.appendChild(categoryStrip);

    categories.forEach((category, index) => {
      const categoryNode = document.createElement('article');
      categoryNode.className = 'menu-category';
      categoryNode.setAttribute('data-reveal', '');
      categoryNode.setAttribute('data-menu-key', category.key);

      const shouldOpen = index === 0;
      categoryNode.classList.toggle('is-open', shouldOpen);

      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'menu-category-toggle';
      toggleButton.setAttribute('data-menu-toggle', category.key);
      toggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');

      const coverImage = sanitizeImage(
        category.items[0]?.image || defaultMenuItems[0].image,
        defaultMenuItems[0].image
      );
      toggleButton.style.setProperty('--menu-category-cover', `url('${coverImage}')`);

      const heading = document.createElement('div');
      heading.className = 'menu-category-heading';

      const title = document.createElement('span');
      title.className = 'menu-category-title';
      title.textContent = getMenuCategoryLabel(category.key);

      const count = document.createElement('span');
      count.className = 'menu-category-count';
      count.textContent = `${category.items.length} öğe`;

      heading.append(title, count);

      const indicator = document.createElement('span');
      indicator.className = 'menu-category-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.textContent = '⌄';

      toggleButton.append(heading, indicator);

      const panel = document.createElement('div');
      panel.className = 'menu-category-panel';

      if (category.items.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'menu-category-empty';
        empty.textContent = 'Bu kategoride henüz ürün yok.';
        panel.appendChild(empty);
      } else {
        category.items.forEach((item) => {
          panel.appendChild(createMenuRow(item));
        });
      }

      categoryNode.append(toggleButton, panel);
      target.appendChild(categoryNode);
      observer.observe(categoryNode);
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
  const scrollHint = aboutParallaxSection.querySelector('.about-parallax-scroll-hint');
  if (!composition || !logo || !leftGlass || !rightGlass || !impact || !flash) return;

  // Prevent layout drift by initializing only after parallax layer assets are ready.
  if (aboutParallaxSection.dataset.parallaxAssetsReady !== '1') {
    const layerImages = [logo, leftGlass, rightGlass, impact];
    const needsLoad = layerImages.some((img) => !(img.complete && img.naturalWidth > 0));

    if (needsLoad) {
      if (aboutParallaxSection.dataset.parallaxWaiting !== '1') {
        aboutParallaxSection.dataset.parallaxWaiting = '1';
        Promise.all(
          layerImages.map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete && img.naturalWidth > 0) {
                  resolve();
                  return;
                }
                const done = () => resolve();
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
              })
          )
        ).then(() => {
          aboutParallaxSection.dataset.parallaxAssetsReady = '1';
          aboutParallaxSection.dataset.parallaxWaiting = '0';
          requestAnimationFrame(() => requestAnimationFrame(initAboutParallax));
        });
      }
      return;
    }

    aboutParallaxSection.dataset.parallaxAssetsReady = '1';
  }

  if (aboutParallaxSection.dataset.parallaxMounted === '1') return;
  aboutParallaxSection.dataset.parallaxMounted = '1';

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
    flash.style.transform = 'translateX(-50%) scale(0.72)';
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
    gsapLib.set(leftGlass, { xPercent: -50, x: 0, y: 0, rotation: 0 });
    gsapLib.set(rightGlass, { xPercent: -50, x: 0, y: 0, rotation: 0 });
    gsapLib.set(impact, { xPercent: -50, autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsapLib.set(logo, { xPercent: -50, autoAlpha: 1, y: 0, scale: 1 });
    gsapLib.set(flash, { xPercent: -50, autoAlpha: 0, scale: 1 });
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
        xPercent: -50,
        x: () => -offscreenX(),
        y: () => stageHeight() * 0.024,
        rotation: -7,
        transformOrigin: '88% 84%',
      });
      gsapLib.set(rightGlass, {
        xPercent: -50,
        x: () => offscreenX(),
        y: () => stageHeight() * 0.024,
        rotation: 7,
        transformOrigin: '12% 84%',
      });
      gsapLib.set(impact, {
        xPercent: -50,
        autoAlpha: 0,
        x: 0,
        y: 20,
        scale: 0.86,
        transformOrigin: '50% 100%',
      });
      gsapLib.set(logo, {
        xPercent: -50,
        autoAlpha: 0,
        y: 92,
        scale: 0.94,
        transformOrigin: '50% 50%',
      });
      gsapLib.set(flash, {
        xPercent: -50,
        autoAlpha: 0,
        scale: 0.7,
        transformOrigin: '50% 50%',
      });
      if (scrollHint) {
        gsapLib.set(scrollHint, { autoAlpha: 0.88, y: 0 });
      }

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
        );

      if (scrollHint) {
        timeline.to(scrollHint, { autoAlpha: 0, y: -8, duration: 0.16, ease: 'power2.out' }, 0.08);
      }

      // Phase 3: steam rises in above glasses.
      timeline.to(
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

  requestAnimationFrame(() => scrollTriggerPlugin.refresh(true));
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
  if (event.key === menuStorageKey || event.key === menuCategoriesStorageKey) {
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
  if (event?.data?.type === 'menu-categories-updated') {
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

window.addEventListener('pageshow', (event) => {
  reservationForms.forEach((form) => {
    clearReservationForm(form);
  });
  renderEvents();
  renderMenu();
  queueAnimation();

  if (aboutParallaxSection && window.ScrollTrigger) {
    requestAnimationFrame(() => window.ScrollTrigger.refresh(Boolean(event.persisted)));
  }
});

window.addEventListener('focus', () => {
  renderEvents();
  renderMenu();
});

queueAnimation();
mountCookieBanner();
