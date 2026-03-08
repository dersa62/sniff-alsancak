const authStorageKey = 'sniff_admin_auth_v1';
const reservationStorageKey = 'sniff_reservations_v1';
const eventsStorageKey = 'sniff_events_v1';
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
const reservationCountNode = document.querySelector('[data-stat-reservations]');
const eventCountNode = document.querySelector('[data-stat-events]');
const imageModal = document.querySelector('[data-image-modal]');
const imageModalImage = document.querySelector('[data-image-modal-img]');

const sanitizeText = (value, maxLength = 220) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);

const sanitizeImage = (value) => {
  const cleaned = String(value || '').trim().replace(/["'<>`]/g, '');
  return cleaned || defaultEvents[0].image;
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
    image: sanitizeImage(event.image),
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

  const urlValue = sanitizeImage(eventForm.elements.image.value);
  if (urlValue) return urlValue;
  return defaultEvents[0].image;
};

const openImageModal = (src) => {
  if (!imageModal || !imageModalImage) return;
  imageModalImage.src = sanitizeImage(src);
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
      <td><button type="button" class="btn btn-ghost admin-inline-btn" data-open-image="${sanitizeImage(event.image)}">Görseli Aç</button></td>
      <td>
        <button type="button" class="btn btn-ghost admin-inline-btn" data-edit-event="${sanitizeText(event.id, 64)}">Düzenle</button>
        <button type="button" class="btn btn-ghost admin-inline-btn" data-delete-event="${sanitizeText(event.id, 64)}">Sil</button>
      </td>
    `;
    eventsBody.appendChild(row);
  });
};

const refreshDashboard = () => {
  renderReservations();
  renderEvents();
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

resetEventFormButton.addEventListener('click', () => {
  resetEventForm();
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

eventsChannel?.addEventListener('message', (event) => {
  if (event?.data?.type === 'events-updated') {
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
  if (event.key === reservationStorageKey || event.key === eventsStorageKey) {
    refreshDashboard();
  }
});

setPanelView(isAuthorized());
