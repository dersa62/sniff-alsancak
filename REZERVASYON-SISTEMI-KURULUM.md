# Rezervasyon Sistemi Kurulumu (3. parti yok)

Bu projede rezervasyon formu artik dogrudan kendi sunucundaki `api/reservation.php` endpoint'ine gider.

## 1) Gereksinim

- PHP calistiran bir hosting (cPanel, VPS, Plesk vb.)
- `mail()` fonksiyonunun aktif oldugu bir sunucu (ya da SMTP relay tanimli bir hosting)

Not: Sadece GitHub Pages ile bu sistem calismaz. GitHub Pages statiktir, `PHP` calistirmaz.

## 2) Konfigurasyon

Dosya: `api/config.php`

Asagidaki alanlari kendine gore duzenle:

- `notify_email`: Rezervasyon bildiriminin gidecegi e-posta
- `from_email`: Sunucuda tanimli gonderici e-posta
- `from_name`: Gonderici ad
- `webhook_url`: (Opsiyonel) Kendi panel/API endpoint'in
- `webhook_secret`: (Opsiyonel) webhook imza anahtari

## 3) Form akis

Form dosyasi: `reservation.html`

Form artik:
- `data-reservation-endpoint="api/reservation.php"` ile API'ye gider
- Basarili olursa hem sunucuya kaydeder hem de UI'da onay mesaji verir
- Sunucu hatasinda yerel yedek kayit yapar

## 4) Sunucu tarafinda ne oluyor?

Dosya: `api/reservation.php`

- POST JSON alir
- Alanlari dogrular
- Spam honeypot (`website`) kontrolu yapar
- Kaydi `data/reservations.jsonl` dosyasina yazar
- `mail()` ile otomatik bildirim e-postasi gonderir
- Opsiyonel olarak `webhook_url` varsa kendi sistemine JSON yollar

## 5) Test

```bash
curl -sS -X POST http://127.0.0.1:8080/api/reservation.php \
  -H 'Content-Type: application/json' \
  --data '{"name":"Test","phone":"+905551112233","guests":"3-4 Kişi","date":"2026-03-10","time":"21:00","notes":"test","consent":true,"website":""}'
```

Beklenen cevap:

```json
{"ok":true,"id":"...","stored":true,"mailSent":true,"webhookSent":false}
```

## 6) Guvenlik notu

- `data/.htaccess` eklendi (Apache'de storage klasorunu dis erisime kapatir)
- `data/.gitignore` eklendi (kayit dosyalari git'e girmez)

