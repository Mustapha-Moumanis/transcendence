import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { gameActions } from './script.js'

async function Game() {
  const html = await loadHTML('./pages/Game/game.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  loadCSS(['./pages/Game/game.css']);

  gameActions();
}


export default Game;
