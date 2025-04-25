const mainWrapper = document.getElementById("wrapper") as HTMLElement | null;

function loadTemplate(templateId: string, title: string) {
	if (!mainWrapper)
		return;
	const template = document.getElementById(templateId) as HTMLTemplateElement;
	if (!template) {
		console.warn(`Template "${templateId}" not found.`);
		return;
	}
	const clone = template.content.cloneNode(true);
	mainWrapper.innerHTML = '';
	mainWrapper.appendChild(clone);
	document.title = title;
	location.hash = `#${templateId.split('-')[0]}`;
}

function loadHomePage() {
	loadTemplate("home-template", "Welcome to Pong!");
	initWipeText();
}

function loadSignInForm() {
	loadTemplate("signin-template", "Sign In");
}
function loadSignUpForm() {
	loadTemplate("signup-template", "Sign Up");
}

function loadGamePage() {
	loadTemplate("game-template", "Pong Game");
	initializePongGame();
}

function loadProfilePage() {
	loadTemplate("profile-template", "Pong Profile");
	initProfileData();
}

const routes: { [key: string]: () => void } = {
	"#": loadHomePage,
	"#home": loadHomePage,
	"#signin": loadSignInForm,
	"#signup": loadSignUpForm,
	"#game": loadGamePage,
	"#profile": loadProfilePage,
};

function handleRouting() {
	const route = routes[location.hash] || loadHomePage;
	route();
}

window.addEventListener("DOMContentLoaded", handleRouting);
window.addEventListener("hashchange", handleRouting);
