// Choose a cache name
const cacheName = 'cache-v1';

const expectedCaches = ['cache-v1'];

const precacheResources = [];

const cahceResources = [
	// emotes
	'https://cdn.7tv.app/emote/',
	'https://static-cdn.jtvnw.net/emoticons/',
	'https://cdn.betterttv.net/emote/',
	'https://cdn.frankerfacez.com/emote/',
	// badges
	'https://static-cdn.jtvnw.net/badges/',
	'https://badges.twitch.tv/v1/badges/',
	// pfp
	'https://static-cdn.jtvnw.net/jtv_user_pictures/',
	// user info
	'https://api.frankerfacez.com/v1/room/id/',

	// api response cache
	'https://api.twitch.tv/helix/chat/emotes/set'
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
	console.log('Service worker install event!');
	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			cache.addAll(precacheResources);
		})
	);
});

self.addEventListener('activate', (event) => {
	console.log('Service worker activate event!');

	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.map((key) => {
						if (!expectedCaches.includes(key)) {
							return caches.delete(key);
						}
					})
				)
			)
			.then(() => {
				console.log('Updated service worker!');
			})
	);
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
	if (cahceResources.find((r) => event.request.url.match(r))) {
		event.respondWith(fetchCache(event.request));
	} else {
		event.respondWith(fetch(event.request));
	}
});

async function fetchCache(req) {
	const cache = await caches.open(cacheName);
	return cache.match(req).then((cachedResponse) => {
		return (
			cachedResponse ||
			fetch(req).then(async (res) => {
				await cache.put(req, res.clone());
				return res;
			})
		);
	});
}
