// Cache name and assets to be cached
const cacheName = "Joke-generator-v1";
const cacheAssets = [
  "index.html",
 
];

// Install event - caching assets
self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("Caching essential assets...");
      return cache.addAll(cacheAssets); // Cache defined assets
    })
  );
});

// Fetch event - serving cached assets or fetching from the network
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the cached response
      return response || fetch(event.request); // Fetch from the network if not cached
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache); // Delete old cache
          }
        })
      );
    })
  );
});
