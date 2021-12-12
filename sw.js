var cacheName = 'testWebAppCache-v2'
var contentToCache = [
  '/',
  '/favicon.ico',
  '/style.css',
  '/images/touch/homescreen48.png',
  '/images/touch/homescreen72.png',
  '/images/touch/homescreen96.png',
  '/images/touch/homescreen144.png',
  '/images/touch/homescreen168.png',
  '/images/touch/homescreen192.png',
  '/images/touch/homescreen512.png',
]

self.addEventListener('install', e => {
  console.log('[Service Worker] install', e)

  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[Service Worker] Caching shell files')
      return cache.addAll(contentToCache)
    })
  )
})

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', e => {
  console.log('[Service Worker] activating ', cacheName)
  e.waitUntil(
    caches.keys().then(keyList => {
      console.log(keyList)
      return Promise.all(
        keyList.map(key => {
          if (cacheName.indexOf(key) === -1) {
            console.log('[Service Worker] Deleting Unused Cache:', key)
            return caches.delete(key)
          }
        })
      )
    })
  )

  // e.skipWaiting(
  //   caches.keys().then(keyList => {
  //     console.log(keyList)
  //     return Promise.all(
  //       keyList.map(key => {
  //         if (cacheName.indexOf(key) === -1) {
  //           console.log('[Service Worker] Deleting Unused Cache:', key)
  //           return caches.delete(key)
  //         }
  //       })
  //     )
  //   })
  // )
  // `claim()` sets this worker as the active worker for all clients that
  // match the workers scope and triggers an `oncontrollerchange` event for
  // the clients.
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      // console.log('[Service Worker] Fetched resource ' + e.request.url)
      return (
        r ||
        fetch(e.request).then(response => {
          return caches.open(cacheName).then(cache => {
            console.log(
              '[Service Worker] Caching new resource: ',
              e.request.url
            )
            cache.put(e.request, response.clone())
            return response
          })
        })
      )
    })
  )
})
