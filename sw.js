const CACHE = 'writetcg-v2';
const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './sw.js'
];
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap'
];

/* Installa: copia i file locali in cache, poi prova gli esterni */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      // Prima i file locali (obbligatori)
      return cache.addAll(CORE_ASSETS).then(function() {
        // Poi gli esterni (opzionali, non bloccare se offline)
        return Promise.all(
          EXTERNAL_ASSETS.map(function(url) {
            return fetch(url, { mode: 'no-cors' }).then(function(resp) {
              return cache.put(url, resp);
            }).catch(function() {});
          })
        );
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(
