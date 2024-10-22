import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { gameActions } from './script.js'
// import { loadAnimation } from './animation.js'

async function Game() {
  const html = await loadHTML('./pages/Game/game.html');
  await HomeEffects();
  // console.log('Game page loaded- > ', html);
  
  document.getElementById('home-content').innerHTML = html;

  // document.body.innerHTML = html;
  
  loadCSS(['./pages/Game/game.css']);
  try {
    //start animation here
    // loadAnimation();
    //add buttons
    let nickContent = document.getElementById('player-nick');
    let startButton = document.getElementById('start');
    let closeNickContent = document.getElementById('close-player-nick');
    let player1Name = document.getElementById('player1');
    let player2Name = document.getElementById('player2');
    let nameData;
    let startGame = document.getElementById('start-game');

    startButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      console.log('Game started')
      nickContent.classList.remove('d-none');
    });

    closeNickContent.addEventListener('click', () => {
      nickContent.classList.add('d-none');
      startButton.style.display = 'block';
    });

    startGame.addEventListener('click', () => {
      nameData = {
        player1: player1Name.value,
        player2: player2Name.value
      }
      // console.log(nameData);
      nickContent.classList.add('d-none');
      gameActions(nameData);
    });
  } catch (error) {} 
}


export default Game;
