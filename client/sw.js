// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
    
];

const cahceResources = [
    // emotes
    "https://cdn.7tv.app/emote/",
    "https://static-cdn.jtvnw.net/emoticons/",
    "https://cdn.betterttv.net/emote/",
    "https://cdn.frankerfacez.com/emote/",
    // badges
    "https://static-cdn.jtvnw.net/badges/",
    "https://badges.twitch.tv/v1/badges/",
    // pfp
    "https://static-cdn.jtvnw.net/jtv_user_pictures/",
    // user info
    "https://api.frankerfacez.com/v1/room/id/",
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
    console.log('Service worker install event!');
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
    if(cahceResources.find(r => event.request.url.match(r))) {
        // console.log('Fetch intercepted for:', event.request.url);
        event.respondWith(fetchCache(event.request));
    } else {
        console.log('Ignored cache for', event.request.url);
        event.respondWith(fetch(event.request));
    }
});

async function fetchCache(req) {
    const cache = await caches.open(cacheName);
    return cache.match(req).then((cachedResponse) => {
        return cachedResponse || fetch(req).then(async res => {
            await cache.put(req, res.clone());
            return res;
        });
    })
}
