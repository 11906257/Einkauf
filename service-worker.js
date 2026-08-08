"use strict";

const CACHE_PREFIX = "einkauf-app-";
const CACHE_NAME = `${CACHE_PREFIX}v1.10.3`;
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const APP_SHELL_URLS = new Set(APP_SHELL.map((path) => new URL(path, self.registration.scope).href));
const OFFLINE_URL = new URL("./index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
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
      await self.registration.navigationPreload.enable();
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
    event.respondWith((async () => {
      try {
        const response = await event.preloadResponse || await fetch(request);
        if (response?.ok) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(OFFLINE_URL, response.clone());
          } catch (error) {
            console.warn("Offline-Kopie konnte nicht aktualisiert werden", error);
          }
        }
        return response;
      } catch {
        return await caches.match(OFFLINE_URL) || Response.error();
      }
    })());
    return;
  }

  if (APP_SHELL_URLS.has(url.href)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
