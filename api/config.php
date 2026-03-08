<?php

declare(strict_types=1);

return [
    // Rezervasyon geldiğinde bildirim gidecek e-posta.
    'notify_email' => 'info@sniffalsancak.com',

    // Sunucudaki giden mail adresi (hosting panelinde tanimli bir adres kullanin).
    'from_email' => 'noreply@sniffalsancak.com',
    'from_name' => 'Sniff Alsancak',

    // Rezervasyon satir satir JSON olarak buraya yazilir.
    'storage_file' => __DIR__ . '/../data/reservations.jsonl',

    // Opsiyonel: kendi sisteminizde bir endpoint varsa doldurun.
    // Ornek: 'https://panel.senin-domainin.com/hooks/reservation'
    'webhook_url' => '',
    'webhook_secret' => '',

    'timezone' => 'Europe/Istanbul',
    'subject_prefix' => '[Sniff Rezervasyon]',
];

