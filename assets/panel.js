const authStorageKey = 'sniff_admin_auth_v1';
const reservationStorageKey = 'sniff_reservations_v1';
const eventsStorageKey = 'sniff_events_v1';
const menuStorageKey = 'sniff_menu_items_v1';
const eventsSyncKey = 'sniff_events_sync_v1';
const eventsChannelKey = 'sniff_events_channel_v1';
const adminUsername = 'admin';
const adminPassword = 'Sniff34.';
const maxInlineImageChars = 1600000;
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
    price: '',
  },
  {
    id: 'menu_midnight_citrus',
    category: 'kokteyller',
    title: 'Midnight Citrus',
    description: 'Yuzu, bergamot köpük ve canlı limon yağları.',
    image: 'https://images.unsplash.com/photo-1671741967944-cb60915f5823?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_golden_bloom',
    category: 'kokteyller',
    title: 'Golden Bloom',
    description: 'Reposado tekila, safran ve passionfruit dengesi.',
    image: 'https://images.unsplash.com/photo-1745052811236-a56a0f8718d1?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_smoked_garden',
    category: 'kokteyller',
    title: 'Smoked Garden',
    description: 'Mezcal, taze fesleğen, salatalık ve aromatik is.',
    image: 'https://images.unsplash.com/photo-1761388545625-b233a6f35628?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_ruby_boulevard',
    category: 'kokteyller',
    title: 'Ruby Boulevard',
    description: 'Bourbon, kiraz reduksiyonu ve baharatlı bitiş.',
    image: 'https://images.unsplash.com/photo-1690021416125-56f8464a8b01?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_neon_spritz',
    category: 'soguk-icecekler',
    title: 'Neon Spritz',
    description: 'Mürver çiçeği, prosecco ve narenciye sisi.',
    image: 'https://images.unsplash.com/photo-1690021416431-d10365a06a3d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_saffron_sour',
    category: 'kokteyller',
    title: 'Saffron Sour',
    description: 'Safran şurubu, beyaz şeftali ve ipeksi doku.',
    image: 'https://images.unsplash.com/photo-1632558608598-f90ec7b026dd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_after_dark_martini',
    category: 'kokteyller',
    title: 'After Dark Martini',
    description: 'Espresso likörü, vanilya is dokusu ve kakao.',
    image: 'https://images.unsplash.com/photo-1745060829956-dcd14b3511cb?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_truf_patates',
    category: 'yiyecekler',
    title: 'Trüf Patates',
    description: 'Parmesan, trüf yağı ve sarımsak aioli ile servis edilir.',
    image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_mini_slider',
    category: 'yiyecekler',
    title: 'Mini Slider',
    description: 'Karamelize soğan, cheddar ve özel Sniff sosu.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_ev_limonata',
    category: 'soft-icecekler',
    title: 'Ev Yapımı Limonata',
    description: 'Taze limon, nane ve hafif zencefil dokunuşu.',
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
  {
    id: 'menu_zencefilli_soda',
    category: 'soft-icecekler',
    title: 'Zencefilli Soda',
    description: 'Soğuk soda, lime ve aromatik zencefil şurubu.',
    image: 'https://images.unsplash.com/photo-1571073175840-9d0904c9843a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400',
    price: '',
  },
];

const menuCategories = [
  { key: 'kokteyller', label: 'Kokteyller' },
  { key: 'yiyecekler', label: 'Yiyecekler' },
  { key: 'soguk-icecekler', label: 'Soğuk İçecekler' },
  { key: 'soft-icecekler', label: 'Soft İçecekler' },
];

const menuCategoryByKey = new Map(menuCategories.map((category) => [category.key, category]));

