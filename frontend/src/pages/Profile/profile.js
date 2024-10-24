
import { loadHTML, loadCSS } from '../../utils/js/utils.js';
import { showLoading, hideLoading, HomeEffects } from '../../utils/js/utils.js';
import { profileActions } from './script.js';

async function Profile() {
  const html = await loadHTML('./pages/Profile/profile.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;
  loadCSS(['./pages/Profile/profile.css']);

  setTimeout(() => {
    profileActions();
  }, 300);
}

export default Profile;