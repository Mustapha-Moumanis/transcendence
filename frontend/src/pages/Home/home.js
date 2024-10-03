
import { loadHTML, loadCSS } from '../../utils/utils.js';
// import { mainActions, } from '../../utils/auth.js';
// import { homeActions } from './clean.js'
import { homeActions } from './script.js'
import { showLoading, hideLoading, HomeEffects } from '../../utils/utils.js';

async function Home() {
  const html = await loadHTML('./pages/Home/home.html');
  await HomeEffects();

  document.getElementById('content').innerHTML = html;

  homeActions();
}

export default Home;