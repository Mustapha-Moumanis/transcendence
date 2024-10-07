import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { chatActions } from './script.js'

async function Chat() {
  const html = await loadHTML('./pages/Chat/chat.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  var styleList = [
    './css/chat.css',
    './css/main-chat.css',
    './css/mobile-chat.css',
    './css/chat-sidebar.css',
  ]
  loadCSS(styleList);

  chatActions();
}


export default Chat;
