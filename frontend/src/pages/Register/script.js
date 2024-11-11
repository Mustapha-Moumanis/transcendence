import { handleOauth2 } from '../../utils/js/Oauth.js';
import { displayFieldError, showAlert, authActions} from '../../utils/js/auth.js'

function handleRegisterFormSubmission() {
    document.getElementById('form_register').addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById("send_message");
        btn.setAttribute('disabled', "");

        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const rePassword = document.getElementById('re-password');

        const data = {
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            password1: password.value,
            password2: rePassword.value,
        };
        var registerPromise = new Promise(function(resolve, reject){
            fetch('api/register/', {
                method: 'POST',
                credentials: "omit",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        if (errorData.first_name) displayFieldError(firstName.parentElement, errorData.first_name[0]);
                        if (errorData.last_name) displayFieldError(lastName.parentElement, errorData.last_name[0]);
                        if (errorData.email) displayFieldError(email.parentElement, errorData.email[0]);
                        if (errorData.password1) displayFieldError(password.parentElement, errorData.password1[0]);
                        if (errorData.password2) displayFieldError(rePassword.parentElement, errorData.password2[0]);
                        if (errorData.non_field_errors) reject(errorData.non_field_errors[0]);
                        reject("Failed to register");
                    });
                }
                resolve(response.json());
            })
        });

        registerPromise
        .then(() => {
            showAlert('success', 'Registration successful!');
            window.location.hash = "login";
        })
        .catch(error => showAlert('error', error));
        setTimeout(() => {
			btn.removeAttribute('disabled');
		}, 1000);
    });
}

export function registerActions() {
    authActions();
    handleRegisterFormSubmission();
    handleOauth2();
}