/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let coep = "require-corp";
let coop = "same-origin";

if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", function (event) {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy", coep);
                    newHeaders.set("Cross-Origin-Opener-Policy", coop);

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders
                    });
                })
                .catch((e) => console.error(e))
        );
    });

} else {
    (() => {
        if (window.crossOriginIsolated !== false) return;

        const n = navigator;
        const serviceWorker = n.serviceWorker;
        if (serviceWorker) {
            serviceWorker.register(window.document.currentScript.src).then(
                (registration) => {
                    console.log("COI Service Worker registered");
                    registration.addEventListener("updatefound", () => {
                        console.log("Reloading/updating COI Service Worker...");
                        window.location.reload();
                    });

                    if (registration.active && !n.serviceWorker.controller) {
                        console.log("Reloading page for COI Service Worker to take control...");
                        window.location.reload();
                    }
                },
                (err) => {
                    console.error("COI Service Worker registration failed: ", err);
                }
            );
        }
    })();
}
