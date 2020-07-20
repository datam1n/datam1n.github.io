function fileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    return xhr.status != 404;
}

function fileToDiv(fileName) {
  var action = fileName;
  window.history.pushState({'action':action}, null, '?a=' + action);
  prevAction = action;
  loadFile(fileName);
}

function loadFile(fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', fileName + '.html', true);
  xhr.onreadystatechange = function() {
      if (this.readyState !== 4) return;
      if (this.status !== 200) return;
      document.getElementById('title-of-card').innerHTML = fileName;
      document.getElementById('content-of-card').innerHTML = this.responseText;
  };
  xhr.send();
}

window.onpopstate = function(event) {
  var state = event.state;
  // alert(state.action);

  if (state != null) {
    // console.log(state.action);
    var url = new URL(window.location.href);
    var action = url.searchParams.get("a");
    if (action && fileExist(action + '.html')) {
      loadFile(state.action);
    } else {
    }
  }
}

function loadPage() {
  // console.log('AAA!');
  var url = new URL(window.location.href);
  var action = url.searchParams.get("a");
  if (action && fileExist(action + '.html')) {
    // fileToDiv(action);
    if (action.startsWith('htmls')) {
      document.getElementById(action).click();
    } else {
      fileToDiv(action);
    }
  } else {
    fileToDiv('htmls/about');
  }
}