const loginSection = document.querySelector('[data-panel-login]');
const dashboardSection = document.querySelector('[data-panel-dashboard]');
const logoutButton = document.querySelector('[data-panel-logout]');
const loginForm = document.querySelector('#panel-login-form');
const loginNote = document.querySelector('[data-login-note]');
const reservationBody = document.querySelector('[data-reservations-body]');
const eventsBody = document.querySelector('[data-events-body]');
const clearReservationsButton = document.querySelector('[data-clear-reservations]');
const eventForm = document.querySelector('#event-form');
const resetEventFormButton = document.querySelector('[data-reset-event-form]');
const eventNote = document.querySelector('[data-event-note]');
const menuForm = document.querySelector('#menu-form');
const resetMenuFormButton = document.querySelector('[data-reset-menu-form]');
const menuNote = document.querySelector('[data-menu-note]');
const menuBody = document.querySelector('[data-menu-items-body]');
const reservationCountNode = document.querySelector('[data-stat-reservations]');
const eventCountNode = document.querySelector('[data-stat-events]');
const menuCountNode = document.querySelector('[data-stat-menu-items]');
const imageModal = document.querySelector('[data-image-modal]');
const imageModalImage = document.querySelector('[data-image-modal-img]');

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
  const cleaned = sanitizeText(value, 40).toLocaleLowerCase('tr-TR');
  if (!cleaned) return 'kokteyller';
  if (menuCategoryByKey.has(cleaned)) return cleaned;
  const matched = menuCategories.find((category) => category.label.toLocaleLowerCase('tr-TR') === cleaned);
  return matched ? matched.key : 'kokteyller';
};

const getMenuCategoryLabel = (value) => {
  const key = normalizeMenuCategory(value);
  return menuCategoryByKey.get(key)?.label || menuCategories[0].label;
};

const sanitizeImage = (value, fallbackImage = defaultEvents[0].image) => {
  const cleaned = String(value || '').trim().replace(/["'<>`]/g, '');
  return cleaned || fallbackImage;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Görsel okunamadı.'));
    reader.readAsDataURL(file);
  });

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Görsel işlenemedi.'));
    image.src = src;
  });

const optimizeImageFile = async (file) => {
  if (!file) return '';
  if (!String(file.type || '').startsWith('image/')) {
    throw new Error('Lütfen geçerli bir görsel dosyası seçin.');
  }

  const rawDataUrl = await readFileAsDataUrl(file);
  const image = await loadImageElement(rawDataUrl);

  const maxSize = 1500;
  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return rawDataUrl;
  context.drawImage(image, 0, 0, width, height);

  const optimized = canvas.toDataURL('image/webp', 0.8);
  const output = optimized || rawDataUrl;

  if (output.length > maxInlineImageChars) {
    throw new Error('Görsel çok büyük. Lütfen daha küçük bir dosya yükleyin.');
  }

  return output;
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

const getReservations = () =>
  readStorageArray(reservationStorageKey).filter((item) => item && typeof item === 'object' && sanitizeText(item.id, 80));

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
    image: sanitizeImage(event.image, defaultEvents[0].image),
  };
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
    price: normalizePrice(item.price),
    image: sanitizeImage(item.image, defaultMenuItems[0].image),
  };
};

const getEvents = () => {
  const normalized = readStorageArray(eventsStorageKey)
    .map((event, index) => normalizeEvent(event, index))
    .filter(Boolean);

  if (normalized.length > 0) return normalized;

  writeStorageArray(eventsStorageKey, defaultEvents);
  return [...defaultEvents];
};

const getMenuItems = () => {
  const normalized = readStorageArray(menuStorageKey)
    .map((item, index) => normalizeMenuItem(item, index))
    .filter(Boolean);

  if (normalized.length > 0) return normalized;

  writeStorageArray(menuStorageKey, defaultMenuItems);
  return [...defaultMenuItems];
};

const setEvents = (events) => {
  const saved = writeStorageArray(eventsStorageKey, events);
  if (!saved) return false;
  try {
    localStorage.setItem(eventsSyncKey, String(Date.now()));
  } catch (_) {
    // ignore storage sync marker failures
  }
  eventsChannel?.postMessage({ type: 'events-updated', at: Date.now() });
  return true;
};

const setMenuItems = (items) => {
  const saved = writeStorageArray(menuStorageKey, items);
  if (!saved) return false;
  eventsChannel?.postMessage({ type: 'menu-updated', at: Date.now() });
  return true;
};

const setAuth = (isAuthorized) => {
  if (isAuthorized) {
    sessionStorage.setItem(authStorageKey, '1');
  } else {
    sessionStorage.removeItem(authStorageKey);
  }
};

const isAuthorized = () => sessionStorage.getItem(authStorageKey) === '1';

