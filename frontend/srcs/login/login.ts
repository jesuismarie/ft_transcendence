const container = document.getElementById('container') as HTMLElement;
const registerBtn = document.getElementById('register') as HTMLButtonElement;
const loginBtn = document.getElementById('login') as HTMLButtonElement;

registerBtn.addEventListener('click', () => {
	container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
	container.classList.remove('active');
});