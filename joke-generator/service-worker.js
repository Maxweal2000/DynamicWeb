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
        caches.open(cacheName).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(cacheAssets);
        })
    );
});

//Serve Cached Assets (Fetch Event)
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



