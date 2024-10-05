import { loadHTML, loadCSS, loadJS, removeAllCSS, removeAllJS } from '../../utils/js/utils.js';
import { ResetPasswordConfirmActions } from './script.js'

async function ResetPasswordConfirm(email) {
  const html = await loadHTML('./pages/ResetPasswordConfirm/ResetPasswordConfirm.html');
  const root = document.getElementById('root');

  root.innerHTML = html;

  ResetPasswordConfirmActions(email);
}

export default ResetPasswordConfirm;
