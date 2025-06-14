import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {Resolver} from "@/di/resolver";
import {Navigator} from "@/core/framework/widgets/navigator";


export class RouteInformationParser {
    static matchRoute(routeName: string, routes: { [key: string]: string }) {
        for (const path in routes) {
            const pathParts = path.split("/");
            const routeParts = routeName.split("/");

            if (pathParts.length !== routeParts.length) continue;

            const params: Record<string, string> = {};
            let matched = true;

            for (let i = 0; i < pathParts.length; i++) {
                const pathPart = pathParts[i];
                const routePart = routeParts[i];

                if (pathPart.startsWith(":")) {
                    params[pathPart.slice(1)] = routePart;
                } else if (pathPart !== routePart) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                return routes[path]!;
            }
        }

        return null;
    }
}


export abstract class AuthGuard {
    static navigationGuard(context: BuildContext, routes: { [key: string]: string }) {
        const publicRoutes = ['/login', '/register', '/', '/oauth/complete'];
        const path = window.location.pathname;
        const preferenceService = Resolver.preferenceService();
        const token = preferenceService.getToken();

        if (path)
        if (!RouteInformationParser.matchRoute(path, routes)) {
            Navigator.of(context).pushNamed('/404')
        }
        if (!(token && token.length > 0) && !publicRoutes.includes(path)) {
            Navigator.of(context).pushNamed('/login');
            return;

        }
        if (token && token.length > 0 && publicRoutes.includes(path)) {
            Navigator.of(context).pushNamed('/profile');
            return;
        }
        if (path == '/oauth/complete') {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const ticket = hashParams.get("ticket");
            Navigator.of(context).pushNamed(`${path}/${ticket}`);
            return;
        }
        console.log(`SSSSS:::: ${window.location.href} ${window.location.pathname}`);
        Navigator.of(context).pushNamed(path)
    }

}