<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$config = require __DIR__ . '/config.php';
date_default_timezone_set((string)($config['timezone'] ?? 'Europe/Istanbul'));

$rawBody = file_get_contents('php://input');
$payload = json_decode((string)$rawBody, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body']);
    exit;
}

$sanitize = static function ($value, int $max = 220): string {
    $value = is_scalar($value) ? (string)$value : '';
    $value = trim(preg_replace('/\s+/', ' ', $value) ?? '');
    return mb_substr($value, 0, $max);
};

$name = $sanitize($payload['name'] ?? '', 90);
$phone = $sanitize($payload['phone'] ?? '', 40);
$guests = $sanitize($payload['guests'] ?? '', 40);
$date = $sanitize($payload['date'] ?? '', 20);
$time = $sanitize($payload['time'] ?? '', 10);
$notes = $sanitize($payload['notes'] ?? '', 260);
$honeypot = $sanitize($payload['website'] ?? '', 120);
$consent = filter_var($payload['consent'] ?? false, FILTER_VALIDATE_BOOLEAN);

if ($honeypot !== '') {
    http_response_code(200);
    echo json_encode(['ok' => true, 'spam' => true]);
    exit;
}

if ($name === '' || $phone === '' || $guests === '' || $date === '' || $time === '' || !$consent) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Required fields are missing']);
    exit;
}

$record = [
    'id' => $sanitize($payload['id'] ?? ('res_' . bin2hex(random_bytes(5))), 64),
    'createdAt' => gmdate('c'),
    'name' => $name,
    'phone' => $phone,
    'guests' => $guests,
    'date' => $date,
    'time' => $time,
    'notes' => $notes,
    'consent' => true,
    'ip' => $sanitize($_SERVER['REMOTE_ADDR'] ?? '', 64),
    'userAgent' => $sanitize($_SERVER['HTTP_USER_AGENT'] ?? '', 220),
];

$storageFile = (string)($config['storage_file'] ?? (__DIR__ . '/../data/reservations.jsonl'));
$storageDir = dirname($storageFile);

if (!is_dir($storageDir) && !mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Cannot create storage directory']);
    exit;
}

$line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$stored = @file_put_contents($storageFile, $line . PHP_EOL, FILE_APPEND | LOCK_EX) !== false;

if (!$stored) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Cannot save reservation']);
    exit;
}

$subjectPrefix = (string)($config['subject_prefix'] ?? '[Sniff Rezervasyon]');
$subject = sprintf('%s %s %s', $subjectPrefix, $date, $time);

$message = implode(PHP_EOL, [
    'Yeni rezervasyon olustu.',
    '',
    'Ad Soyad: ' . $name,
    'Telefon: ' . $phone,
    'Kisi: ' . $guests,
    'Tarih: ' . $date,
    'Saat: ' . $time,
    'Not: ' . ($notes !== '' ? $notes : '-'),
    '',
    'Kayit ID: ' . $record['id'],
    'Olusturma: ' . $record['createdAt'],
    'IP: ' . $record['ip'],
]);

$fromEmail = (string)($config['from_email'] ?? 'noreply@localhost');
$fromName = (string)($config['from_name'] ?? 'Sniff Alsancak');
$notifyEmail = (string)($config['notify_email'] ?? '');
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . sprintf('%s <%s>', $fromName, $fromEmail),
    'Reply-To: ' . $fromEmail,
];

$mailSent = false;
if ($notifyEmail !== '') {
    $mailSent = @mail($notifyEmail, $subject, $message, implode("\r\n", $headers));
}

$webhookSent = false;
$webhookUrl = trim((string)($config['webhook_url'] ?? ''));
if ($webhookUrl !== '' && function_exists('curl_init')) {
    $ch = curl_init($webhookUrl);
    if ($ch !== false) {
        $webhookPayload = json_encode([
            'event' => 'reservation.created',
            'reservation' => $record,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $webhookHeaders = ['Content-Type: application/json'];
        $secret = trim((string)($config['webhook_secret'] ?? ''));
        if ($secret !== '') {
            $signature = hash_hmac('sha256', (string)$webhookPayload, $secret);
            $webhookHeaders[] = 'X-Sniff-Signature: ' . $signature;
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $webhookHeaders,
            CURLOPT_POSTFIELDS => $webhookPayload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 4,
        ]);
        curl_exec($ch);
        $statusCode = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $webhookSent = $statusCode >= 200 && $statusCode < 300;
        curl_close($ch);
    }
}

echo json_encode([
    'ok' => true,
    'id' => $record['id'],
    'stored' => true,
    'mailSent' => $mailSent,
    'webhookSent' => $webhookSent,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

