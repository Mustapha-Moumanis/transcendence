import { logout, mainActions } from '../../utils/js/auth.js'
import { displayFieldError, authActions } from '../../utils/js/auth.js'
import { getCookie } from '../../utils/js/utils.js'
import { user } from '../Chat/js/socket.js';

export function drawtheLevel(lvl, spinner) {

	let rootStyles = getComputedStyle(document.documentElement);
 	let color = rootStyles.getPropertyValue('--primary-color').trim();
	let bgcolor = rootStyles.getPropertyValue('--sub-color').trim();

	let ctx = spinner.getContext("2d");
	let width = spinner.width;
	let height = spinner.height;
	let degrees = 0;
	let new_degrees = (lvl/100)*280;
	let animation_loop;

	
	function drawArc(degrees) {
		ctx.clearRect(0, 0, width, height);
    
		ctx.beginPath();
		ctx.strokeStyle = bgcolor;
		ctx.lineWidth = 200;
		ctx.arc(width/2, width/2, 100, 0, Math.PI*2, false);
		ctx.stroke();
		let radians = degrees * Math.PI / 180;
    
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 200;
		ctx.arc(width/2, height/2, 100, 0 - 230*Math.PI/180, radians - 230*Math.PI/180, false); 
		ctx.stroke();
	}

	function animate() {
		if (degrees < new_degrees) {
			degrees++;
			drawArc(degrees);
		}
		else
			clearInterval(animation_loop);
	}

	animation_loop = setInterval(animate, 20);
}

function homeData(){
	const value = JSON.parse(localStorage.getItem('authTokens'));
    const userData = value.user;
	console.log(userData);
	let profile = document.querySelector(".home-profile .div-info");
	profile.querySelector(".home-user-info p").innerHTML = `${userData.first_name}  ${userData.last_name}`;
	profile.querySelector(".home-user-info span").innerHTML = `${userData.country}`;

	const spinner = document.getElementById("spinner");
    drawtheLevel(20, spinner);
}

export function homeActions() {
	
	homeData();
	// mainActions();
	// handleLogoutBtn();
	// twoFactorAuth();
}