import { loadHTML, loadCSS, HomeEffects } from '../../utils/js/utils.js';
import { chatActions } from './script.js'

async function Chat() {
  const html = await loadHTML('./pages/Chat/chat.html');
  await HomeEffects();

  document.getElementById('home-content').innerHTML = html;

  var styleList = [
    'pages/Chat/css/chat.css',
    'pages/Chat/css/main-chat.css',
    'pages/Chat/css/mobile-chat.css',
    'pages/Chat/css/chat-sidebar.css',
  ]
  loadCSS(styleList);

  chatActions();
}


export default Chat;
