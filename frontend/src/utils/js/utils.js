import { logout, displaySuccess, displayError } from './auth.js'
import { themeAction } from './theme.js'

export async function loadHTML(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load HTML: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function loadCSS(url) {
  if (document.querySelector(`link[href="${url}"]`))
    return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

export function loadJS({ url, defer = false, type = 'text/javascript' }) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      console.log("Script already exists:", url);
      resolve();  // Resolve immediately if the script is already loaded
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.defer = defer;
    script.type = type;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.body.appendChild(script);
  });
}
export function removeAllCSS() {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => link.parentNode.removeChild(link));
}

export function removeAllJS() {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => script.parentNode.removeChild(script));
}

export function showLoading() {
  document.getElementById('loading').removeAttribute("style");
}

export function hideLoading() {
  setTimeout(() => {
    document.getElementById('loading').style.display = "none";
  }, 1500)
}

export function setCookie(name, value, days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

export function handleLogoutBtn() {
	document.getElementById('logout').addEventListener('click', function(e) {

		fetch('api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                console.log(response)
                return response.json().then(errorData => {
                    if (errorData.non_field_errors) {
                        throw new Error(errorData.non_field_errors[0]);
                    }
                    throw new Error('Handled HTTP error');
                });
            }
            return response.json();
        })
        .then(data => {
            // displaySuccess('Logout successful!');
            logout();
            setTimeout(() => { window.location.hash = '#login'; }, 1000);
        })
        .catch(error => {
            // displayError(error.message);
            logout();
            setTimeout(() => { window.location.hash = '#login'; }, 1000);
        });
	});
};

function updateSidebar() {
  const currentHash = window.location.hash;
  const buttons = document.querySelectorAll('.side-btns div');

  if (buttons) {
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active-btn'));
        button.classList.add('active-btn');
      });
      // if (button.getAttribute('href') === currentHash) button.parentElement.classList.add('active-btn');
      // else button.parentElement.classList.remove('active-btn');
    });
  }
}

export async function HomeEffects() {
  const root = document.getElementById('root');
  if (root.querySelector('.nav-bar') == null) {
    console.log("Home Effect")
    const nav = await loadHTML('../components/nav/navBar.html');
    const sidebar = await loadHTML('../components/sidebar/sidebar.html');

    var content = document.createElement("div");
    content.classList.add("content");
    
    var mainContent = document.createElement("div");
    mainContent.id = "home-content";
    mainContent.classList.add("home-content");

    content.innerHTML = sidebar;
    content.appendChild(mainContent);
    
    root.innerHTML = nav + content.outerHTML;

    loadCSS('./utils/css/bars.css');

    setTimeout(() => { 
      themeAction();
      handleLogoutBtn();
      updateSidebar();
    }, 0);

    const themeButton = document.querySelector('.themeButton');
    if (themeButton) themeButton.remove();
  }
}

export async function AuthEffects() {
  if (document.querySelector('.themeButton') == null) {
    const themeButtonContent = await loadHTML('../components/themeButton/themeButton.html');
    
    const btnContent = document.createElement('div');
    btnContent.innerHTML = themeButtonContent;
    
    document.body.appendChild(btnContent.firstElementChild);

    setTimeout(() => { themeAction(); }, 0);
  }
}

// function updateSidebar() {
//   const buttons = document.querySelectorAll('.side-btns div');
//   const topStyle = {
//     "home" : "0%",
//     "game" : "25%",
//     "chat" : "50%",
//     "settings" : "75%",
//   }


//   function moveNavActive(button) {
//     buttons.forEach(btn => btn.classList.remove('active-btn'));
//     button.classList.add('active-btn');
//     console.log("btn : ", button.classList[0]);
//     // console.log(button.classList[0]);
    
//   }

//   if (buttons) {
//     buttons.forEach(button => {
//       button.addEventListener('click', () => {
//         moveNavActive(button);
//       });
//       // if () {
//       //   button.parentElement.classList.add('active-btn');
//       // }
//       // else button.parentElement.classList.remove('active-btn');
//     });
//     // activeBtn.classList.remove('active-btn');
//   }
// }