// counter_widget.ts


import {MaterialApp} from "@/core/framework/materialApp";
import {AuthScreen} from "@/presentation/features/auth/view/auth_view";
import {State, StatefulWidget} from "@/core/framework/statefulWidget";
import type {BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/widget";
import {StatelessWidget} from "@/core/framework/statelessWidget";
import {LoginScreen} from "@/presentation/features/auth/view/login_screen";
import {ProfileScreen} from "@/presentation/profile/view/profileScreen";
import {RegisterScreen} from "@/presentation/features/auth/view/register_screen";

export class App extends StatelessWidget {

    build(context: BuildContext): Widget {
        return new MaterialApp(
            {home: new AuthScreen(),
                routes: {
                    '/login': (context) => new LoginScreen(),
                    '/profile': (context) => new ProfileScreen(),
                    '/register': (context) => new RegisterScreen(),
                }
            }
        );
    }
}