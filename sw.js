const cacheName = 'app-cache-v1';
const filesToCache = [
  'index.html',
  'manifest.webmanifest',
  'icons/192.png',
  'icons/512.png'
];

self.addEventListener('install', event =>
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(filesToCache)))
);

self.addEventListener('fetch', event =>
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)))
);
