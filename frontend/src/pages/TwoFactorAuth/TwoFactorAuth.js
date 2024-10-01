import { loadHTML } from '../../utils/utils.js';
import { TwoFactorAuthConfirmActions } from './script.js'

async function TwoFactorAuth(userData) {
  const html = await loadHTML('./pages/TwoFactorAuth/TwoFactorAuth.html');
  const root = document.getElementById('root');

  root.innerHTML = html;
  // loadCSS('./utils/bootstrap.min.css');
  // loadCSS('./style.css');

  TwoFactorAuthConfirmActions(userData);
}

export default TwoFactorAuth;
