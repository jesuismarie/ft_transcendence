import "reflect-metadata";

// import {configureDependencies} from "@/di/service_locator.ts";
import {App, navigatorKey, routes} from "@/app";
import {runApp} from "@/core/framework/core/runApp";
import {configureDependencies} from "@/di/service_locator";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {WidgetsBinding} from "@/core/framework/core/widgetBinding";
import type {RouteBuilder} from "@/core/framework/widgets/navigator";
import {PersistenceServiceImpl} from "@/core/services/persistance_service_impl";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Resolver} from "@/di/resolver";
//
// import '../index.css';
// import {
//     handleRouting,
//     loadGamePage,
//     loadHomePage,
//     loadProfilePage,
//     loadSignInForm,
//     loadSignUpForm
// } from "./presentation/templates/templates";
//
//

// window.addEventListener("DOMContentLoaded", handleRouting);
// window.addEventListener("hashchange", handleRouting);
// (window as any).loadSignInForm = loadSignInForm;
// (window as any).loadSignUpForm = loadSignUpForm;
// (window as any).loadProfilePage = loadProfilePage;
// (window as any).loadHomePage = loadHomePage;
// (window as any).loadGamePage = loadGamePage;


function waitForNavigatorReady(callback: () => void) {
    const check = () => {
        const context = navigatorKey.currentContext();
        if (context) {
            callback();
        } else {
            requestAnimationFrame(check);
        }
    };
    requestAnimationFrame(check);
}



async function bootstrap() {
    WidgetsBinding.ensureInitialized();
    await configureDependencies();
    // register dependencies
    runApp(new App());
    const service = new PersistenceServiceImpl(ApiConstants.websocketUrl, new AuthBloc(Resolver.authRepository(), Resolver.preferenceService()));
    service.init();
    waitForNavigatorReady(() => {
        const context = navigatorKey.currentContext();
        if (context) {
            AuthGuard.navigationGuard(context!, routes);
        } else {
            console.warn("Navigator context still unavailable.");
        }
    });
}



bootstrap().then(() => {})