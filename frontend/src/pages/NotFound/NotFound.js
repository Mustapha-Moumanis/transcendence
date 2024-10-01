import { loadHTML, loadCSS } from '../../utils/utils.js';

async function NotFound() {
  const html = await loadHTML('./pages/NotFound/NotFound.html');
  loadCSS('./pages/NotFound/NotFound.css');

  const app = document.getElementById('root');
  app.innerHTML = html;

  document.getElementById('notfound-button').addEventListener('click', () => {
    alert('NotFound button clicked!');
  });
}

export default NotFound;
