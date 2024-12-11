import Player from "./Player.js";
import Match from "./Match.js";

export default class Tournament {
    constructor(data){
        this.player1 = new Player(data.player1.name, data.player1.avatar);
        this.player2 = new Player(data.player2.name, data.player2.avatar);
        this.player3 = new Player(data.player3.name, data.player3.avatar);
        this.player4 = new Player(data.player4.name, data.player4.avatar);
        this.Match1 = new Match(this.player1, this.player2);
        this.Match2 = new Match(this.player3, this.player4);
        this.final;
    }
    getPlayerByName(name){
        if (this.player1.nameGetter() === name) return this.player1;
        if (this.player2.nameGetter() === name) return this.player2;
        if (this.player3.nameGetter() === name) return this.player3;
        if (this.player4.nameGetter() === name) return this.player4;
    }
}

function  tournamentBracket(tournament) {
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
							<img class="avatar" src="static/default/1.svg">
							<div class="match-username">nana_hilal</div>
						</div>
						<div class="bracket-match-score bracket-left"><p></p></div>
					</div>
					<div class="tournament-match-card">
						<div id="palyerTwo" class="match-content left">
							<img class="avatar" src="static/default/6.svg">
							<div class="match-username">shilal</div>
						</div>
						<div class="bracket-match-score bracket-left"><p></p></div>
					</div>
				</div>
				<div class="separator">
					<svg width="19" height="100" viewBox="0 0 19 100" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M6.99902 4C6.99902 3.44772 6.55131 3 5.99902 3H4.5H2H1C0.447715 3 0 2.55228 0 2V1.00233C0 0.449139 0.449137 0.00104743 1.00233 0.00233753L5 0.0116604L8.99767 0.00233753C9.55086 0.00104743 10 0.44914 10 1.00234L10 48C10 48.5523 10.4477 49 11 49H18C18.5523 49 19 49.4477 19 50V51C19 51.5523 18.5523 52 18 52H14.5H11C10.4477 52 9.99999 52.4477 9.99998 53L9.99904 99C9.99903 99.5523 9.55132 100 8.99904 100H1C0.447715 100 0 99.5523 0 99V98C0 97.4477 0.447715 97 1 97H1.5H3.5H6V97C6.55228 97 6.99999 96.5523 6.99998 96L6.99902 50.3731V26.8806V4Z"/>
					</svg>	
				</div>
				<div class="match-final">
					<div class="tournament-match-card">
						<div id="palyerOne" class="match-content">
							<img class="avatar" src="./../../images/unknow.jpg">
							<div class="match-username">Winner 1</div>
						</div>
					</div>
					<div class="tournament-match-card">
						<div id="palyerTwo" class="match-content">
							<div class="match-username">Winner 2</div>
							<img class="avatar" src="./../../images/unknow.jpg" >
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
						<div class="bracket-match-score bracket-right"><p></p></div>
						<div id="palyerOne" class="match-content right">
							<img class="avatar" src="static/default/1.svg">
							<div class="match-username">nana_hilal</div>
						</div>
					</div>
					<div class="tournament-match-card">
						<div class="bracket-match-score bracket-right"><p></p></div>
						<div id="palyerTwo" class="match-content right">
							<img class="avatar" src="static/default/6.svg">
							<div class="match-username">shilal</div>
						</div>
					</div>
				</div>
			</div>
            <div class="btn-startRound"><button id="startRound" class="btn-main">Start</button></div>
		</div>`;
    startTournamentBracket(bracket, tournament.Match1, ".bracket .match-one", ".match-final #palyerOne");
    startTournamentBracket(bracket, tournament.Match2, ".bracket .match-two", ".match-final #palyerTwo");
    return bracket;
}

export function addWinner(palyer){
    const svgMarkup = `
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.3278 15.4392L13.3387 24.8279C13.0851 25.0265 13.0401 25.3965 13.2387 25.6501L13.9609 26.5723C14.1595 26.8259 14.5295 26.8709 14.7832 26.6723L26.7722 17.2836C27.0258 17.085 27.0708 16.715 26.8722 16.4614L26.15 15.5392C25.9514 15.2856 25.5814 15.2406 25.3278 15.4392ZM19.9501 4.77241C19.1864 5.37049 19.052 6.47535 19.6501 7.23907C19.8103 7.44369 20.0054 7.59779 20.2238 7.7104L19.1167 10.5952C18.8805 11.2079 18.1897 11.5071 17.5811 11.2584L12.0139 8.98809C12.1237 8.49299 12.0275 7.95458 11.689 7.52229C11.0909 6.75856 9.98605 6.62417 9.22233 7.22225C8.45861 7.82033 8.32421 8.92519 8.92229 9.68891C9.26083 10.1212 9.76048 10.3436 10.2675 10.3558L11.137 16.3048C11.2326 16.9553 10.7735 17.5565 10.125 17.6367L7.06179 18.0177C7.00419 17.7838 6.90197 17.5524 6.74173 17.3477C6.14365 16.584 5.03879 16.4496 4.27507 17.0477C3.51134 17.6458 3.37407 18.7529 3.97215 19.5166C4.57023 20.2803 5.67509 20.4147 6.43881 19.8167C6.51374 19.758 6.57965 19.6878 6.64267 19.6198L13.0776 23.5445L24.1444 14.878L21.8768 7.68983C21.9579 7.64494 22.0418 7.59779 22.1168 7.53911C22.8805 6.94103 23.0149 5.83617 22.4168 5.07245C21.8187 4.30872 20.7139 4.17433 19.9501 4.77241Z" fill="#EFBF04"></path>
    </svg>`;
    
    // Create a temporary container to convert the string to a DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgMarkup.trim(); // `.trim()` ensures no unnecessary spaces
    
    // Extract the SVG element
    const svgElement = tempDiv.firstChild;

    palyer.appendChild(svgElement);
}

function turnOneBracket(tournament){
    const bracket = document.querySelector(".game-touranment");
    bracket.classList.remove("d-none");
    startTournamentBracket(bracket, tournament.Match1, ".bracket .match-one", ".match-final #palyerOne");
    startTournamentBracket(bracket, tournament.Match2, ".bracket .match-two", ".match-final #palyerTwo");
}

function startTournamentBracket(bracket, match, classRound, classWinner) {
    const roundOne = bracket.querySelector(classRound);
    const palyerOne = roundOne.querySelector("#palyerOne");
    const palyerTwo = roundOne.querySelector("#palyerTwo");
    
    palyerOne.innerHTML = `
        <img class="avatar"src="${match.player1.avatar}" alt="${match.player1.name}"></img>
        <div class="match-username">${match.player1.name}</div>`;
    
    palyerTwo.innerHTML = `
        <img class="avatar"src="${match.player2.avatar}" alt="${match.player2.name}"></img>
        <div class="match-username">${match.player2.name}</div>`;
    
    if (match.winner_name){
        palyerOne.parentElement.querySelector(".bracket-match-score p").innerHTML = match.player1_score;
        palyerTwo.parentElement.querySelector(".bracket-match-score p").innerHTML = match.player2_score;
        if (match.player1_score > match.player2_score){
            addWinner(palyerOne);
            bracket.querySelector(classWinner).innerHTML = `
            <img class="avatar"src="${match.player1.avatar}" alt="${match.player1.name}"></img>
            <div class="match-username">${match.player1.name}</div>`;
        }
        else {
            addWinner(palyerTwo);
            bracket.querySelector(classWinner).innerHTML = `
                <img class="avatar"src="${match.player2.avatar}" alt="${match.player2.name}"></img>
                <div class="match-username">${match.player2.name}</div>`;
        }
    }
}

export {
    turnOneBracket,
    tournamentBracket
}