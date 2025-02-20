//Cache Essentials Assets
const cacheName = "joke-generator-v1";
const cacheAssets = [
    "/index.html",
    "/manifest.json",
    "/src/icons/joke-48x48.png",
    "/src/icons/joke-72x72.png",
    "/src/main.jsx",
    "/src/App.jsx",
    "/src/style.css"
];
//Call Install event

self.addEventListener("install", (event) => {
    console.log("Service worker Installling...");

// Put your code for caching assets, etc. here
    event.waitUntil(
        caches
        .open(cacheName)
        .then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    
    );
});

//Serve Cached Assets (Fetch Event) call fetch event 
self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url); // Log the requested URL

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit: if the resource is in the cache, return it
            if (response) {
                console.log("Cache hit for:", event.request.url); // Log cache hit
                return response;
            }

            console.log("Cache miss for:", event.request.url); // Log cache miss

            // Cache miss: fetch from the network
            return fetch(event.request).then((networkResponse) => {
                // Cache the response if the fetch is successful and the response is valid
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(cacheName).then((cache) => {
                        console.log("Caching new resource:", event.request.url); // Log new cache
                        cache.put(event.request, networkResponse.clone()); // Add response to cache
                    });
                }
                return networkResponse; // Return the network response to be used by the browser
            }).catch((error) => {
                console.log("Network fetch failed:", event.request.url, error);
                // Optionally, serve a fallback asset or an offline page if needed
                throw error; // Rethrow the error
            });
        })
    );
});



self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

//delete old cache (Activate Event)
self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});



