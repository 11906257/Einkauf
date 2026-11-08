"use strict";

const CACHE_PREFIX = "einkauf-app-";
const CACHE_NAME = `${CACHE_PREFIX}v1.10.16`;
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const SCOPE_URL = new URL(self.registration.scope);
const OFFLINE_URL = new URL("./index.html", SCOPE_URL);
const APP_SHELL_URLS = new Set(APP_SHELL.map((path) => new URL(path, SCOPE_URL).href));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([...APP_SHELL_URLS].map((url) =>
        new Request(url, { cache: "reload" })
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); }
      catch (error) { console.warn("Navigation Preload nicht verfügbar", error); }
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const isAppDocument = url.pathname === SCOPE_URL.pathname || url.pathname === OFFLINE_URL.pathname;
    if (!isAppDocument) return;
    event.respondWith((async () => {
      try {
        const response = await event.preloadResponse || await fetch(request);
        if (!response.ok) return await caches.match(OFFLINE_URL, { cacheName: CACHE_NAME }) || response;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(OFFLINE_URL, response.clone());
          } catch (error) {
            console.warn("Offline-Kopie konnte nicht aktualisiert werden", error);
          }
        }
        return response;
      } catch {
        return await caches.match(OFFLINE_URL, { cacheName: CACHE_NAME }) || Response.error();
      }
    })());
    return;
  }

  if (APP_SHELL_URLS.has(url.href)) {
    event.respondWith(caches.match(request, { cacheName: CACHE_NAME }).then((cached) => cached || fetch(request)));
  }
});