const formatDateTime = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const renderStats = () => {
  reservationCountNode.textContent = String(getReservations().length);
  eventCountNode.textContent = String(getEvents().length);
  if (menuCountNode) {
    menuCountNode.textContent = String(getMenuItems().length);
  }
};

const renderReservations = () => {
  const reservations = getReservations();
  reservationBody.innerHTML = '';

  if (reservations.length === 0) {
    reservationBody.innerHTML = '<tr><td colspan="8">Henüz rezervasyon kaydı yok.</td></tr>';
    return;
  }

  reservations.forEach((reservation) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDateTime(reservation.createdAt)}</td>
      <td>${sanitizeText(reservation.name, 90) || '-'}</td>
      <td>${sanitizeText(reservation.phone, 40) || '-'}</td>
      <td>${sanitizeText(reservation.guests, 30) || '-'}</td>
      <td>${sanitizeText(reservation.date, 20) || '-'}</td>
      <td>${sanitizeText(reservation.time, 12) || '-'}</td>
      <td>${sanitizeText(reservation.notes, 120) || '-'}</td>
      <td><button type="button" class="btn btn-ghost admin-inline-btn" data-delete-reservation="${sanitizeText(reservation.id, 80)}">Sil</button></td>
    `;
    reservationBody.appendChild(row);
  });
};

const fillEventForm = (event) => {
  eventForm.elements.event_id.value = event.id;
  eventForm.elements.meta.value = event.meta;
  eventForm.elements.title.value = event.title;
  eventForm.elements.description.value = event.description;
  eventForm.elements.image.value = event.image;
  eventNote.textContent = 'Etkinlik düzenleme modunda. Değiştirip Kaydet butonuna basın.';
};

const resetEventForm = () => {
  eventForm.reset();
  eventForm.elements.event_id.value = '';
  eventNote.textContent = '';
};

const getEventImageFromForm = async () => {
  const uploadedFile = eventForm.elements.image_file?.files?.[0] || null;
  if (uploadedFile) {
    return optimizeImageFile(uploadedFile);
  }

  const urlValue = sanitizeImage(eventForm.elements.image.value, defaultEvents[0].image);
  if (urlValue) return urlValue;
  return defaultEvents[0].image;
};

const fillMenuForm = (item) => {
  menuForm.elements.menu_item_id.value = item.id;
  menuForm.elements.title.value = item.title;
  menuForm.elements.category.value = normalizeMenuCategory(item.category);
  menuForm.elements.price.value = item.price || '';
  menuForm.elements.description.value = item.description;
  menuForm.elements.image.value = item.image;
  menuNote.textContent = 'Menü öğesi düzenleme modunda. Değiştirip Kaydet butonuna basın.';
};

const resetMenuForm = () => {
  menuForm.reset();
  menuForm.elements.menu_item_id.value = '';
  menuForm.elements.category.value = 'kokteyller';
  menuNote.textContent = '';
};

const getMenuImageFromForm = async () => {
  const uploadedFile = menuForm.elements.image_file?.files?.[0] || null;
  if (uploadedFile) {
    return optimizeImageFile(uploadedFile);
  }

  const urlValue = sanitizeImage(menuForm.elements.image.value, defaultMenuItems[0].image);
  if (urlValue) return urlValue;
  return defaultMenuItems[0].image;
};

const openImageModal = (src) => {
  if (!imageModal || !imageModalImage) return;
  imageModalImage.src = sanitizeImage(src, defaultEvents[0].image);
  imageModal.hidden = false;
  document.body.classList.add('admin-modal-open');
};

const closeImageModal = () => {
  if (!imageModal || !imageModalImage) return;
  imageModal.hidden = true;
  imageModalImage.removeAttribute('src');
  document.body.classList.remove('admin-modal-open');
};

const renderEvents = () => {
  const events = getEvents();
  eventsBody.innerHTML = '';

  if (events.length === 0) {
    eventsBody.innerHTML = '<tr><td colspan="5">Henüz etkinlik yok.</td></tr>';
    return;
  }

  events.forEach((event) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sanitizeText(event.meta, 70)}</td>
      <td>${sanitizeText(event.title, 90)}</td>
      <td>${sanitizeText(event.description, 120)}</td>
      <td><button type="button" class="btn btn-ghost admin-inline-btn" data-open-image="${sanitizeImage(event.image, defaultEvents[0].image)}">Görseli Aç</button></td>
      <td>
        <button type="button" class="btn btn-ghost admin-inline-btn" data-edit-event="${sanitizeText(event.id, 64)}">Düzenle</button>
        <button type="button" class="btn btn-ghost admin-inline-btn" data-delete-event="${sanitizeText(event.id, 64)}">Sil</button>
      </td>
    `;
    eventsBody.appendChild(row);
  });
};

