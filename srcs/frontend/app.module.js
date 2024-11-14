
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";


/* === Custom Elements : ==================================================== */


/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', () => {
    Router.setRoutes(appRoutes);
    Router.initialize();
});
