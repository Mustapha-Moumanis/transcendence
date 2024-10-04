// --------------------------------------------- //
// Color Switch Start
// --------------------------------------------- //
const themeBtn = document.querySelector('#color-switcher');

function getCurrentTheme(){
  let theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  localStorage.getItem('template.theme') ? theme = localStorage.getItem('template.theme') : null;
  return theme;
}

function loadTheme(theme){
  const root = document.querySelector(':root');
  console.log(theme)
  // if(theme === "dark") themeBtn.innerHTML = `<i class="ph-bold ph-sun">light</i>`;
  // else themeBtn.innerHTML = `<i class="ph-bold ph-moon-stars">dark</i>`;
  root.setAttribute('color-scheme', `${theme}`);
};

themeBtn.addEventListener('click', () => {
  let theme = getCurrentTheme();
  console.log(theme)

  if(theme === 'dark'){
    theme = 'light';
  } else {
    theme = 'dark';
  }
  localStorage.setItem('template.theme', `${theme}`);
  loadTheme(theme);
});

window.addEventListener('DOMContentLoaded', () => {
  loadTheme(getCurrentTheme());
});
// --------------------------------------------- //
// Color Switch End
// --------------------------------------------- //