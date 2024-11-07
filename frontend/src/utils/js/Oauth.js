import { login, showAlert } from "./auth.js";

function ouathAction(url, authCode) {
    var oauthPromise = new Promise(function(resolve, reject){
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'code' : authCode })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    if (errorData.non_field_errors) reject(errorData.non_field_errors[0]);
                    reject('Failed to authenticate');
                });
            }
            resolve(response.json());
        })
    });
    oauthPromise
    .then(data => {
        if (data.user.is2faActive) TwoFactorAuth(data);
        else {
            showAlert('success', 'Login successful!'); 
            login(data);
        }
    })
    .catch(error => showAlert('error', error))
}

function handleOauth2() {
    var host = window.location.host;

    function openNewTab(oauthUrl) {
        const authWindow = window.open(oauthUrl, '_blank', 'width=500,height=600');
        const urls = {
            'intra': 'api/login/intra/',
            'google': 'api/login/google/'
        };

        function handleAuthMessage(event) {
            if (event.origin === window.location.origin) {
                const data = event.data;
                if (data && data.code && data.provider) {
                    ouathAction(urls[data.provider], data.code);
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

export {
    handleOauth2,
}