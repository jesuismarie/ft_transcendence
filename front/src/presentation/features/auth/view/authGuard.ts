import {StatelessWidget} from "@/core/framework/statelessWidget";
import type {BuildContext} from "@/core/framework/buildContext";
// import type {Widget} from "@/core/framework/widget";
// import {currentUser, currentUserId} from "@/utils/user";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {Resolver} from "@/di/resolver";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {ProfileBloc} from "@/presentation/profile/bloc/profileBloc";
import {Navigator, type RouteBuilder} from "@/core/framework/navigator";


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


export class AuthGuard {
    constructor(public route: string, public isAuthRoute: boolean, public isInitial: boolean = false) {
    }

    guard(context: BuildContext) {
        const nav = Navigator.of(context);
        const authBloc = context.read(AuthBloc);
        const profileBloc = context.read(ProfileBloc);
        const currentUserId = authBloc.state.user?.userId;
        const currentUser = profileBloc.state.profile?.username
        console.log(`USER:::: ${currentUser} ${currentUserId}`)
        if (currentUserId && currentUser && currentUser.length > 0 && currentUserId > 0) {
            console.log("INITIALLLLL")
            if (this.isInitial) {
                nav.replace('/profile');
            }
        } else if (!this.isAuthRoute) {
            if (this.isInitial) {
                return;
            }
            nav.replace('/login');
        }
    }

    static navigationGuard(context: BuildContext, routes: { [key: string]: string }) {
        const publicRoutes = ['/login', '/register'];
        const path = window.location.pathname;
        const preferenceService = Resolver.preferenceService();
        const token = preferenceService.getToken();

        if (!RouteInformationParser.matchRoute(path, routes)) {
            Navigator.of(context).pushNamed('/404')
        }
        if (!(token && token.length > 0) && !publicRoutes.includes(path)) {
            Navigator.of(context).pushNamed('/login');
            return;

        }
        if (token && token.length > 0 && (publicRoutes.includes(path) || path == '/')) {
            Navigator.of(context).pushNamed('/profile');
            return;
        }
        Navigator.of(context).pushNamed(path)
    }

}