import Home from './pages/Home/home.js';
import Login from './pages/Login/login.js';
import Register from './pages/Register/register.js';
import NotFound from './pages/NotFound/NotFound.js';
import ResetPassword from './pages/ResetPassword/ResetPassword.js';
import Settings from './pages/Settings/settings.js';
import Chat from './pages/Chat/chat.js';
import Game from './pages/Game/game.js';
import Profiles from './pages/Profile/profile.js';
import { checkAuthentication, isAuthenticated } from './utils/js/auth.js';
import { showLoading, hideLoading, logoutFetch} from './utils/js/utils.js';

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
  'profiles' : Profiles,
};

function Router() {
  const handleRouteChange = async () => {
    // console.log(window.location.hash.slice(1).split('/')[0]);
    let path = window.location.hash.slice(1).split('/')[0] || (() => {
      window.location.hash = '#home';
      return 'home';
    })();

    if (!isAuthenticated() && !['login', 'register', 'reset-password'].includes(path)) {
      window.location.hash = '#login';
      return;
    }
    if (isAuthenticated() && ['login', 'register', 'reset-password'].includes(path)) {
      window.location.hash = '#home';
      return;
    }
    if (isAuthenticated() && !(await checkAuthentication())) {
      window.location.hash = '#login';
      return;
    }
    else {
      let profileName = window.location.hash.match(/#profiles\/+([a-zA-Z0-9_-]+)/);
      var username = null;
      if (path === "profiles" && profileName) username = profileName[1];
      else path = window.location.hash.slice(1);
  
      const component = routes[path] || NotFound;
      await component(username);

      hideLoading();
    }
  };

  window.addEventListener('hashchange', handleRouteChange);

  if (!window.location.hash) window.location.hash = '#home';
  else handleRouteChange();
}

Router()

window.Router = Router;

export default Router;
