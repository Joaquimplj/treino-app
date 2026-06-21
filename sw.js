// Service worker — app de treino
// Shell (index.html) e rotina.json: NETWORK-FIRST (sempre pega a versao nova online,
// cai pro cache só offline). Demais assets: cache-first (rapido + offline).
const CACHE = 'treino-v4';
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
  const mesmaOrigem = url.origin === location.origin;

  // rotina.json: rede primeiro (canal de atualizacao do treino), cache como fallback
  if (mesmaOrigem && url.pathname.endsWith('/rotina.json')) {
    e.respondWith(
      fetch(e.request)
        .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./rotina.json', cp)); return r; })
        .catch(() => caches.match('./rotina.json'))
    );
    return;
  }

  // SHELL (navegacao / index.html): rede primeiro -> atualiza sozinho quando online
  if (mesmaOrigem && (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html'))) {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r && r.ok) {
            const c1 = r.clone(), c2 = r.clone();
            caches.open(CACHE).then(c => { c.put('./index.html', c1); c.put('./', c2); });
          }
          return r;
        })
        .catch(() => caches.match('./index.html').then(h => h || caches.match('./')))
    );
    return;
  }

  // resto: cache primeiro, rede como fallback (e abastece o cache)
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit ||
      fetch(e.request).then(r => {
        if (mesmaOrigem && r.ok) {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return r;
      }).catch(() => (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined))
    )
  );
});
