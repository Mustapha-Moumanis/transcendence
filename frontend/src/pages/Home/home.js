
import { loadHTML, loadCSS } from '../../utils/utils.js';
// import { mainActions, } from '../../utils/auth.js';
// import { homeActions } from './clean.js'
import { homeActions } from './script.js'

async function Home() {
  const html = await loadHTML('./pages/Home/home.html');
  const root = document.getElementById('root');
  root.innerHTML = html;
  
  loadCSS('./utils/bootstrap.min.css');
  loadCSS('./pages/Home/home.css');
  loadCSS('./style.css');

  homeActions();
}

export { Home };