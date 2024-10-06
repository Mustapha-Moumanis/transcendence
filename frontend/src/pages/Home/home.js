
import { loadHTML, loadCSS } from '../../utils/js/utils.js';
// import { mainActions, } from '../../utils/js/auth.js';
// import { homeActions } from './clean.js'
import { homeActions } from './script.js'
import { showLoading, hideLoading, HomeEffects } from '../../utils/js/utils.js';

async function Home() {
  const html = await loadHTML('./pages/Home/home.html');
  await HomeEffects();

  loadCSS(['./pages/Home/home.html'])
  document.getElementById('home-content').innerHTML = html;

  homeActions();
}

export default Home;