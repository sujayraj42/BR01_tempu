// Tempu Wala Service Worker for PWA Offline Support
const CACHE_NAME = 'tempu-wala-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/scripts/main.js',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
