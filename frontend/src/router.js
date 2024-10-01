import { Home } from './pages/Home/home.js';
import Login from './pages/Login/login.js';
import Register from './pages/Register/register.js';
import NotFound from './pages/NotFound/NotFound.js';
import ResetPassword from './pages/ResetPassword/ResetPassword.js';
import { isAuthenticated } from './utils/auth.js';
import { showLoading, hideLoading} from './utils/utils.js';

const routes = {
  '/': Home,
  'login': Login,
  'register': Register,
  'reset-password' : ResetPassword,
};

// async function Router() {
//   window.addEventListener('hashchange', async () => { 
//     const path = window.location.hash.slice(1);
//     console.log(path)
//     showLoading();
//     if (isAuthenticated()) {
//       console.log("is auth");
//       // path = '/';
//     }
//     const component = routes[path] || NotFound;
    
//     component();
//     hideLoading();
//   });

//   const path = window.location.hash.slice(1) || '/';
//   console.log(path)
//   showLoading();
//   if (isAuthenticated()) {
//     console.log("is auth");
//     // path = '/';
//   }
//   const component = routes[path] || NotFound;
  
//   component();
//   hideLoading();
    
// }

// ----------------- last -----------------


// function Router() {
//   window.addEventListener('hashchange', async () => {
//     showLoading();
//     const path = window.location.hash.slice(1);

//     if (isAuthenticated()) {
//       console.log("is auth");
//       // path = '/';
//     }

//     const component = routes[path] || NotFound;
//     component();
    
//     hideLoading();
//   });

//   showLoading();

//   const path = window.location.hash.slice(1) || '/';

//   if (isAuthenticated()) {
//     console.log("is auth");
//     // path = '/';
//   }

//   const component = routes[path] || NotFound;
  
//   component();

//   hideLoading();
// }

function Router() {
  const handleRouteChange = async () => {
    showLoading();
    let path = window.location.hash.slice(1) || '/';

    if (isAuthenticated()) {
      console.log("User is authenticated");

      if (path === 'login' || path === 'register' || path === 'reset-password') {
        path = '/';
        // window.location.hash = '';
        var currentURL = window.location.href;
        window.history.pushState("", document.title, currentURL.split('#')[0]);
        // window.location.href.split('#')[0] = '';
      }
    } else {
      // If not authenticated, restrict access to protected routes
      if (path !== 'login' && path !== 'register' && path !== 'reset-password') {
        path = 'login';
        window.location.hash = '#login';
      }
    }

    const component = routes[path] || NotFound;
    await component();

    hideLoading();
  };

  // Listen for hash changes in the URL (route changes)
  window.addEventListener('hashchange', handleRouteChange);

  showLoading();
  handleRouteChange();
}

Router()

window.Router = Router;

export default Router;
