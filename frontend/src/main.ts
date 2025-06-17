import "reflect-metadata";

import {App, navigatorKey, routes} from "@/app";
import {runApp} from "@/core/framework/core/runApp";
import {configureDependencies} from "@/di/service_locator";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {WidgetsBinding} from "@/core/framework/core/widgetBinding";

console.log("WS_ONLINE_URL:", import.meta.env.VITE_WS_ONLINE_URL);


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