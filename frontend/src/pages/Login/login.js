import { loadHTML, loadCSS, showLoading, hideLoading, AuthEffects } from '../../utils/js/utils.js';
import { loginActions } from './script.js'


async function Login() {
  showLoading();
  const html = await loadHTML('./pages/Login/login.html');
  await AuthEffects();
  
  const root = document.getElementById('root');
  root.innerHTML = html;

  loginActions();
  hideLoading();
}


export default Login;
