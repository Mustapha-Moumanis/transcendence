
import { loadHTML, loadCSS } from '../../utils/js/utils.js';
import { homeActions } from './script.js'
import { HomeEffects } from '../../utils/js/utils.js';

async function Home() {
  const html = await loadHTML('./pages/Home/home.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;
  loadCSS(['./pages/Home/home.css']);

  setTimeout(() => {
    try {
      homeActions();
    } catch (error) { }
  }, 200);
}

export default Home;