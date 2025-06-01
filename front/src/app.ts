// counter_widget.ts


import {MaterialApp} from "@/core/rendering-engine/materialApp";
import {AuthScreen} from "@/presentation/features/auth/view/auth_view";
import {State, StatefulWidget} from "@/core/rendering-engine/statefulWidget";
import type {BuildContext} from "@/core/rendering-engine/buildContext";
import type {Widget} from "@/core/rendering-engine/widget";
import {StatelessWidget} from "@/core/rendering-engine/statelessWidget";
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