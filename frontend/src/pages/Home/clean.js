import {
    logout,
    mainActions
} from '../../utils/auth.js';
import {
    displayFieldError,
    displaySuccess,
    displayError,
    authActions
} from '../../utils/auth.js';
import {
    getCookie
} from '../../utils/utils.js';

// Handle logout
function handleLogoutBtn() {
    document.getElementById('logout').addEventListener('click', () => {
        fetch('api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.non_field_errors ? errorData.non_field_errors[0] : 'Handled HTTP error');
                });
            }
            return response.json();
        })
        .then(() => {
            displaySuccess('Logout successful!');
            logout();
            setTimeout(() => window.location.hash = '#login', 1000);
        })
        .catch(error => {
            displayError(error.message);
            logout();
            setTimeout(() => window.location.hash = '#login', 1000);
        });
    });
}

// Close 2FA modal
function close2fa() {
    document.querySelector(".close2fa").addEventListener("click", () => {
        console.log("close");
        document.querySelector(".active2fa").classList.add("d-none");
    });
}

// Generate QR Code for 2FA
function generateQrCode() {
    const qrCodeContainer = document.getElementById("qr-code");

    if (qrCodeContainer.querySelector("img")) return;

    const data = localStorage.getItem('authTokens');
    if (data) {
        const accessToken = JSON.parse(data).access;
        fetch('api/2fa/generate_qr_code/', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.non_field_errors ? errorData.non_field_errors[0] : 'Handled HTTP error');
                });
            }
            return response.blob();
        })
        .then(svgData => {
            let img = document.createElement("img");
            img.src = URL.createObjectURL(svgData);
            img.alt = "QR Code";
            qrCodeContainer.append(img);
        })
        .catch(error => displayError(error.message));
    }
}

// Handle input effects for 2FA key input fields
function numbersInputsEffect(inputs) {
	inputs[0].addEventListener("paste", function(event) {
		event.preventDefault();

		const pastedValue = (event.clipboardData || window.clipboardData).getData(
			"text"
		);
		const numbersLength = inputs.length;

		for (let i = 0; i < numbersLength; i++) {
			if (i < pastedValue.length) {
				inputs[i].value = pastedValue[i];
				inputs[i].removeAttribute("disabled");
				inputs[i].focus;
			} else {
				inputs[i].value = "";
				inputs[i].focus;
			}
		}
	});

	inputs.forEach((input, index1) => {
		input.addEventListener("keyup", (e) => {
			const currentInput = input;
			const nextInput = input.nextElementSibling;
			const prevInput = input.previousElementSibling;

			if (currentInput.value.length > 1) {
				currentInput.value = "";
				return;
			}

			if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
				nextInput.removeAttribute("disabled");
				nextInput.focus();
			}

			if (e.key === "Backspace") {
				inputs.forEach((input, index2) => {
					if (index1 <= index2 && prevInput) {
						input.setAttribute("disabled", true);
						input.value = "";
						prevInput.focus();
					}
				});
			}
		});
	});
}

// Handle 2FA key verification
function handle2faAction(inputs, btn) {
    const verify2faKey = document.getElementById("verify2faKey");
    
    function handleClick() {
        document.querySelector(".active2fa").classList.remove("d-none");
    }

    verify2faKey.addEventListener("click", () => {
        const key = [...inputs].map(input => input.value).join('');
        const data = { key };

        const localData = localStorage.getItem('authTokens');
        if (localData) {
            const accessToken = JSON.parse(localData).access;
            fetch('api/2fa/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.key ? `Error: ${errorData.key[0]}` : errorData.message || 'Handled HTTP error');
                    });
                }
                return response.json();
            })
            .then(data => {
                displaySuccess(data.message);
                mode2faDisactive(btn);
                btn.removeEventListener('click', handleClick);
                document.querySelector(".active2fa").classList.add("d-none");
            })
            .catch(error => displayError(error.message));
        }
    });

    btn.addEventListener('click', handleClick);
}

// Enable 2FA mode
function mode2faActive(btn) {
    const inputs = document.querySelectorAll(".numbers-field > input");

    generateQrCode();
    numbersInputsEffect(inputs);
    handle2faAction(inputs, btn);
}

// Disable 2FA mode
function mode2faDisactive(btn) {
    document.querySelector(".active2faIcon").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75ZM12.7682 7.39018C13.1218 6.96591 13.0645 6.33534 12.6402 5.98178C12.2159 5.62821 11.5853 5.68554 11.2318 6.10982L8.88382 8.92736C8.53711 9.34342 8.34219 9.57377 8.18658 9.71531L8.18063 9.72069L8.17422 9.71587C8.00643 9.589 7.79146 9.37725 7.4085 8.99428L6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L5.99428 10.4085L6.03511 10.4493C6.3616 10.776 6.6757 11.0902 6.96794 11.3111C7.2953 11.5587 7.72402 11.7915 8.27343 11.7665C8.82284 11.7416 9.22872 11.471 9.53233 11.1948C9.80337 10.9483 10.0877 10.6069 10.3833 10.2521L10.3833 10.2521L10.4203 10.2077L12.7682 7.39018Z" fill="#96C346"/></svg>
    `;
    btn.classList.add("activeBtn");
    btn.innerHTML = "Disable 2FA";

    function handleClick() {
        const localData = localStorage.getItem('authTokens');
        if (localData) {
            const accessToken = JSON.parse(localData).access;
            const data = { is2faActive: false };
            
            fetch('api/user/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.is2faActive[0] || 'Handled HTTP error');
                    });
                }
                return response.json();
            })
            .then(() => {
                document.querySelector(".active2faIcon").innerHTML = "";
                btn.classList.remove("activeBtn");
                btn.innerHTML = "Enable 2FA";
                mode2faActive(btn);
                displaySuccess('2FA Disabled');
                
                btn.removeEventListener('click', handleClick);
            })
            .catch(
                error => {
                    displayError(error.message)
                    console.log(error);
                }
            );
        }
    }

    btn.addEventListener('click', handleClick);
}

// Initialize 2FA based on the current user status
function twoFactorAuth() {
    const data = localStorage.getItem('authTokens');
    close2fa();
    if (data) {
        const accessToken = JSON.parse(data).access;

        fetch('api/user/', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.log(errorData);
                    throw new Error(errorData.code ? errorData.code : 'Handled HTTP error');
                });
            }
            return response.json();
        })
        .then(userData => {
            const btn = document.querySelector("#enable2fa");
            userData.is2faActive ? mode2faDisactive(btn) : mode2faActive(btn);
        })
        .catch (
            error => {
                if (error.message == "token_not_valid") {
                    logout();
                    setTimeout(() => { window.location.hash = '#login'; }, 1000);
                }
                displayError(error.message);
            }
        );
    }
}

// Main action functions
export function homeActions() {
    mainActions();
    handleLogoutBtn();
    twoFactorAuth();
}
