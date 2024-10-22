import { handleOauth2 } from '../../utils/js/Oauth.js';
import { displayFieldError, showAlert, authActions, login} from '../../utils/js/auth.js'
import { deleteCookie } from '../../utils/js/utils.js';
import TwoFactorAuth from '../TwoFactorAuth/TwoFactorAuth.js'
// import { startSocket, sendToBackend, startChat } from '../chat/js/socket.js'

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
            var loginPromise = new Promise(function(resolve, reject){
                fetch('api/login/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            if (errorData.non_field_errors) reject(errorData.non_field_errors[0]);
                            else if (errorData.password) reject("Password: " + errorData.password[0]);
                            reject('Failed to login');
                        });
                    }
                    resolve(response.json());
                })
            });

            loginPromise
            .then(data => {
                if (data.user.is2faActive) TwoFactorAuth(data);
                else {
                    showAlert('success', 'Login successful!');
                    login(data);
                    window.location.hash = '#home';
                }
            })
            .catch(error => showAlert('error', error));
        }
    });
};

export function loginActions() {
    authActions();
    handleLoginFormSubmission();
    handleOauth2();
}