import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { gameActions } from './script.js'

async function Game() {
  const html = await loadHTML('./pages/Game/game.html');
  await HomeEffects();
  // console.log('Game page loaded- > ', html);
  
  document.getElementById('home-content').innerHTML = html;

  // document.body.innerHTML = html;
  
  loadCSS(['./pages/Game/game.css']);
  try {
    let startButton = document.getElementById('start');
    startButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      console.log('Game started')
      gameActions();
    });
  } catch (error) {} 
}


export default Game;
