// Service worker — app de treino
// Shell em cache (funciona offline); rotina.json sempre tenta a rede primeiro.
const CACHE = 'treino-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // rotina.json: rede primeiro (é o canal de atualização), cache como fallback
  if (url.origin === location.origin && url.pathname.endsWith('/rotina.json')) {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put('./rotina.json', cp));
          return r;
        })
        .catch(() => caches.match('./rotina.json'))
    );
    return;
  }

  // resto: cache primeiro, rede como fallback (e abastece o cache)
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit ||
      fetch(e.request).then(r => {
        if (url.origin === location.origin && r.ok) {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return r;
      }).catch(() => (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined))
    )
  );
});
