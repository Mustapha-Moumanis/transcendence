import { loadHTML, loadCSS } from '../../utils/js/utils.js';

async function NotFound() {
  const html = await loadHTML('./pages/NotFound/NotFound.html');
  loadCSS(['./pages/NotFound/NotFound.css']);

  const app = document.getElementById('root');
  app.innerHTML = html;

  document.getElementById('notfound-button').addEventListener('click', () => {
    window.location.hash = "#home";
  });
}

export default NotFound;
