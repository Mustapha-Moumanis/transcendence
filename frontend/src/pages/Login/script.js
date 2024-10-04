import { login } from '../../utils/js/auth.js'
import { displayFieldError, displaySuccess, displayError, authActions} from '../../utils/js/auth.js'
import TwoFactorAuth from '../TwoFactorAuth/TwoFactorAuth.js'
import { startSocket, sendToBackend, startChat } from '../chat/js/socket.js'

function handleLoginFormSubmission() {
    document.getElementById('form_login').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name');
        const password = document.getElementById('password');

        const data = {
            username: name.value,
            password: password.value
        };

        if (data.username === "") {
            displayFieldError(name.parentElement, 'Must include either "username" or "email" and "password".');
        } else if (data.password === "") {
            displayFieldError(password.parentElement, 'Password: This field may not be blank.');
        }
        else {
            fetch('api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response)
                    return response.json().then(errorData => {
                        if (errorData.non_field_errors) {
                            throw new Error(errorData.non_field_errors[0]);
                        } else if (errorData.password) {
                            throw new Error("Password: " + errorData.password[0]);
                        }
                        throw new Error('Handled HTTP error');
                    });
                }
                return response.json();
            })
            .then(data => {

                if (data.user.is2faActive)
                    TwoFactorAuth(data);
                else {
                    displaySuccess('Login successful!');
                    login(JSON.stringify(data))
                    // setCookie('my-token', data.access, 30);
                    // setCookie('my-refresh-token', data.refresh, 30);
                    startSocket();
                    setTimeout(() => {
                        // Router("home");
                        window.location.hash = '#home';
                    }, 1000);
                }
            })
            .catch(error => {
                displayError(error.message);
            });
        }
    });
};

export function loginActions() {
    authActions();
    handleLoginFormSubmission();
}