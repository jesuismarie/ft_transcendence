// counter_widget.ts


import {MaterialApp} from "@/core/framework/widgets/materialApp";
import {AuthScreen} from "@/presentation/features/auth/view/auth_screen";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {LoginScreen} from "@/presentation/features/auth/view/login_screen";
import {ProfileScreen} from "@/presentation/features/profile/view/profileScreen";
import {RegisterScreen} from "@/presentation/features/auth/view/register_screen";
import {PongGameScreen} from "@/presentation/features/pongGame/view/pongGameScreen";
import {provideBlocProviders} from "@/core/provideBlocProviders";
import type {Widget} from "@/core/framework/core/base";
import {GlobalKey} from "@/core/framework/core/key";
import {Resolver} from "@/di/resolver";
import {Navigator} from "@/core/framework/widgets/navigator";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {NotFoundWidget} from "@/presentation/common/widget/notFound";
import {AppRoutes} from "@/core/constants/appRoutes";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {BuilderWidget} from "@/core/framework/widgets/builderWidget";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {OnlineBloc} from "@/presentation/features/online/onlineBloc";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {OAuthRedirectScreen} from "@/presentation/features/auth/view/OAuthRedirectScreen";
import {OtpScreen} from "@/presentation/features/otp/view/otpScreen";
import {TwoFaScreen} from "@/presentation/features/auth/view/twoFaScreen";

export const navigatorKey = new GlobalKey<Navigator>();

export const routes: { [key: string]: string } = {
    '/': AppRoutes.root,
    '/login': AppRoutes.login,
    '/profile': AppRoutes.profile,
    '/profile/:id': AppRoutes.profile,
    '/register': AppRoutes.register,
    '/game/:id/:username': AppRoutes.game,
    '/404': AppRoutes.notFound,
    '/otp': AppRoutes.otp,
    '/oauth/complete': AppRoutes.authRedirect
}


export class App extends StatelessWidget {
    constructor() {
        super();
    }

    build(context: BuildContext): Widget {
        return provideBlocProviders(new BuilderWidget((context) => {
                const authBloc = context.read(AuthBloc);
                const profileBloc = context.read(ProfileBloc);

                const preferenceService = Resolver.preferenceService();
                const token = preferenceService.getToken();
                const refreshToken = preferenceService.getRefreshToken();
                if (token && token.length > 0) {
                    authBloc.requestRefresh(token, refreshToken ?? '').then(() => {
                        authBloc.stream.subscribe((state) => {
                            if (state.status == AuthStatus.Success) {
                                if (state.user?.userId) {
                                    profileBloc.getUserProfile(state.user!.userId.toString()).then(profile => {
                                    });
                                }
                            }
                            else {
                                authBloc.logout().then(() => {});
                            }
                        })
                    })
                }
                profileBloc.stream.subscribe((state) => {
                    if (state.status == ProfileStatus.Error) {
                        context.read(AuthBloc).logout().then(() => {})
                    }
                })
                return new BlocProvider({
                    create: () => new OnlineBloc(authBloc),
                    child: new MaterialApp(
                        {
                            routeListen: (context, url) => {
                                AuthGuard.navigationGuard(context!, routes);
                            },
                            navigatorKey: navigatorKey,
                            home: new AuthScreen(),
                            routes: {
                                '/oauth/complete/:ticketId': (context, params) => new OAuthRedirectScreen(params?.ticketId),
                                '/': (context) => new AuthScreen(),
                                '/login': (context) => new LoginScreen(),
                                '/profile': (context) => new ProfileScreen(),
                                '/profile/:id': (context, params) => new ProfileScreen(params?.id),
                                '/register': (context) => new RegisterScreen(),
                                '/game/:id/:username': (context) => new PongGameScreen(),
                                '/otp': (context) => new TwoFaScreen(),
                                '/404': (context) => new NotFoundWidget(),
                            }
                        }
                    )
                })
            }
        ));
    }
}


