import {
	displayFieldError,
	showAlert,
	authActions
} from '../../utils/js/auth.js'

import ResetPasswordConfirm from '../ResetPasswordConfirm/ResetPasswordConfirm.js'

function handleResetFormSubmission() {
	document.getElementById('form_reset_password').addEventListener('submit', function(e) {
		e.preventDefault();

		const email = document.querySelector("#email");

		const data = {
			email: email.value,
		};

		fetch('api/password/reset/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (!response.ok) {
					return response.json().then(errorData => {
						console.log(errorData)
						if (errorData.email) {
							displayFieldError(email.parentElement, errorData.email[0]);
						}
						if (errorData.non_field_errors) {
							throw new Error(errorData.non_field_errors[0]);
						}
						throw new Error();

					});
				}
				return response.json();
			})
			.then(data => {
				showAlert('success', data.detail);
				ResetPasswordConfirm(email.value);
			})
			.catch(error => {
				if (error != "Error")
					showAlert('error', error);
			});
	});

};

export function ResetPasswordActions() {
	authActions();
	handleResetFormSubmission();
}