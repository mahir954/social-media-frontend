const CACHE_NAME = "fello-social-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // POST, PUT, PATCH, DELETE requests ko Service Worker handle nahi karega
  if (event.request.method !== "GET") {
    return;
  }

  // API/socket requests ko Service Worker se bypass karo
  const url = new URL(event.request.url);

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/socket.io/")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Network fail hone par cached page available ho to use karo
        return caches.match("/").then((fallback) => {
          return (
            fallback ||
            new Response("Offline", {
              status: 503,
              headers: {
                "Content-Type": "text/plain",
              },
            })
          );
        });
      });
    })
  );
});
