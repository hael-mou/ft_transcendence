
/* *************************************************************************** #
#   * RoutingModule Class :                                                    #
# *************************************************************************** */

export class Router
{
    static routes = [];

    /* === constructor : ==================================================== */
    static setRoutes(routes)
    {
        this.routes = routes;
    }

    /* === initialize : ===================================================== */
    static initialize()
    {
        window.addEventListener('click', this.handleRouting);
        window.addEventListener('popstate', loadRoute);
        loadRoute.call(this);
    }

    /* === handle Routing Event : =========================================== */
    static handleRouting(event)
    {
        if (event.target.matches("[data-link]"))
        {
            event.preventDefault()
            if (event.target.href === location.href) return;
            history.pushState(null, null, event.target.href);
            loadRoute.call(this);
        }
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
    // await routeToLoad.view();
}