const renderMenuItems = () => {
  const items = getMenuItems();
  menuBody.innerHTML = '';

  if (items.length === 0) {
    menuBody.innerHTML = '<tr><td colspan="6">Henüz menü öğesi yok.</td></tr>';
    return;
  }

  items.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sanitizeText(item.title, 90)}</td>
      <td>${getMenuCategoryLabel(item.category)}</td>
      <td>${sanitizeText(item.price, 32) || '-'}</td>
      <td>${sanitizeText(item.description, 120)}</td>
      <td><button type="button" class="btn btn-ghost admin-inline-btn" data-open-image="${sanitizeImage(item.image, defaultMenuItems[0].image)}">Görseli Aç</button></td>
      <td>
        <button type="button" class="btn btn-ghost admin-inline-btn" data-edit-menu-item="${sanitizeText(item.id, 64)}">Düzenle</button>
        <button type="button" class="btn btn-ghost admin-inline-btn" data-delete-menu-item="${sanitizeText(item.id, 64)}">Sil</button>
      </td>
    `;
    menuBody.appendChild(row);
  });
};

const refreshDashboard = () => {
  renderReservations();
  renderEvents();
  renderMenuItems();
  renderStats();
};

const setPanelView = (authorized) => {
  loginSection.hidden = authorized;
  dashboardSection.hidden = !authorized;
  logoutButton.hidden = !authorized;
  if (authorized) {
    refreshDashboard();
  }
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = sanitizeText(loginForm.elements.username.value, 40);
  const password = String(loginForm.elements.password.value || '');

  if (username === adminUsername && password === adminPassword) {
    setAuth(true);
    loginForm.reset();
    loginNote.textContent = '';
    setPanelView(true);
    return;
  }

  loginNote.textContent = 'Kullanıcı adı veya şifre hatalı.';
});

logoutButton.addEventListener('click', () => {
  setAuth(false);
  setPanelView(false);
  resetEventForm();
  resetMenuForm();
});

clearReservationsButton.addEventListener('click', () => {
  if (!confirm('Tüm rezervasyonları silmek istediğinize emin misiniz?')) return;
  writeStorageArray(reservationStorageKey, []);
  refreshDashboard();
});

reservationBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const reservationId = target.getAttribute('data-delete-reservation');
  if (!reservationId) return;

  const filtered = getReservations().filter((reservation) => sanitizeText(reservation.id, 80) !== reservationId);
  writeStorageArray(reservationStorageKey, filtered);
  refreshDashboard();
});

eventForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!eventForm.reportValidity()) return;

  let imageSource = defaultEvents[0].image;
  try {
    imageSource = await getEventImageFromForm();
  } catch (error) {
    eventNote.textContent = error instanceof Error ? error.message : 'Görsel yüklenemedi.';
    return;
  }

  const eventId = sanitizeText(eventForm.elements.event_id.value, 64);
  const newEvent = {
    id: eventId || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    meta: sanitizeText(eventForm.elements.meta.value, 70),
    title: sanitizeText(eventForm.elements.title.value, 90),
    description: sanitizeText(eventForm.elements.description.value, 220),
    image: imageSource,
  };

  const events = getEvents();
  const index = events.findIndex((item) => item.id === newEvent.id);

  if (index >= 0) {
    events[index] = newEvent;
    eventNote.textContent = 'Etkinlik güncellendi.';
  } else {
    events.unshift(newEvent);
    eventNote.textContent = 'Yeni etkinlik eklendi.';
  }

  const saved = setEvents(events);
  if (!saved) {
    eventNote.textContent = 'Etkinlik kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.';
    return;
  }
  resetEventForm();
  refreshDashboard();
});

menuForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!menuForm.reportValidity()) return;

  let imageSource = defaultMenuItems[0].image;
  try {
    imageSource = await getMenuImageFromForm();
  } catch (error) {
    menuNote.textContent = error instanceof Error ? error.message : 'Görsel yüklenemedi.';
    return;
  }

  const itemId = sanitizeText(menuForm.elements.menu_item_id.value, 64);
  const newItem = {
    id: itemId || `menu_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: sanitizeText(menuForm.elements.title.value, 90),
    category: normalizeMenuCategory(menuForm.elements.category.value),
    price: normalizePrice(menuForm.elements.price.value),
    description: sanitizeText(menuForm.elements.description.value, 220),
    image: imageSource,
  };

  const items = getMenuItems();
  const index = items.findIndex((item) => item.id === newItem.id);

  if (index >= 0) {
    items[index] = newItem;
    menuNote.textContent = 'Menü öğesi güncellendi.';
  } else {
    items.unshift(newItem);
    menuNote.textContent = 'Yeni menü öğesi eklendi.';
  }

  const saved = setMenuItems(items);
  if (!saved) {
    menuNote.textContent = 'Menü öğesi kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.';
    return;
  }
  resetMenuForm();
  refreshDashboard();
});

