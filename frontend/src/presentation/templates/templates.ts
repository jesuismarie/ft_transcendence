import {initWipeText} from "@/animation/animation";
import {initGoogleAuth, initLoginForm} from "@/profile/login";
import {initGoogleRegister, initRegistrationForm} from "@/profile/register";
import {initializePongGame} from "@/game/pong";
import type {BuildContext} from "@/core/framework/buildContext";

export const mainWrapper = document.getElementById("wrapper") as HTMLElement | null;

// export function getCurrentUserId(): number {
//     return Number(localStorage.getItem("currentUserId"));
// }




// export function getCurrentUser(): string | null {
//     return localStorage.getItem("currentUser");
// }

// export const currentUserId = getCurrentUserId();
// export const currentUser = getCurrentUser();

// export function loadTemplate(templateId: string, title: string) {
//     if (!mainWrapper)
//         return;
//     const template = document.getElementById(templateId) as HTMLTemplateElement | null;
//     if (!template) {
//         console.warn(`Template "${templateId}" not found.`);
//         return;
//     }
//     const clone = template.content.cloneNode(true);
//     mainWrapper.innerHTML = '';
//     mainWrapper.appendChild(clone);
//     document.title = title;
//     if (templateId != "profile-template")
//         location.hash = `#${templateId.split('-')[0]}`;
// }

export function loadHomePage() {
    // loadTemplate("home-template", "Welcome to Pong!");
    initWipeText();
}

export function loadSignInForm(context: BuildContext) {
    // loadTemplate("signin-template", "Sign In");
    initLoginForm(context);
    initGoogleAuth(context);
}

export function loadSignUpForm(context: BuildContext) {
    // loadTemplate("signup-template", "Sign Up");
    initRegistrationForm(context);
    initGoogleRegister();
}

export function loadGamePage() {
    // loadTemplate("game-template", "Pong Game");
    initializePongGame();
}
//
// export function loadProfilePage(username: string | null = null) {
//     if (username === currentUser || username === null) {
//         if (location.hash !== "#profile") {
//             location.hash = "#profile";
//             return;
//         }
//     } else {
//         if (location.hash !== `#profile/${username}`) {
//             location.hash = `#profile/${username}`;
//             return;
//         }
//     }
//     loadTemplate("profile-template", "Pong Profile");
//     initPersonalData(currentUserId);
// }

// export const routes: { [key: string]: () => void } = {
//     "#": loadHomePage,
//     "#home": loadHomePage,
//     // "#signin": loadSignInForm,
//     // "#signup": loadSignUpForm,
//     "#game": loadGamePage,
//     // "#profile": loadProfilePage,
// };
//
// export async function handleRouting() {
//     await configureDependencies();
//     const hash = location.hash;
//     getPersistenceService();
//     if (hash.startsWith("#profile/")) {
//         const username = hash.split("/")[1];
//         if (!username) {
//             loadHomePage();
//             logoutCallback();
//             return;
//         }
//         loadProfilePage(username);
//         logoutCallback();
//         return;
//     }
//
//     const route = routes[hash] || loadHomePage;
//     route();
//     logoutCallback();
// }