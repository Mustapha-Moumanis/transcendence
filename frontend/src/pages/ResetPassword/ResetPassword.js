import { loadHTML, loadCSS, showLoading, hideLoading, AuthEffects} from '../../utils/js/utils.js';
import { ResetPasswordActions } from './script.js'

async function ResetPassword() {
  showLoading();
  const html = await loadHTML('./pages/ResetPassword/ResetPassword.html');
  await AuthEffects();
  
  const root = document.getElementById('root');

  root.innerHTML = html;

  ResetPasswordActions();
  // hideLoading();
}

export default ResetPassword;
