import { loadHTML, loadCSS, loadJS, removeAllCSS, removeAllJS } from '../../utils/js/utils.js';
import { ResetPasswordActions } from './script.js'

async function ResetPassword() {
  const html = await loadHTML('./pages/ResetPassword/ResetPassword.html');
  const root = document.getElementById('root');

  root.innerHTML = html;
  // loadCSS('./utils/bootstrap.min.css');
  loadCSS('./utils/css/style.css');

  ResetPasswordActions();
}

export default ResetPassword;
