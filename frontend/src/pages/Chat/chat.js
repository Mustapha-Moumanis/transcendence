import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { chatActions } from './script.js'

async function Chat() {
  const html = await loadHTML('./pages/Chat/chat.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  loadCSS('./utils/chat/css/chat.css');
  loadCSS('./utils/chat/css/main-chat.css');
  loadCSS('./utils/chat/css/mobile-chat.css');
  loadCSS('./utils/chat/css/chat-sidebar.css');

  chatActions();
}


export default Chat;
