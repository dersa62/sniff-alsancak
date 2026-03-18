# Rezervasyon Sistemi Kurulumu (mailto)

Bu projede rezervasyon formu artik `mailto:` ile varsayilan e-posta uygulamasini acar ve talep metnini otomatik doldurur.

## 1) Gereksinim

- Statik hosting yeterlidir (cPanel, VPS, GitHub Pages vb.)
- Kullanicinin cihazinda varsayilan bir e-posta uygulamasi tanimli olmalidir.

Not: `api/reservation.php` dosyasi istenirse sadece kayit/webhook icin kullanilabilir; form akisi icin zorunlu degildir.

## 2) Konfigurasyon

Dosya: `assets/script.js`

Asagidaki alanlari kendine gore duzenle:

- `reservationMailRecipient`: Rezervasyon talebinin gidecegi adres

## 3) Form akis

Form dosyasi: `reservation.html`

Form artik:
- form alanlarini toplar
- e-posta basligi ve govdesini satir satir olusturur
- `mailto:` ile varsayilan e-posta uygulamasini acar

## 4) Sunucu tarafinda ne oluyor?

Dosya: `api/reservation.php`

- (Opsiyonel) POST JSON alir
- Alanlari dogrular
- Spam honeypot (`website`) kontrolu yapar
- Kaydi `data/reservations.jsonl` dosyasina yazar
- Opsiyonel olarak `webhook_url` varsa kendi sistemine JSON yollar

## 5) Test

```bash
curl -sS -X POST http://127.0.0.1:8080/api/reservation.php \
  -H 'Content-Type: application/json' \
  --data '{"name":"Test","phone":"+905551112233","guests":"3-4 Kişi","date":"2026-03-10","time":"21:00","notes":"test","consent":true,"website":""}'
```

Beklenen cevap:

```json
{"ok":true,"id":"...","stored":true,"webhookSent":false}
```

## 6) Guvenlik notu

- `data/.htaccess` eklendi (Apache'de storage klasorunu dis erisime kapatir)
- `data/.gitignore` eklendi (kayit dosyalari git'e girmez)
