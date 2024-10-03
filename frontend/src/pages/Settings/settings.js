import { loadHTML, loadCSS, HomeEffects } from '../../utils/utils.js';
import { settingsActions } from './script.js'
import Home from '../Home/home.js'

async function Settings() {
  const html = await loadHTML('./pages/Settings/settings.html');
  await HomeEffects();

  document.getElementById('content').innerHTML = html;
  

  // loadCSS('./utils/bootstrap.min.css');
  // loadCSS('./style.css');

  settingsActions();
}


export default Settings;
