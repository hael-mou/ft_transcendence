
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";
import { utils } from "./tools/utils.js";

/* === DOM Content Loaded : ================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    const rootElement = document.querySelector("app-root");
    utils.clear(rootElement);

    Router.setRoutes(appRoutes);
    await Router.initialize();
});

/* === load Route component : =============================================== */
window.addEventListener("load", () => {
    const loadingDelay = Math.max(0, 1500 - performance.now());
    setTimeout(() => {
        setTimeout(() => {
            const loadingScreen = document.getElementById("loading-screen");
            loadingScreen.style.opacity = "0";
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 1000);
        }, 1000);
    }, loadingDelay);
});
