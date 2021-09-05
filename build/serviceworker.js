var CACHE = "weaver-cache";
self.addEventListener("install", function (event) {
  console.log("installing service worker");
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll([
        "/build/bundle.css",
        "/build/bundle.js",
        "global.css",
      ]);
    })
  );
  console.log("done");
});

self.addEventListener("fetch", function (evt) {
  console.log("The service worker is serving the asset.");

  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request).then(refresh));
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: "refresh",
        url: response.url,

        eTag: response.headers.get("ETag"),
      };

      client.postMessage(JSON.stringify(message));
    });
  });
}
