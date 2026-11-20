// Kill switch. The old worker served every Build/ file cache-first under a cache named after the version, and the
// file names never change, so every new upload of the same version (and the LAN server) kept running the first build
// a browser had seen. index.html no longer registers a worker; this file stays at the same URL so browsers that still
// have the old one fetch it on their next visit, drop every cache, unregister and reload into the real build.
// Unity's own data caching (IndexedDB, revalidated against the server) still makes repeat loads fast.

self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    e.waitUntil((async function () {
        const names = await caches.keys();
        await Promise.all(names.map(function (name) { return caches.delete(name); }));
        await self.registration.unregister();
        const windows = await self.clients.matchAll({ type: 'window' });
        windows.forEach(function (client) { client.navigate(client.url); });
    })());
});
