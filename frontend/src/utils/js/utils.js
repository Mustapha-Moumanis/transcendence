import { logout, showAlert, attachRouterListeners, checkToken } from './auth.js'
import { themeAction } from './theme.js'
import { startSocket } from '../../pages/Chat/js/socket.js'
import { startSearchAndNotif } from '../../pages/Chat/js/homeSocket.js';

export async function loadHTML(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to load HTML: ${response.statusText}`);
		}
		return await response.text();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export function loadCSS(urls) {
	urls.forEach(url => {
		if (document.querySelector(`link[href="${url}"]`)) return;

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;
		document.head.appendChild(link);
	});
}

export function loadJS({ url, defer = false, type = 'text/javascript' }) {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${url}"]`)) {
			console.log("Script already exists:", url);
			resolve();  // Resolve immediately if the script is already loaded
			return;
		}

		const script = document.createElement('script');
		script.src = url;
		script.defer = defer;
		script.type = type;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
		document.body.appendChild(script);
	});
}

export function removeAllCSS() {
	const links = document.querySelectorAll('link[rel="stylesheet"]');
	const list = [
		'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
		'./utils/css/style.css',
		'./utils/css/variables.css',
	];

	links.forEach(link => {
		if (!list.includes(link.getAttribute('href')))
			link.parentNode.removeChild(link);
	});
}

export function removeAllJS() {
	const scripts = document.querySelectorAll('script');
	scripts.forEach(script => script.parentNode.removeChild(script));
}

export function showLoading(position) {
	const loadingBox = document.createElement('div');
	loadingBox.id = "loading";
	loadingBox.appendChild(document.createElement("span"));
	document.querySelector(position).appendChild(loadingBox);
}

export function hideLoading() {
	setTimeout(() => {
		const loadingElement = document.getElementById('loading');
		if (loadingElement) {
			loadingElement.remove();
		}
	}, 1500)
}

export function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

export function deleteCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function debounce(func, delay) {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

export function logoutFetch() {
	return new Promise((resolve, reject) => {
		logout();
		fetch('api/logout/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => {
			// reject('testing logout fetching!!!');
			if (!response.ok) {
				return response.json().then(errorData => {
					if (errorData.non_field_errors)
						reject(errorData.non_field_errors[0]);
					reject('An error occurred while logging out. Please try again.');
				});
			}
			resolve(response.json());
		})
	});
	// .then(() => showAlert('success', 'You have been successfully logged out!'))
	// .catch(error => showAlert('error', error.message))
	// .finally(() => logout())
};

export function handleLogoutBtn() {
	document.getElementById('logout').addEventListener('click', function (e) {
		logoutFetch()
		.then(() => showAlert('success', 'You have been successfully logged out!'))
		.catch(error => showAlert('error', error))
	});
};

function updateSidebar() {
	const currentHash = window.location.hash.slice(1);
	const buttons = document.querySelectorAll('.side-btns div');

	if (buttons) {
		buttons.forEach(button => {
			const dataRouter = button.getAttribute("data-router");
			if (dataRouter && dataRouter === currentHash) button.classList.add('active-btn');
			else button.classList.remove('active-btn');
		});
	}
}

export async function HomeEffects() {
	const root = document.getElementById('root');
	if (root.querySelector('.nav-bar') == null) {
		showLoading("body");
		checkToken();
		const nav = await loadHTML('../components/nav/navBar.html');
		const sidebar = await loadHTML('../components/sidebar/sidebar.html');

		var content = document.createElement("div");
		content.classList.add("content");

		var mainContent = document.createElement("div");
		mainContent.id = "home-content";
		mainContent.classList.add("home-content");

		content.innerHTML = sidebar;
		content.appendChild(mainContent);

		root.innerHTML = nav;
		root.appendChild(content);

		loadCSS(['./utils/css/bars.css']);

		setTimeout(() => {
			themeAction();
			handleLogoutBtn();
			attachRouterListeners();
			updateSidebar();
			startSocket();
			startSearchAndNotif();
		}, 0);

		const themeButton = document.querySelector('.themeButton');
		if (themeButton) themeButton.remove();
	}
	else {
		setTimeout(() => {
			showLoading("#home-content");
			updateSidebar();
		}, 0);
	}
}

export async function AuthEffects() {
	removeAllCSS();
	if (document.querySelector('.themeButton') == null) {
		const themeButtonContent = await loadHTML('../components/themeButton/themeButton.html');

		const btnContent = document.createElement('div');
		btnContent.innerHTML = themeButtonContent;

		document.body.appendChild(btnContent.firstElementChild);

		setTimeout(() => { themeAction(); }, 0);
	}
}