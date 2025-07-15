const CACHE_NAME = 'travel-english-cache-v1';
const urlsToCache = [
	'./',
	'./index.html',
	'./manifest.json',
	'./styles/index.css',
	'./scripts/ios-pwa-splash.js',
	'./scripts/index.js',
	'./phrases/1.txt',
	'./icons/512.png',
	'./icons/180.png'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then(
			(response) => response || fetch(event.request)
		)
	);
});
