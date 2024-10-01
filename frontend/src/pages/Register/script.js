import { displayFieldError, displaySuccess, displayError, authActions} from '../../utils/auth.js'

function handleRegisterFormSubmission() {
    document.getElementById('form_register').addEventListener('submit', function(e) {
        e.preventDefault();

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

        fetch('api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    if (errorData.first_name) { 
                        displayFieldError(firstName.parentElement, errorData.first_name[0]);
                    }
                    if (errorData.last_name) {
                        displayFieldError(lastName.parentElement, errorData.last_name[0]);
                    }
                    if (errorData.email) {
                        displayFieldError(email.parentElement, errorData.email[0]);
                    }
                    if (errorData.password1) {
                        displayFieldError(password.parentElement, errorData.password1[0]);
                    }
                    if (errorData.password2) {
                        displayFieldError(rePassword.parentElement, errorData.password2[0]);
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
            displaySuccess('Registration successful!');
            setTimeout(() => { window.location.hash = "login"; }, 1000);
        })
        .catch(error => {
            if (error != "Error")
                displayError(error);
        });
    });
}

export function registerActions() {
    authActions();
    handleRegisterFormSubmission();
}