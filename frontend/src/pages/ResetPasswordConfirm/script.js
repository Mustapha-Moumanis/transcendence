import Router from '../../router.js';
import {
	displayFieldError,
	showAlert,
	authActions
} from '../../utils/js/auth.js'

function passResetActions(email) {
	const inputs = document.querySelectorAll(".numbers-field > input");
	const button = document.querySelector(".btn-main");
	const pass = document.querySelector("#password");
	const re_pass = document.querySelector("#re-password");
	const emailElem = document.querySelector(".email");

	window.addEventListener("load", () => inputs[0].focus());
	button.setAttribute("disabled", "disabled");
	emailElem.innerHTML = email

	const checkFields = () => {
		const allFieldsFilled = [...inputs].every(input => input.value !== "") && pass.value !== "" && re_pass.value !== "" && email.value !== "";

		if (allFieldsFilled) {
			button.classList.add("active");
			button.removeAttribute("disabled");
		} else {
			button.classList.remove("active");
			button.setAttribute("disabled", "disabled");
		}
	};

	pass.addEventListener("input", checkFields);
	re_pass.addEventListener("input", checkFields);

	inputs[0].addEventListener("paste", function(event) {
		event.preventDefault();

		const pastedValue = (event.clipboardData || window.clipboardData).getData("text");
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
			checkFields();
		});
	});
}

function handleConfirmResetFormSubmission(email) {
	document.getElementById('form_reset_password_confirm').addEventListener('submit', function(e) {
		e.preventDefault();
		const inputs = document.querySelectorAll(".numbers-field > input");
		const token = [...inputs].map(input => input.value).join('');
		const new_password1 = document.querySelector("#password");
		const new_password2 = document.querySelector("#re-password");

		const data = {
			token: token,
			email: email,
			new_password1: new_password1.value,
			new_password2: new_password2.value,
		};
		fetch('api/password/reset/confirm/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (!response.ok) {
					return response.json().then(errorData => {
						if (errorData.new_password1) {
							displayFieldError(new_password1.parentElement, errorData.new_password1[0]);
						}
						if (errorData.new_password2) {
							displayFieldError(new_password2.parentElement, errorData.new_password2[0]);
						}
						if (errorData.token) {

							showAlert('error', "Token :" + errorData.token[0]);
						}
						if (errorData.email) {
							showAlert('error', "Email: " + errorData.email[0])
						}
						throw new Error();

					});
				}
				return response.json();
			})
			.then(data => {
				showAlert('success', data.detail);
				setTimeout(() => { window.location.hash = "login"; }, 1000);
			})
			.catch(error => {
				// if (error != "Error")
				// 	showAlert('error', error);
			});
	});
}

export function ResetPasswordConfirmActions(email) {
	authActions();
	passResetActions(email)
	handleConfirmResetFormSubmission(email);
}