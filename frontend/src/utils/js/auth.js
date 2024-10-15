import { chatSocket } from '../../pages/Chat/js/socket.js';
import { setmyIntervalID, myIntervalID } from '../../router.js';
import { showLoading, hideLoading, HomeEffects, setCookie, getCookie, deleteCookie } from './utils.js';
import { debounce } from './utils.js';

function isAuthenticated() {
    const userInfo = localStorage.getItem('authTokens');
    const token = getCookie('my-token');
    const refreshToken = getCookie('my-refresh-token');

    return !!userInfo && !!token && !!refreshToken;
}

function clearTokenCheckInterval() {
    if (myIntervalID) {
        clearInterval(myIntervalID);
        setmyIntervalID(null);
    }
}

function getUserData() {
    return new Promise(function(resolve, reject){
        var token = getCookie('my-token');
    
        fetch('api/user/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    if (errorData.non_field_errors)
                        reject(errorData.non_field_errors[0]);
                    else if (errorData.code)
                        reject(errorData.code);
                    reject('Can\'t get user data');
                })
            }
            resolve(response.json());
        })
    })
} 

function verifyRefreshToken(refresh) {
    return new Promise(function(resolve, reject){
        const data = { refresh };
        
        fetch("/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.json()
                    .then(errorData => {
                        if (errorData.detail) {
                            reject(errorData.detail);
                        }
                        reject('Invalid token');
                    }
                );
            }
            return response.json();
        })
        .then (data => {
            if (data) {
                setCookie('my-token', data.access);
                resolve();
            }
            reject('Have no access');
        })
    })
}

function verifyToken(token, refresh) {
    return new Promise(function(resolve, reject){
        const data = { token };
        
        fetch("/api/token/verify/", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.json()
                    .then(() => {
                        verifyRefreshToken(refresh)
                        .then (() => {
                            resolve();
                        })
                        .catch (error => {
                            if (error.detail) {
                                reject(error.detail);
                            }
                            reject('Invalid token');
                        })
                    }
                );
            }
            resolve();
        })
    })
}

function checkToken() {
    const refreshToken = getCookie('my-refresh-token');
    if (refreshToken){
        verifyRefreshToken(refreshToken)
        .then(() => {
            if (!myIntervalID) setmyIntervalID(setInterval(checkToken, 25*60*1000));
        })
        .catch (error => {
            showAlert('error', error);
            logout();
            return false;
        })
    }
    else logout();
}

window.addEventListener('beforeunload', () => {
    clearTokenCheckInterval();
});

function login(authTokens) {
    localStorage.setItem('authTokens', JSON.stringify(authTokens));
    setCookie('my-token', authTokens.access, 30);
    setCookie('my-refresh-token', authTokens.refresh, 30);
}

function logout() {
    chatSocket.close();
    localStorage.removeItem('authTokens');
    deleteCookie('my-token');
    deleteCookie('my-refresh-token');
    clearTokenCheckInterval();
    window.location.hash = "#login";
}

function showAlert(type, message) {
    let alertContainer = document.getElementById('alert-container');
    
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        document.body.appendChild(alertContainer);
    }

    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box', type);

    var title = 'Success Message';
    var icon =  `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"/>
        </svg>
    `;
    if (type == 'error') {
        title = 'Error Message';
        icon = `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 15H13V17H11V15ZM11 7H13V13H11V7ZM11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" />
            </svg>
        `;
    }
    const alertContent = `
        <div class="alert-content">
            <div class="alert-icon">
                ${icon}
            </div>
            <div class="alert-message">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="alert-close">&#10005;</div>
        </div>
    `;

    alertBox.innerHTML = alertContent;

    alertContainer.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('show');
    }, 100);

    const closeBtn = alertBox.querySelector('.alert-close');
    closeBtn.addEventListener('click', function () {
        closeAlert(alertBox);
    });

    setTimeout(() => {
        closeAlert(alertBox);
    }, 5000);
}

function closeAlert(alertElement) {
    alertElement.classList.remove('show');
    setTimeout(() => {
        alertElement.remove();
    }, 300);
}

function displayFieldError(element, message) {
    if (!element.classList.contains("has-error")) {
        let span = document.createElement('span');
        element.classList.add("has-error");
        if (message) {
            span.innerHTML = message;
            span.classList.add("error-block");
            element.appendChild(span);
        }
    }
}

function removeFieldError(element) {
    if (element.parentElement.classList.contains("has-error"))
        element = element.parentElement;
    if (element.classList.contains("has-error")) {
        element.classList.remove("has-error");
        element.querySelector(".error-block").remove();
        var inputs = element.querySelectorAll(".form-control");
        inputs.forEach((input, index) => {
			input.value = "";
			if (index == 0) input.focus();
			else input.disabled = true;
		});
    }
}

function attachInputFocusListeners() {
    var inputs = document.querySelectorAll(".form-control");
    inputs.forEach(input => {
        input.addEventListener("focus", () => removeFieldError(input.parentElement));
    });
}

export function attachRouterListeners() {
    const elementsWithRouter = document.querySelectorAll('[data-router]');
    
    elementsWithRouter.forEach(element => {
        element.addEventListener('click', (event) => {
            const parentElement = element.parentElement;

            if (!parentElement.classList.contains('disabled')) {
                const routerValue = element.getAttribute('data-router');
                parentElement.classList.add('disabled');

                elementsWithRouter.forEach(btn => btn.classList.remove('active-btn'));
                element.classList.add('active-btn');

                window.location.hash = routerValue;

                debounce(() => {
                    parentElement.classList.remove('disabled'); 
                }, 350)();
            }
        });
    });
}

// import { themeAction, } from './theme.js';
function authActions() {
    // showLoading("body");
    // themeAction();
    attachInputFocusListeners();
    attachRouterListeners();
    // hideLoading();
}

async function mainActions() {
    // window.location.hash = "#game";
    attachInputFocusListeners();
    // await HomeEffects();
}

export {
    isAuthenticated,
    login,
    logout,
    showAlert,
    displayFieldError,
    removeFieldError,
    mainActions,
    authActions,
    getUserData,
    checkToken,
    verifyToken,
    attachInputFocusListeners,
}