import Home from './pages/Home/home.js';
import Login from './pages/Login/login.js';
import Register from './pages/Register/register.js';
import NotFound from './pages/NotFound/NotFound.js';
import ResetPassword from './pages/ResetPassword/ResetPassword.js';
import Settings from './pages/Settings/settings.js';
import Chat from './pages/Chat/chat.js';
import Game from './pages/Game/game.js';
import Profile from './pages/Profile/profile.js';
import { isAuthenticated } from './utils/js/auth.js';
import { showLoading, hideLoading} from './utils/js/utils.js';

export var myIntervalID = null;
export const setmyIntervalID = (newmyIntervalID) => {
    myIntervalID = newmyIntervalID;
};

const routes = {
  'home': Home,
  'login': Login,
  'register': Register,
  'reset-password' : ResetPassword,
  'settings' : Settings,
  'chat' : Chat,
  'game' : Game,
  'profile' : Profile,
};

function Router() {
  const handleRouteChange = async () => {
    let path = window.location.hash.slice(1) || (() => {
      window.location.hash = '#home';
      return 'home';
    })();
    
    console.log(">> ", path);
    if (isAuthenticated()) {
      if (path === 'login' || path === 'register' || path === 'reset-password') {
        return window.location.hash = '#home';
      }
    } else {
      if (path !== 'login' && path !== 'register' && path !== 'reset-password') {
        return window.location.hash = '#login';
      }
    }
    const component = routes[path] || NotFound;
    await component();

    hideLoading();
  };

  window.addEventListener('hashchange', handleRouteChange);

  if (!window.location.hash) window.location.hash = '#home';
  else handleRouteChange();
}

Router()

window.Router = Router;

export default Router;
