import { loadHTML, loadCSS, loadJS, removeAllCSS, removeAllJS } from '../../utils/utils.js';
import { ResetPasswordConfirmActions } from './script.js'

async function ResetPasswordConfirm(email) {
  const html = await loadHTML('./pages/ResetPasswordConfirm/ResetPasswordConfirm.html');
  const root = document.getElementById('root');

  root.innerHTML = html;
  loadCSS('./utils/bootstrap.min.css');
  loadCSS('./style.css');

  ResetPasswordConfirmActions(email);
}

export default ResetPasswordConfirm;
