import { showAlert } from "../../utils/js/auth.js";
import { logoutFetch } from "../../utils/js/utils.js";
import { SendMessage } from "../Chat/js/homeSocket.js";
import { sendToBackend } from "../Chat/script.js";
import { drawtheLevel, matchHistory } from "../Home/script.js";
import { countries } from "../Settings/script.js";

function getProfileData(id){

    if (id == null) {
        showAlert('error', 'Profile not found');
        window.location.hash = "#home";
        return ;
    }

    fetch(`api/profiles/${id}/`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                logoutFetch()
    			.catch(() => {});
				throw new Error("User is not authenticated");
            }
            return response.json()
            .then(errorData => {
                if (errorData.detail)
                    throw new Error(errorData.detail);
                throw new Error('Profile not found');
            });
        }
        return response.json();
    })
    .then(data => {
        setProfileData(data)
    })
    .catch((error) => {
        showAlert('error', error);
        window.location.hash = "#home";
    });
}

function handlleBtn(data){
    const btnFriend = document.querySelector(".profile-btn .btn-follow");

    if (data.is_friend === true){
        btnFriend.setAttribute("id", "message");
        btnFriend.innerHTML = "Send Message";
    }
    else {
        if (data.state_request === "request_sended"){
            btnFriend.setAttribute("id", data.state_request);
            btnFriend.innerHTML = "Cancel request";
        }
        else if (data.state_request === "request_received"){
            btnFriend.setAttribute("id", data.state_request);
            btnFriend.innerHTML = "Confirm request";
        }
        else {
            btnFriend.setAttribute("id", "add_friend");
            btnFriend.innerHTML = "Add friend";
        }
    }

    btnFriend.addEventListener('click', () => {
        const request = btnFriend.getAttribute("id");
        if (request === "message")
            SendMessage(data.username);
        else if (request === "request_sended"){
            console.log(request);

        }
        else if (request === "request_received"){
            console.log(request);
        }
        else {
            btnFriend.setAttribute("id", data.state_request);
            btnFriend.innerHTML = "Cancel request";
            sendToBackend(data.username, "addFrindship", "");
        }
    });
}

function setProfileData(data){

    const gamingProfits = document.querySelector(".gaming-profits");
    gamingProfits.querySelector("#total-play span").innerHTML = `${data.losses + data.wins}`;
    gamingProfits.querySelector("#winning span").innerHTML = `${data.wins}`;
    gamingProfits.querySelector("#losses span").innerHTML = `${data.losses}`;

    const country = countries.find(c => c.value === data.country_select);
    const userContent = document.querySelector(".user-content");
    userContent.querySelector(".avatar").innerHTML = `<img src="${data.avatar}" alt="${data.username}">`;
    userContent.querySelector(".lvl-xp").innerHTML = `${data.level}.${data.exp} xp`;
    userContent.querySelector("#fullName-profile").innerHTML = `
        <div class="div-profile-info">
            <p>${data.first_name} ${data.last_name}</p>
            <span>${data.username}</span>
        </div>`;
    userContent.querySelector("#location-profile span").innerHTML = `${country.text}`;
    
    // profile btn
    handlleBtn(data);

    const spinner = document.querySelector(".image-content #spinner");
	spinner.attributes.level_data.value = data.exp;
    drawtheLevel(spinner);

    matchHistory(data.game_history, data.avatar);
}

export function profileActions(id) {
    getProfileData(id);
}