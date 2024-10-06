import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { settingsActions } from './script.js'
import Home from '../Home/home.js'

async function Settings() {
  const html = await loadHTML('./pages/Settings/settings.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  loadCSS(['./pages/Settings/settings.css',]);
  settingsActions();
}


export default Settings;
