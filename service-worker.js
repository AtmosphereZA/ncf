self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache =>
      cache.addAll([
        '/index.html',
        '/app.js',
        '/styles.css',
        '/manifest.json',
        '/modules/home.html',
        '/modules/artists.html',
        '/modules/schedule.html',
        '/modules/messaging.html',
        '/modules/organizers.html',
        '/modules/admin.html'
      ])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
