import { showAlert } from '../../utils/js/auth.js';
import { logoutFetch } from '../../utils/js/utils.js';
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

function creatMatchCard(data, avatar){
	const div = document.createElement('div');
	div.classList.add("match-card");
	if (data.result === "Loss") div.classList.add("match-card", "loss");
	else div.classList.add("match-card", "win");
	div.innerHTML = `<div class="match-user">
			<span>${data.nickname}</span>
			<div class="match-user-avatar">
				<img src="${avatar}" alt="Avatar">
			</div>
		</div>
		<div class="match-score">
			<span>${data.user_score}</span>
			<svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_3242_1879)">
					<path d="M18.041 2.03484C17.3718 1.41933 16.6505 1.39722 16.0336 2.03487L15.6686 3.71032C15.8556 3.81695 16.106 3.89335 16.384 3.93945L15.8052 7.33387C14.5507 7.46022 13.2961 7.77079 12.0416 8.26612L12.0416 10.0262C13.1975 9.6177 14.3439 9.35694 15.4815 9.23251L12.6093 26.0803L17.0373 32.7101L21.4654 26.0802L18.5925 9.22817C19.7863 9.35409 20.9708 9.62367 22.1467 10.0261L22.1466 8.26599C20.8536 7.75544 19.5607 7.44179 18.2677 7.32323L17.6908 3.93896C17.9648 3.89322 18.2144 3.81721 18.4062 3.71025L18.0411 2.03491L18.041 2.03484ZM28.4457 18.2024L28.4454 18.2026L28.4458 18.2025L28.4457 18.2024ZM28.4454 18.2026L23.3742 21.4159L25.213 17.9121L22.2706 19.6543L23.0256 17.1186L21.0898 19.0156L22.3094 26.3134L19.9284 29.7009L26.0842 23.4678L23.6257 23.642L28.4454 18.2027L28.4454 18.2026ZM17.5428 9.15489L18.3998 23.0294L17.0374 26.0919L15.6749 23.0294L16.5319 9.15555C16.8696 9.14335 17.2066 9.14345 17.5428 9.15482L17.5428 9.15489ZM12.108 16.7313L12.1078 16.7314L12.108 16.7316L12.108 16.7313ZM12.108 16.7316L12.2821 18.4155L10.9464 17.3508L12.2241 19.906L8.58485 16.5379L11.4884 21.2612L7.52025 18.5318L10.8885 23.6035L7.21044 22.8291L14.063 29.7979L11.6821 26.4103L13.2113 17.951L12.1081 16.7316L12.108 16.7316Z"/>
				</g>
				<defs>
					<clipPath id="clip0_3242_1879">
						<rect width="24" height="24" transform="translate(17 0.0294342) rotate(45)"/>
					</clipPath>
				</defs>
			</svg>
			<span>${data.opponent_score}</span>
		</div>
		<div class="match-friend">
			<div class="match-user-avatar">
				<img src="/static/default/1.svg" alt="Avatar">
			</div>
			<span>${data.opponent}</span>
		</div>
	`;
	return div;
}

export function matchHistory(game_history, avatar){
	const history = document.querySelector(".one-vs-one-history");
	if (game_history.length === 0)
		return;

    history.querySelector(".empty-one-vs-one").classList.add("d-none");
	history.innerHTML = `<div class="match-history">
			<p>Match History</p></div>
		<div class="match-cards">
	`;
	const matchCards = history.querySelector(".match-cards");
	game_history.forEach(card => {
		matchCards.prepend(creatMatchCard(card, avatar));
	});
}

function getGameHistory(avatar){
    fetch(`api/game-history/`, {
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
                throw new Error('History not found');
            });
        }
        return response.json();
    })
    .then(data => {
        matchHistory(data, avatar);
    })
    .catch((error) => {
        showAlert('error', error);
    });
}

function homeData(){
	const userData = JSON.parse(localStorage.getItem('userData'));
	const country = countries.find(c => c.value === userData.country_select);

	// card
	let profile = document.querySelector(".home-profile .div-info");
	profile.parentElement.querySelector(".avatar").innerHTML = `<img src="${userData.avatar}" alt="${userData.username}">`
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

	// History
	getGameHistory(userData.avatar);
}

export function homeActions() {
	homeData();
}