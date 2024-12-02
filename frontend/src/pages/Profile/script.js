import { showAlert } from "../../utils/js/auth.js";
import { SendMessage, blockClick, removeNotif, reqConfirm } from "../Chat/js/homeSocket.js";
import { logoutFetch } from "../../utils/js/utils.js";
import { sendToBackend } from "../Chat/script.js";
import { drawtheLevel, matchHistory, TournamentHistory } from "../Home/script.js";
import { countries } from "../Settings/script.js";

var profileId;

export function profileBtnState(btn, attribute, btnState, data){

    if (profileId == data.username && document.querySelector(".main-profile")) {
        if (btn === "follow"){
            const btnFriend = document.querySelector(".profile-btn .btn-follow");
            btnFriend.setAttribute("id", attribute);
            btnFriend.innerHTML = btnState;
        }
        else
            window.location.hash = "#home";
    }
}

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
        setProfileData(data);
    })
    .catch((error) => {
        showAlert('error', error);
        window.location.hash = "#home";
    });
}

function handlleBtn(data){

    const btnBlock = document.querySelector(".profile-btn .btn-block");
    btnBlock.addEventListener('click', () => blockClick(data.username));

    const btnFriend = document.querySelector(".profile-btn .btn-follow");
    if (data.is_friend === true){
        btnFriend.setAttribute("id", "message");
        btnFriend.innerHTML = "Send Message";
    }
    else {
        if (data.state_request === "request_sended"){
            btnFriend.setAttribute("id", data.state_request);
            btnFriend.innerHTML = "Cancel Request";
        }
        else if (data.state_request === "request_received"){
            btnFriend.setAttribute("id", data.state_request);
            btnFriend.innerHTML = "Confirm Request";
        }
        else {
            btnFriend.setAttribute("id", "add_friend");
            btnFriend.innerHTML = "Add Friend";
        }
    }

    btnFriend.addEventListener('click', () => {
        const request = btnFriend.getAttribute("id");
        if (request === "message")
            SendMessage(data.username);
        else if (request === "request_sended"){
            btnFriend.setAttribute("id", "add_friend");
            btnFriend.innerHTML = "Add Friend";
            sendToBackend(data.username, "reqDelete", "");
            removeNotif(data.username, ".notification-user-card");
        }
        else if (request === "request_received"){
            sendToBackend(data.username, "reqConfirm", "");
            reqConfirm(data);
            btnFriend.setAttribute("id", "message");
            btnFriend.innerHTML = "Send Message";
        }
        else {
            sendToBackend(data.username, "addFrindship", "");
            btnFriend.setAttribute("id", "request_sended");
            btnFriend.innerHTML = "Cancel Request";
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

    handlleBtn(data);

    const spinner = document.querySelector(".image-content #spinner");
	spinner.attributes.level_data.value = data.level;
	spinner.attributes.exp_data.value = data.exp;
    drawtheLevel(spinner);

    matchHistory(data.game_history, data.avatar);
    console.log(data);
    // TournamentHistory();
}

export function profileActions(id) {
    profileId = id;
    getProfileData(id);
}