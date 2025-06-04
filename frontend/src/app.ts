// counter_widget.ts


import {MaterialApp} from "@/core/framework/materialApp";
import {AuthScreen} from "@/presentation/features/auth/view/auth_screen";
import type {BuildContext} from "@/core/framework/buildContext";
import {StatelessWidget} from "@/core/framework/statelessWidget";
import {LoginScreen} from "@/presentation/features/auth/view/login_screen";
import {ProfileScreen} from "@/presentation/profile/view/profileScreen";
import {RegisterScreen} from "@/presentation/features/auth/view/register_screen";
import {PongGameScreen} from "@/presentation/features/pongGame/view/pongGameScreen";
import {provideBlocProviders} from "@/core/provideBlocProviders";
import type {Widget} from "@/core/framework/base";
import {GlobalKey, UniqueKey} from "@/core/framework/key";
import {Resolver} from "@/di/resolver";
import {Navigator} from "@/core/framework/navigator";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {NotFoundWidget} from "@/presentation/common/widget/notFound";
import {AppRoutes} from "@/core/constants/appRoutes";

export const navigatorKey = new GlobalKey<Navigator>();

export const routes: { [key: string]: string }  = {
        '/': AppRoutes.root,
        '/login': AppRoutes.login,
        '/profile': AppRoutes.profile,
        '/profile/:id': AppRoutes.profile,
        '/register': AppRoutes.register,
        '/game': AppRoutes.game,
        '/404': AppRoutes.notFound,
}


export class App extends StatelessWidget {
    constructor() {
        super();
    }

    build(context: BuildContext): Widget {
        console.log("ZZZZZ")
        window.addEventListener('load', () => {
            AuthGuard.navigationGuard(context, routes)
        });
        return provideBlocProviders(new MaterialApp(
                {
                    navigatorKey: navigatorKey,
                    home: new AuthScreen(),
                    routes: {
                        '/': (context) => new AuthScreen(),
                        '/login': (context) => new LoginScreen(),
                        '/profile': (context) => new ProfileScreen(),
                        '/profile/:id': (context, params) => new ProfileScreen(params?.id),
                        '/register': (context) => new RegisterScreen(),
                        '/game': (context) => new PongGameScreen(),
                        '/404': (context) => new NotFoundWidget(),
                    }
                }
            )
        );
    }
}