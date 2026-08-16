const SHELL = "kk-shell-v2";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(["./", "./index.html", "./manifest.webmanifest", "./icon-192.png"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin && e.request.method === "GET") {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(SHELL).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request)));
  }
});
