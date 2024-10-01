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
