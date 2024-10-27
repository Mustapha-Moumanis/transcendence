import { countries } from '../Settings/script.js';

export function drawtheLevel(spinner) {

	const lvl = spinner.attributes.level_data.value;

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
		if (degrees <= new_degrees) {
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
	const country = countries.find(c => c.value === userData.country_select);

	// card
	let profile = document.querySelector(".home-profile .div-info");
	profile.parentElement.querySelector(".avatar").innerHTML = `<img src="${userData.avatar}" alt="Avatar">`
	profile.parentElement.querySelector(".lvl-xp").innerHTML = `${userData.level}.${userData.exp} xp`;
	profile.querySelector(".home-user-info").innerHTML = `
		<p>${userData.first_name} ${userData.last_name}</p>
        <span>${country.text}</span>`;
	profile.querySelector(".total-profits #matches span").innerHTML = `${userData.wins + userData.losses}`;
	profile.querySelector(".total-profits #winning span").innerHTML = `${userData.wins}`;
	profile.querySelector(".total-profits #losses span").innerHTML = `${userData.losses}`;

	const spinner = document.getElementById("spinner");
	spinner.attributes.level_data.value = userData.exp;
    drawtheLevel(spinner);
	
	// game
	document.querySelector(".home-start-playing .start-play").addEventListener('click', () => {
		window.location.hash = '#game';
	});
	
}

export function homeActions() {
	homeData();
}