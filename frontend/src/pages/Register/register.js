import { loadHTML, loadCSS, loadJS, removeAllCSS, removeAllJS } from '../../utils/js/utils.js';
import { registerActions } from './script.js'

async function Register() {
  const html = await loadHTML('./pages/Register/register.html');
  const root = document.getElementById('root');

  root.innerHTML = html;
  // loadCSS('./utils/bootstrap.min.css');
  loadCSS('./utils/css/style.css');

  registerActions();
}

export default Register;
