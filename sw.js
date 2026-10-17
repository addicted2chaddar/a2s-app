// A2S service worker: caches ONLY the app icons + manifest.
// Picks, payments and the paywall always come from the network.
const CACHE = 'a2s-pwa-v1';
const STATIC = ['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon-180.png','icons/favicon-48.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const rel = url.pathname.split('/a2s-app/').pop();
  if (STATIC.includes(rel)) e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
