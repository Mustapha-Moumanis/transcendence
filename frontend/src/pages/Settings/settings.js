import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { settingsActions } from './script.js'

async function Settings() {
  const html = await loadHTML('./pages/Settings/settings.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  loadCSS(['./pages/Settings/settings.css',]);

  setTimeout(() => {
    try {
      settingsActions();
    } catch (error) {}
  }, 200);
}

export default Settings;