resetEventFormButton.addEventListener('click', () => {
  resetEventForm();
});

resetMenuFormButton.addEventListener('click', () => {
  resetMenuForm();
});

eventsBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const openImageButton = target.closest('[data-open-image]');
  if (openImageButton instanceof HTMLElement) {
    const imageSrc = openImageButton.getAttribute('data-open-image');
    if (imageSrc) openImageModal(imageSrc);
    return;
  }

  const editButton = target.closest('[data-edit-event]');
  const editId = editButton instanceof HTMLElement ? editButton.getAttribute('data-edit-event') : null;
  if (editId) {
    const eventItem = getEvents().find((item) => item.id === editId);
    if (eventItem) fillEventForm(eventItem);
    return;
  }

  const deleteButton = target.closest('[data-delete-event]');
  const deleteId = deleteButton instanceof HTMLElement ? deleteButton.getAttribute('data-delete-event') : null;
  if (!deleteId) return;
  const remaining = getEvents().filter((item) => item.id !== deleteId);
  const saved = setEvents(remaining);
  if (!saved) {
    eventNote.textContent = 'Etkinlik silinemedi. Tarayıcı depolama alanı dolu olabilir.';
    return;
  }
  resetEventForm();
  refreshDashboard();
});

menuBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const openImageButton = target.closest('[data-open-image]');
  if (openImageButton instanceof HTMLElement) {
    const imageSrc = openImageButton.getAttribute('data-open-image');
    if (imageSrc) openImageModal(imageSrc);
    return;
  }

  const editButton = target.closest('[data-edit-menu-item]');
  const editId = editButton instanceof HTMLElement ? editButton.getAttribute('data-edit-menu-item') : null;
  if (editId) {
    const item = getMenuItems().find((menuItem) => menuItem.id === editId);
    if (item) fillMenuForm(item);
    return;
  }

  const deleteButton = target.closest('[data-delete-menu-item]');
  const deleteId = deleteButton instanceof HTMLElement ? deleteButton.getAttribute('data-delete-menu-item') : null;
  if (!deleteId) return;

  const remaining = getMenuItems().filter((item) => item.id !== deleteId);
  const saved = setMenuItems(remaining);
  if (!saved) {
    menuNote.textContent = 'Menü öğesi silinemedi. Tarayıcı depolama alanı dolu olabilir.';
    return;
  }
  resetMenuForm();
  refreshDashboard();
});

eventsChannel?.addEventListener('message', (event) => {
  if (event?.data?.type === 'events-updated') {
    refreshDashboard();
  }
  if (event?.data?.type === 'menu-updated') {
    refreshDashboard();
  }
});

imageModal?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.hasAttribute('data-image-modal-close')) {
    closeImageModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && imageModal && !imageModal.hidden) {
    closeImageModal();
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === reservationStorageKey || event.key === eventsStorageKey || event.key === menuStorageKey) {
    refreshDashboard();
  }
});

setPanelView(isAuthorized());
