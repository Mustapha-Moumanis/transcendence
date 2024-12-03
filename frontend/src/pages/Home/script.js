import { showAlert } from '../../utils/js/auth.js';
import { logoutFetch } from '../../utils/js/utils.js';
import { countries } from '../Settings/script.js';
import { addWinner } from '../Game/src/Tournament.js';

export function drawtheLevel(spinner) {

	const lvl = spinner.attributes.level_data.value;
	const exp = spinner.attributes.exp_data.value;

	let rootStyles = getComputedStyle(document.documentElement);
	let color = rootStyles.getPropertyValue('--primary-color').trim();
	let bgcolor = rootStyles.getPropertyValue('--sub-color').trim();
	
	let ctx = spinner.getContext("2d");
	let width = spinner.width;
	let height = spinner.height;
	let degrees = 0;
	let new_degrees = (exp/(lvl * 1000))*280;
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

function BarcketsTournament(data){
	const bracket = document.createElement('div');
    bracket.classList.add("game-touranment");
    bracket.innerHTML = `
		<div class="tournament-content">
        	<div class="rounds">
                <div class="round-one"><p>Round 1</p></div>
				<div class="final-round"><p>FINAL</p></div>
				<div class="round-two"><p>Round 2</p></div>
			</div>
			<div class="bracket">
				<div class="match-one">
					<div class="tournament-match-card">
						<div id="palyerOne" class="match-content left">
							<img class="avatar" src="${data.players[0].avatar}" alt="${data.players[0].name}">
							<div class="match-username">${data.players[0].name}</div>
						</div>
						<div class="bracket-match-score bracket-left"><p>${data.matchs[0].player1_score}</p></div>
					</div>
					<div class="tournament-match-card">
						<div id="palyerTwo" class="match-content left">
							<img class="avatar" src="${data.players[1].avatar}" alt="${data.players[1].name}">
							<div class="match-username">${data.players[1].name}</div>
						</div>
						<div class="bracket-match-score bracket-left"><p>${data.matchs[0].player2_score}</p></div>
					</div>
				</div>
				<div class="separator">
					<svg width="19" height="100" viewBox="0 0 19 100" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M6.99902 4C6.99902 3.44772 6.55131 3 5.99902 3H4.5H2H1C0.447715 3 0 2.55228 0 2V1.00233C0 0.449139 0.449137 0.00104743 1.00233 0.00233753L5 0.0116604L8.99767 0.00233753C9.55086 0.00104743 10 0.44914 10 1.00234L10 48C10 48.5523 10.4477 49 11 49H18C18.5523 49 19 49.4477 19 50V51C19 51.5523 18.5523 52 18 52H14.5H11C10.4477 52 9.99999 52.4477 9.99998 53L9.99904 99C9.99903 99.5523 9.55132 100 8.99904 100H1C0.447715 100 0 99.5523 0 99V98C0 97.4477 0.447715 97 1 97H1.5H3.5H6V97C6.55228 97 6.99999 96.5523 6.99998 96L6.99902 50.3731V26.8806V4Z"/>
					</svg>	
				</div>
				<div class="match-final">
					<div class="tournament-match-card">
						<div id="palyerOne" class="match-content left">
							<img class="avatar" src="" alt="${data.matchs[2].player1}">
							<div class="match-username">${data.matchs[2].player1}</div>
						</div>
						<div class="bracket-match-score bracket-left"><p>${data.matchs[2].player1_score}</p></div>
					</div>
					<div class="tournament-match-card">
						<div class="bracket-match-score bracket-right"><p>${data.matchs[2].player2_score}</p></div>
						<div id="palyerTwo" class="match-content right">
							<img class="avatar" src="" alt="${data.matchs[2].player2}">
							<div class="match-username">${data.matchs[2].player2}</div>
						</div>
					</div>
				</div>
				<div class="separator">
					<svg width="19" height="100" viewBox="0 0 19 100" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M12.001 4C12.001 3.44772 12.4487 3 13.001 3H14.5H17H18C18.5523 3 19 2.55228 19 2V1.00233C19 0.449139 18.5509 0.00104743 17.9977 0.00233753L14 0.0116604L10.0023 0.00233753C9.44914 0.00104743 9 0.44914 9 1.00234L9 48C9 48.5523 8.55229 49 8 49H1C0.447715 49 0 49.4477 0 50V51C0 51.5523 0.447715 52 1 52H4.5H8.00002C8.5523 52 9.00001 52.4477 9.00002 53L9.00096 99C9.00097 99.5523 9.44868 100 10.001 100H18C18.5523 100 19 99.5523 19 99V98C19 97.4477 18.5523 97 18 97H17.5H15.5H13V97C12.4477 97 12 96.5523 12 96L12.001 50.3731V26.8806V4Z"/>
					</svg>
				</div>
				<div class="match-two">
					<div class="tournament-match-card">
						<div class="bracket-match-score bracket-right"><p>${data.matchs[1].player1_score}</p></div>
						<div id="palyerOne" class="match-content right">
							<img class="avatar" src="${data.players[2].avatar}" alt="${data.players[2].name}">
							<div class="match-username">${data.players[2].name}</div>
						</div>
					</div>
					<div class="tournament-match-card">
						<div class="bracket-match-score bracket-right"><p>${data.matchs[1].player2_score}</p></div>
						<div id="palyerTwo" class="match-content right">
							<img class="avatar" src="${data.players[3].avatar}" alt="${data.players[3].name}">
							<div class="match-username">${data.players[3].name}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="close-bracket">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711Z"></path>
				</svg>					
			</div>
		</div>`;
		
	if (data.matchs[0].player1_score > data.matchs[0].player2_score){
		bracket.querySelector(".match-final #palyerOne img").setAttribute("src", data.players[0].avatar);
		addWinner(bracket.querySelector(".match-one #palyerOne"));
	}
	else{
		bracket.querySelector(".match-final #palyerOne img").setAttribute("src", data.players[1].avatar);
		addWinner(bracket.querySelector(".match-one #palyerTwo"));
	}

	if (data.matchs[1].player1_score > data.matchs[1].player2_score){
		bracket.querySelector(".match-final #palyerTwo img").setAttribute("src", data.players[2].avatar);
		addWinner(bracket.querySelector(".match-two #palyerOne"));

	}
	else {
		bracket.querySelector(".match-final #palyerTwo img").setAttribute("src", data.players[3].avatar);
		addWinner(bracket.querySelector(".match-two #palyerTwo"));
	}
	const winner = document.createElement('img');
	winner.classList.add("avatar");
	winner.setAttribute("src", "../../images/svg/winner.svg");
	winner.setAttribute("style", "position: absolute; bottom: 4px;");
	if (data.matchs[2].player1_score > data.matchs[2].player2_score) {
		bracket.querySelector(".match-final #palyerOne").parentElement.classList.add("card-winner");
		bracket.querySelector(".match-final #palyerOne").append(winner);
	}
	else {
		bracket.querySelector(".match-final #palyerTwo").parentElement.classList.add("card-winner");
		bracket.querySelector(".match-final #palyerTwo").append(winner);
	}
	document.querySelector(".home-content").appendChild(bracket);

	bracket.querySelector(".close-bracket").addEventListener('click', ()=> {
		bracket.remove();
	})
}

function creatTournamentCard(data) {
	const div = document.createElement('div');
	div.classList.add("tournament-card");
	div.innerHTML =`
		<div class="tournament-winner">
			<div class="avatar">
				<img src="${data.champion.avatar}" alt="${data.champion.name}">
			</div>
			<img class="avatar-winner" src="../../images/svg/winner.svg">
			<span>${data.champion.name}</span>
		</div>
		<div class="tournament-users">
		</div>
		<div class="tournament-detail">
			<span class="btn-main">
				<svg width="32" height="16" viewBox="0 0 32 16" xmlns="http://www.w3.org/2000/svg">
					<path d="M15.4286 -4.76837e-07H11.5619C7.75238 -4.76837e-07 7.67619 -2.66234e-06 7.27619 0.422986C6.95238 0.75402 6.85714 1.08506 6.85714 1.8023C6.85714 2.68506 6.81905 2.75862 6.41905 2.75862C6.17143 2.75862 5.79048 2.94253 5.56191 3.18161C5.2 3.54942 5.14286 3.82529 5.14286 4.98391C5.14286 6.1977 5.2 6.41839 5.58095 6.76782C5.82857 6.98851 6.20952 7.17241 6.4381 7.17241C6.8 7.17241 6.85714 7.26437 6.85714 8V8.82759H4.70476C2.68571 8.82759 2.51429 8.86437 2.13333 9.25057C1.80952 9.58161 1.71429 9.91264 1.71429 10.6299C1.71429 11.5126 1.67619 11.5862 1.27619 11.5862C1.02857 11.5862 0.647619 11.7701 0.419048 12.0092C0.0571428 12.377 0 12.6529 0 13.8115C0 15.0253 0.0571429 15.246 0.438095 15.5954C0.819048 15.9448 1.10476 16 2.30476 16C3.5619 16 3.79048 15.9448 4.15238 15.577C4.51429 15.2092 4.57143 14.9333 4.57143 13.7747C4.57143 12.5609 4.51429 12.3402 4.13333 11.9908C3.88571 11.7701 3.50476 11.5862 3.27619 11.5862C2.91429 11.5862 2.85714 11.4943 2.85714 10.7586V9.93103H7.42857H12V10.7586C12 11.4943 11.9619 11.5862 11.5619 11.5862C11.3143 11.5862 10.9333 11.7701 10.7048 12.0092C10.3429 12.377 10.2857 12.6529 10.2857 13.8115C10.2857 15.0253 10.3429 15.246 10.7238 15.5954C11.1048 15.9448 11.3905 16 12.5905 16C13.8476 16 14.0762 15.9448 14.4381 15.577C14.8 15.2092 14.8571 14.9333 14.8571 13.7747C14.8571 12.5609 14.8 12.3402 14.419 11.9908C14.1714 11.7701 13.7905 11.5862 13.5619 11.5862C13.181 11.5862 13.1429 11.4943 13.1429 10.6115C13.1429 9.82069 13.0476 9.54483 12.7048 9.23218C12.3048 8.86437 12.0571 8.82759 10.1333 8.82759H8V8C8 7.26437 8.0381 7.17241 8.4381 7.17241C8.68571 7.17241 9.06667 6.9885 9.29524 6.74942C9.65714 6.38161 9.71428 6.10575 9.71428 4.94713C9.71428 3.73333 9.65714 3.51264 9.27619 3.16322C9.02857 2.94253 8.64762 2.75862 8.41905 2.75862C8.05714 2.75862 8 2.66666 8 1.93103V1.10345H16H24V1.93103C24 2.66666 23.9619 2.75862 23.5619 2.75862C23.3143 2.75862 22.9333 2.94253 22.7048 3.18161C22.3429 3.54942 22.2857 3.82529 22.2857 4.98391C22.2857 6.1977 22.3429 6.41839 22.7238 6.76782C22.9714 6.98851 23.3524 7.17241 23.581 7.17241C23.9429 7.17241 24 7.26437 24 8V8.82759H21.8476C19.8286 8.82759 19.6571 8.86437 19.2762 9.25057C18.9524 9.58161 18.8571 9.91264 18.8571 10.6299C18.8571 11.5126 18.819 11.5862 18.419 11.5862C18.1714 11.5862 17.7905 11.7701 17.5619 12.0092C17.2 12.377 17.1429 12.6529 17.1429 13.8115C17.1429 15.0253 17.2 15.246 17.581 15.5954C17.9619 15.9448 18.2476 16 19.4476 16C20.7048 16 20.9333 15.9448 21.2952 15.577C21.6571 15.2092 21.7143 14.9333 21.7143 13.7747C21.7143 12.5609 21.6571 12.3402 21.2762 11.9908C21.0286 11.7701 20.6476 11.5862 20.419 11.5862C20.0571 11.5862 20 11.4943 20 10.7586V9.93103H24.5714H29.1429V10.7586C29.1429 11.4943 29.1048 11.5862 28.7048 11.5862C28.4571 11.5862 28.0762 11.7701 27.8476 12.0092C27.4857 12.377 27.4286 12.6529 27.4286 13.8115C27.4286 15.0253 27.4857 15.246 27.8667 15.5954C28.2476 15.9448 28.5333 16 29.7333 16C30.9905 16 31.219 15.9448 31.581 15.577C31.9429 15.2092 32 14.9333 32 13.7747C32 12.5609 31.9429 12.3402 31.5619 11.9908C31.3143 11.7701 30.9333 11.5862 30.7048 11.5862C30.3238 11.5862 30.2857 11.4943 30.2857 10.6115C30.2857 9.82069 30.1905 9.54483 29.8476 9.23218C29.4476 8.86437 29.2 8.82759 27.2762 8.82759H25.1429V8C25.1429 7.26437 25.181 7.17241 25.581 7.17241C25.8286 7.17241 26.2095 6.9885 26.4381 6.74942C26.8 6.38161 26.8571 6.10575 26.8571 4.94713C26.8571 3.73333 26.8 3.51264 26.419 3.16322C26.1714 2.94253 25.7905 2.75862 25.5619 2.75862C25.181 2.75862 25.1429 2.66667 25.1429 1.78391C25.1429 0.993103 25.0476 0.71724 24.7048 0.404596C24.2857 0.0183895 24.0952 -4.76837e-07 20.419 -4.76837e-07H16.5714H15.4286ZM8.38095 4.96552V5.88506H7.42857H6.47619V4.96552V4.04598H7.42857H8.38095V4.96552ZM25.5238 4.96552V5.88506H24.5714H23.619V4.96552V4.04598H24.5714H25.5238V4.96552ZM3.2381 13.7931V14.7126H2.28571H1.33333V13.7931V12.8736H2.28571H3.2381V13.7931ZM13.5238 13.7931V14.7126H12.5714H11.619V13.7931V12.8736H12.5714H13.5238V13.7931ZM20.381 13.7931V14.7126H19.4286H18.4762V13.7931V12.8736H19.4286H20.381V13.7931ZM30.6667 13.7931V14.7126H29.7143H28.7619V13.7931V12.8736H29.7143H30.6667V13.7931Z"/>
				</svg>
			</span>
		</div>
	`;

	const users = div.querySelector(".tournament-users");
	data.players.forEach(palyer => {
		const divpalyer = document.createElement('div');
		divpalyer.classList.add("avatar", "small-avatar");
		divpalyer.innerHTML = `<img src="${palyer.avatar}" alt="${palyer.name}">`
		users.append(divpalyer);
	});

	div.querySelector(".btn-main").addEventListener('click', () => {
		BarcketsTournament(data);
	})
	
	return div;
}

function CreatTournamentHistory(game_history){
	const history = document.querySelector(".tournament-history");
	if (game_history.length === 0)
		return;

	history.querySelector(".empty-tournament").classList.add("d-none");
	history.innerHTML = `<div class="match-history">
			<p>Tournament History</p></div>
		<div class="tournament-cards">
	`;
	const tournamentCards = history.querySelector(".tournament-cards");
	game_history.forEach(card => {
		if (card.champion !== null)
			tournamentCards.prepend(creatTournamentCard(card));
	});
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

export function TournamentHistory(){
	var host = window.location.host;
	fetch(`https://${host}/api/tournament/`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
			if (response.status === 401) {
				logoutFetch()
    			.catch(() => {});
				throw new Error("User is not authenticated");
			}
            throw new Error('History not found');
        }
        return response.json();
    })
    .then(data => {
        CreatTournamentHistory(data);
    })
    .catch((error) => {
        showAlert('error', error);
    });
}

function getGameHistory(avatar){
    fetch(`/api/game-history/`, {
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
	spinner.attributes.level_data.value = userData.level;
	spinner.attributes.exp_data.value = userData.exp;
    drawtheLevel(spinner);
	
	// game
	document.querySelector(".home-start-playing .start-play").addEventListener('click', () => {
		window.location.hash = '#game';
	});

	// History
	getGameHistory(userData.avatar);
	TournamentHistory();
}

export function homeActions() {
	homeData();
}