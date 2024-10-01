import Router from '../../router.js';
import {
	displayFieldError,
	displaySuccess,
	displayError,
	authActions
} from '../../utils/auth.js'

import {passResetActions} from '../../utils/passReset.js'

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

							displayError("Token :" + errorData.token[0]);
						}
						if (errorData.email) {
							displayError("Email: " + errorData.email[0])
						}
						throw new Error();

					});
				}
				return response.json();
			})
			.then(data => {
				displaySuccess(data.detail);
				setTimeout(() => { window.location.hash = "login"; }, 1000);
			})
			.catch(error => {
				if (error != "Error")
					displayError(error);
			});
	});
}

export function ResetPasswordConfirmActions(email) {
	authActions();
	passResetActions(email)
	handleConfirmResetFormSubmission(email);
}