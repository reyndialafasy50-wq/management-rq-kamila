/**
 * ==================================================
 * SERVICE WORKER - PWA RQ KAMILA
 * File: sw.js
 * ==================================================
 */

const CACHE_NAME = 'rq-kamila-v3.0';
const urlsToCache = [
    './',
    './index.html',
    './login.html',
    './css/style.css',
    './css/costum.css',
    './js/config.js',
    './js/api.js',
    './js/login.js',
    './js/main.js',
    './js/dashboard.js',
    './js/santri.js',
    './js/input_harian.js',
    './js/laporan.js',
    './js/setting.js',
    './manifest.json',
    './logokamilamodern.png'
];

// 1. Proses Install (Menyimpan file ke memori / Cache)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Membuka cache dan menyimpan aset...');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => console.error('Gagal menyimpan cache:', err))
    );
    self.skipWaiting(); // Memaksa update jika ada versi baru
});

// 2. Proses Aktivasi (Membersihkan Cache Versi Lama)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Strategi Fetch (Network First, fallback to Cache)
// Mengutamakan ambil data terbaru dari internet, jika gagal/offline baru pakai cache
self.addEventListener('fetch', (event) => {
    // Abaikan request ke API Supabase (Agar data database selalu real-time)
    if (event.request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Jika sukses ambil dari internet, simpan versi terbarunya ke cache
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                // Jika offline atau koneksi gagal, ambil dari Cache
                return caches.match(event.request);
            })
    );
});
