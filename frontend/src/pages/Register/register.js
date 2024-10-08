import { loadHTML, loadCSS, showLoading, hideLoading, AuthEffects } from '../../utils/js/utils.js';
import { registerActions } from './script.js'

async function Register() {
  showLoading("body");
  const html = await loadHTML('./pages/Register/register.html');
  await AuthEffects();

  const root = document.getElementById('root');
  
  root.innerHTML = html;

  registerActions();
  // hideLoading();
}

export default Register;
