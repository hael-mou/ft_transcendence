
/* *************************************************************************** #
#   * RoutingModule Class :                                                    #
# *************************************************************************** */
export class Router
{
    static routes = [];
    static isRedirect = false;

    /* === constructor : ==================================================== */
    static setRoutes(routes) {

        this.routes = routes;
    }

    /* === initialize : ===================================================== */
    static async initialize() {

        window.addEventListener('popstate', loadRoute);
        window.addEventListener('pageshow', loadRoute);
    }

    /* === handle Routing Event : =========================================== */
    static async handleRouting(event) {

        if (event.currentTarget.matches("[data-link]")) {

            const targetLink = event.currentTarget.getAttribute("data-link");

            event.preventDefault()
            if (targetLink === location.href) return;
            history.pushState(null, null, targetLink);
            await loadRoute();
        }
    }

    /* === handle Routing Event : =========================================== */
    static async redirect(url) {

        if (url === location.href) return;
        history.replaceState(null, null, url);
        this.isRedirect = true;
        await loadRoute();
    }
}

/* *************************************************************************** #
#   * Private functions :                                                      #
# *************************************************************************** */

/* === load Route component : =============================================== */
async function loadRoute()
{
    const routeMatches = Router.routes.map(route => ({
        route: route,
        isMatch: route.path === location.pathname,
    }));

    const bestMatch = routeMatches.find(match => match.isMatch);
    const routeToLoad = bestMatch ? bestMatch.route : Router.routes[0];

    if (routeToLoad.view === undefined) {
       console.error("No view associated with the route");
       return ;
    }
    await routeToLoad.view();
    Router.isRedirect = false;
}
