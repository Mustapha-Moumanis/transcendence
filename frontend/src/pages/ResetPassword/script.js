import {
	displayFieldError,
	showAlert,
	authActions
} from '../../utils/js/auth.js'

import ResetPasswordConfirm from '../ResetPasswordConfirm/ResetPasswordConfirm.js'

export function ResetPasswordPromise(email) {
	return new Promise(function(resolve, reject){
		const data = { email: email.value };
		fetch('api/password/reset/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(errorData => {
					if (errorData.email) displayFieldError(email.parentElement, errorData.email[0]);
					if (errorData.non_field_errors) reject(errorData.non_field_errors[0]);
					reject("You can not Reset your password");
				});
			}
			resolve(response.json());
		})
	});	
}

function handleResetFormSubmission() {
	document.getElementById('form_reset_password').addEventListener('submit', function(e) {
		e.preventDefault();
		const btn = document.getElementById("send_message");
        btn.setAttribute('disabled', "");
		const email = document.querySelector("#email");
        ResetPasswordPromise(email)
		.then(data => {
			showAlert('success', data.detail);
			ResetPasswordConfirm(email.value);
		})
		.catch(error => showAlert('error', error));
		setTimeout(() => {
			btn.removeAttribute('disabled');
		}, 1000);
	});
};

export function ResetPasswordActions() {
	authActions();
	handleResetFormSubmission();
}