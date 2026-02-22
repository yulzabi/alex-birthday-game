const CACHE_VERSION = 'alex-birthday-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/audio.js',
  './js/config.js',
  './js/controls.js',
  './js/game.js',
  './js/intro.js',
  './js/main.js',
  './js/renderer.js',
  './images/alex.jpg',
  './manifest.json',
  './games/collect/index.html',
  './games/collect/css/style.css',
  './games/collect/js/audio.js',
  './games/collect/js/config.js',
  './games/collect/js/controls.js',
  './games/collect/js/game.js',
  './games/collect/js/intro.js',
  './games/collect/js/main.js',
  './games/collect/js/renderer.js',
  './games/collect/images/alex.jpg',
  './games/memory/index.html',
  './games/memory/css/style.css',
  './games/memory/js/game.js',
  './games/balloons/index.html',
  './games/balloons/css/style.css',
  './games/balloons/js/game.js',
  './games/piano/index.html',
  './games/piano/css/style.css',
  './games/piano/js/game.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate — remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_VERSION)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache, fall back to network, update cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Update cache with fresh version
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
