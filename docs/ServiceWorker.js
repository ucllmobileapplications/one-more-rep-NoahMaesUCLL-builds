// One More Rep service worker: makes the web version installable and lets it start and play offline.
// - The app shell (page, manifest, styles, icons) is cached when the worker installs, and is fetched from the network
//   first afterwards, so a new version shows up on the next visit; offline, the cached copy is used.
// - The game files in Build/ are cached the first time they load and are served from the cache after that. Their names
//   are content hashes, so a new version always has new names and an old copy is never served for it.
// - The cache name contains every game file's hash, so each new build installs a new worker that deletes the old cache.
const CACHE_NAME = "one-more-rep-0.1.0-f43cba36a4ac525420b2e39097a2ed33.wasm.unityweb-607d47f4759e36df503efc68fcd8e6b8.data.unityweb-d859cc62ac362445ec95e3c141ebbae2.framework.js.unityweb";
const APP_SHELL = [
  "./",
  "index.html",
  "manifest.json",
  "TemplateData/style.css",
  "TemplateData/icons/favicon-32.png",
  "TemplateData/icons/icon-192.png",
  "TemplateData/icons/icon-512.png",
  "TemplateData/icons/maskable-192.png",
  "TemplateData/icons/maskable-512.png",
  "TemplateData/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        .filter((name) => name.startsWith("one-more-rep-") && name !== CACHE_NAME)
        .map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (!response || !response.ok || response.type === "opaque") return;
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes("/Build/")) {
    // Game files: cache first.
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        putInCache(request, response);
        return response;
      }))
    );
    return;
  }

  // Page, manifest, styles and icons: network first, the cached copy when offline.
  event.respondWith(
    fetch(request)
      .then((response) => { putInCache(request, response); return response; })
      .catch(() => caches.match(request)
        .then((cached) => cached || (request.mode === "navigate" ? caches.match("index.html") : null))
        .then((cached) => cached || Response.error()))
  );
});
