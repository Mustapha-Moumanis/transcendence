import { loadHTML, showLoading, hideLoading, AuthEffects } from '../../utils/js/utils.js';
import { TwoFactorAuthConfirmActions } from './script.js'

async function TwoFactorAuth(userData) {
  const html = await loadHTML('./pages/TwoFactorAuth/TwoFactorAuth.html');
  await AuthEffects();

  const root = document.getElementById('root');
  root.innerHTML = html;

  TwoFactorAuthConfirmActions(userData);
  // hideLoading();
}

export default TwoFactorAuth;
