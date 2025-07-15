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
	'./phrases/can-i-get-some-napkins.m4a',
	'./phrases/can-i-get-some-water.m4a',
	'./phrases/can-i-get-this.m4a',
	'./phrases/can-i-pay-by-card.m4a',
	'./phrases/can-i-pay-by-cash.m4a',
	'./phrases/can-i-use-google-translate.m4a',
	'./phrases/can-you-help-me.m4a',
	'./phrases/can-you-speak-to-my-phone.m4a',
	'./phrases/can-you-write-it-down.m4a',
	'./phrases/do-you-speak-chinese.m4a',
	'./phrases/how-much-is-it.m4a',
	'./phrases/i-am-a-tourist.m4a',
	'./phrases/i-am-lost.m4a',
	'./phrases/i-dont-speak-english.m4a',
	'./phrases/where-do-i-get-my-luggage.m4a',
	'./phrases/where-is-it.m4a',
	'./phrases/where-is-the-bathroom.m4a',
	'./phrases/where-should-i-go.m4a'
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
