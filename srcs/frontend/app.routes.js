
import { rootView, signInView } from "./view/auth_view.js";

export const appRoutes = [
    { path: '/', view: rootView },
    { path: '/sign-in', view: signInView },
]
