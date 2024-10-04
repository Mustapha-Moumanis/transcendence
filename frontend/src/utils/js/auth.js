import { showLoading, hideLoading, HomeEffects } from './utils.js';

function isAuthenticated() {
    return !!localStorage.getItem('authTokens');
}

function login(authTokens) {
    localStorage.setItem('authTokens', authTokens);
}
  
function logout() {
    localStorage.removeItem('authTokens');
}

function displayError(message) {
    let success = document.querySelector(".success");
    let faild = document.querySelector(".error");

    success.style.display = "none";
    success.style.opacity = "0"; 

    faild.innerHTML = message;
    faild.style.display = "block"; 
    faild.style.opacity = "1";

    setTimeout(() => {
        faild.style.opacity = "0"; 

        setTimeout(() => {
            faild.style.display = "none";
        }, 500);
    }, 5000);
}

function displaySuccess(message) {
    let success = document.querySelector(".success");
    let faild = document.querySelector(".error");

    faild.style.display = "none";
    faild.style.opacity = "0";

    success.innerHTML = message;
    success.style.display = "block"; 
    success.style.opacity = "1";

    setTimeout(() => {
        success.style.opacity = "0";

        setTimeout(() => {
            success.style.display = "none";
        }, 500);
    }, 5000);
}

function displayFieldError(element, message) {
    if (!element.classList.contains("has-error")) {
        let span = document.createElement('span');
        span.innerHTML = message;
        span.classList.add("error-block");
        element.classList.add("has-error");
        element.appendChild(span);
    }
}

function removeFieldError(input) {
    if (input.classList.contains("has-error")) {
        input.classList.remove("has-error");
        input.removeChild(input.children[2]);
    }
}

function attachInputFocusListeners() {
    var inputs = document.querySelectorAll(".form-control");
    inputs.forEach(input => {
        input.addEventListener("focus", () => removeFieldError(input.parentElement));
    });
}

function attachRouterListeners() {
    var routerElements = document.getElementsByClassName('router');
    for (let i = 0; i < routerElements.length; i++) {
        routerElements[i].addEventListener('click', function(e) {
            let page = e.currentTarget.getAttribute("data-router");
            console.log(page);
            window.location.hash = page;
            // Router(page);
        });
    }
}
// import { themeAction, } from './theme.js';
function authActions() {
    // showLoading();
    // themeAction();
    attachInputFocusListeners();
    attachRouterListeners();
    // hideLoading();
}

async function mainActions() {
    await HomeEffects();
}

export {
    isAuthenticated,
    login,
    logout,
    displayError,
    displaySuccess,
    displayFieldError,
    removeFieldError,
    mainActions,
    authActions,
}