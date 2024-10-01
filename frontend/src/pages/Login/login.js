import { loadHTML, loadCSS } from '../../utils/utils.js';
import { loginActions } from './script.js'


async function Login() {
  const html = await loadHTML('./pages/Login/login.html');
  const root = document.getElementById('root');
  root.innerHTML = html;
  

  loadCSS('./utils/bootstrap.min.css');
  loadCSS('./style.css');

  loginActions();
}


export default Login;
