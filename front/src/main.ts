import "reflect-metadata";

// import {configureDependencies} from "@/di/service_locator.ts";
import {App} from "@/app";
import {runApp} from "@/core/framework/runApp";
// import {CounterWidget} from "@/app.ts";
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

const app = new App();
runApp(app);