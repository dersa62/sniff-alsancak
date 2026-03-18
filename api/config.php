<?php

declare(strict_types=1);

return [
    // Rezervasyon satir satir JSON olarak buraya yazilir.
    'storage_file' => __DIR__ . '/../data/reservations.jsonl',

    // Opsiyonel: kendi sisteminizde bir endpoint varsa doldurun.
    // Ornek: 'https://panel.senin-domainin.com/hooks/reservation'
    'webhook_url' => '',
    'webhook_secret' => '',

    'timezone' => 'Europe/Istanbul',
];
