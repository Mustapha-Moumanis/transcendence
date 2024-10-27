import { showAlert } from "../../utils/js/auth.js";
import { getCookie } from "../../utils/js/utils.js";
import { drawtheLevel } from "../Home/script.js";
import { countries } from "../Settings/script.js";

function getProfileData(id){

    if (id == null) {
        showAlert('error', 'Profile not found');
        window.location.hash = "#home";
        return ;
    }

    const token = getCookie('my-token');
    fetch(`api/profiles/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
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

function setProfileData(data){
    console.log(data);

    const country = countries.find(c => c.value === data.country_select);
    const userContent = document.querySelector(".user-content");

    userContent.querySelector("#fullName-profile").innerHTML = `
        <div class="div-profile-info">
            <p>${data.first_name} ${data.last_name}</p>
            <span>${data.username}</span>
        </div>`;

    userContent.querySelector("#location-profile span").innerHTML = `${country.text}`;
    const spinner = document.querySelector(".image-content #spinner");
	// spinner.attributes.level_data.value = data.exp;
    drawtheLevel(spinner);
}

export function profileActions(id) {
    console.log("id => ", id);
    getProfileData(id);
}