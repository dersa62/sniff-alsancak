# Sniff Alsancak - XPanel/cPanel Kurulum Notu

## 1) Yükleme
- `c-panel-ready.zip` dosyasini XPanel/cPanel `public_html` klasorune yukleyin.
- Zip'i `public_html` icinde cikartin.
- Tanimli ana dizinde su dosyalar gorunmeli: `index.html`, `.htaccess`, `api/`, `assets/`, `data/`, `sitemap.xml`, `robots.txt`.

## 2) PHP Gereksinimi
- Rezervasyon API icin PHP 8.x onerilir.
- `api/reservation.php` POST endpoint olarak calisir: `/api/reservation.php`.

## 3) Dosya Izinleri
- `data/` klasoru yazilabilir olmali.
- Onerilen: klasor `755` veya `775`, `data/reservations.jsonl` olusursa dosya `644` veya `664`.

## 4) Mailto Ayari
- `assets/script.js` icinde `reservationMailRecipient` degeri rezervasyon talebinin gidecegi adrestir.
- Varsayilan deger: `snifflasancak@gmail.com`

## 5) SEO Kontrolu
- Canonical/OG/Sitemap adresleri `https://sniffalsancak.com` olarak ayarlanmistir.
- Eger farkli domain kullanilacaksa tum `sniffalsancak.com` gecislerini yeni domain ile degistirin.

## 6) Hiz Ayarlari
- Koku `.htaccess` icinde:
  - HTTPS yonlendirme
  - gzip/brotli sikistirma
  - statik dosya cache (uzun sureli)
  - HTML ve PHP icin uygun cache politikasi
