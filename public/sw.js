// Wetigo service worker — minimal, network-first for navigations (always fresh),
// cache-first for static assets. Enables PWA install on Android & iOS.
const CACHE = 'wetigo-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // never cache API calls
  if (url.pathname.startsWith('/api') || url.hostname.includes('onrender.com')) return;
  // SPA navigations: network first, fall back to cached shell (offline)
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }
  // static: cache first
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    const copy = res.clone();
    if (res.ok && url.origin === location.origin) caches.open(CACHE).then((c) => c.put(req, copy));
    return res;
  }).catch(() => hit)));
});
