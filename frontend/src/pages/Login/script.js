import { login } from '../../utils/js/auth.js'
import { displayFieldError, showAlert, authActions} from '../../utils/js/auth.js'
import { deleteCookie } from '../../utils/js/utils.js';
import TwoFactorAuth from '../TwoFactorAuth/TwoFactorAuth.js'
// import { startSocket, sendToBackend, startChat } from '../chat/js/socket.js'


function intra(authCode) {
    var intraPromise = new Promise(function(resolve, reject){
        fetch('api/login/intra/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'code' : authCode })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    if (errorData.non_field_errors) reject(errorData.non_field_errors[0]);
                    reject('Failed to authenticate with intra provider');
                });
            }
            resolve(response.json());
        })
    });
    intraPromise
    .then(data => {
        if (data.user.is2faActive) TwoFactorAuth(data);
        else {
            showAlert('success', 'Login successful!');
            login(data);
            window.location.hash = '#home';
        }
    })
    .catch(error => showAlert('error', error))
}

function google(authCode) {
    var googlePromise = new Promise(function(resolve, reject){
        fetch('api/login/google/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'code' : authCode })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    if (errorData.non_field_errors) reject(errorData.non_field_errors[0]);
                    reject('Failed to authenticate with google provider');
                });
            }
            resolve(response.json());
        })
    });
    googlePromise
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

function handleOauth2() {
    var host = window.location.host;

    function openNewTab(oauthUrl) {
        const authWindow = window.open(oauthUrl, '_blank', 'width=500,height=600');
        const Providers = {
            'intra': intra,
            'google': google
        };

        function handleAuthMessage(event) {
            if (event.origin === window.location.origin) {
                const data = event.data;
                if (data && data.code && data.provider) {
                    const provider = Providers[data.provider];
                    provider(data.code);
                    window.removeEventListener('message', handleAuthMessage);
                }
            }
        }
        window.addEventListener('message', handleAuthMessage, false);
    }

    function intraURL() {
        const clientID = "u-s4t2ud-dc782f818e4b68182ef6e2bbe84525bc3da2a32699442a01404957fd86af7eee";
        const redirectUri = `http://${host}/utils/redirect/intra.html`;
        const oauthUrl = `https://api.intra.42.fr/oauth/authorize?` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` + 
            `client_id=${clientID}`
        
        openNewTab(oauthUrl);
    }
    
    function googleURL() {
        const clientID = "160581963104-mln52d9gsik1ue1l52c420b854q6vi47.apps.googleusercontent.com";
        const redirectUri = `http://${host}/utils/redirect/google.html`;
        const oauthUrl = `http://accounts.google.com/o/oauth2/v2/auth?` +
            `redirect_uri=${redirectUri}&` +
            `prompt=consent&response_type=code&` + 
            `client_id=${clientID}&`+ `scope=openid%20email%20profile&access_type=offline`;
        
        openNewTab(oauthUrl);
    }

    document.getElementById('intraBtn').addEventListener('click', intraURL);
    document.getElementById('googleBtn').addEventListener('click', googleURL);
}

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