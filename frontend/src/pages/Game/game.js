import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { gameActions } from './script.js'

async function Game() {
  const html = await loadHTML('./pages/Game/game.html');
  await HomeEffects();
  loadCSS(['./pages/Game/game.css']);
  gameActions(html);
}


export default Game;
