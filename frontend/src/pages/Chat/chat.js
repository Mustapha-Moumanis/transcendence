import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { chatActions } from './script.js'

async function Chat() {
  const html = await loadHTML('./pages/Chat/chat.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  var styleList = [
    './utils/chat/css/chat.css',
    './utils/chat/css/main-chat.css',
    './utils/chat/css/mobile-chat.css',
    './utils/chat/css/chat-sidebar.css',
  ]
  loadCSS(styleList);
  
  chatActions();
}


export default Chat;
