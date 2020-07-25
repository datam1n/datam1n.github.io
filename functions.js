function fileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, true);
    xhr.send();
    return xhr.status != 404;
}

function fileToDiv(fileName, func_to_execute="") {
  // Loads content of file into div: pushes current action into history stack
  // and calls `loadFile`.
  var action = fileName;
  
  window.history.pushState({'action':action, 'func': func_to_execute}, null, '?a=' + action);
  loadFile(fileName);

  if (func_to_execute != "")
    eval(func_to_execute);
  //console.log(func_to_execute);
}

function loadFile(fileName) {
  // Loads content of file: sets content of div.
  var xhr = new XMLHttpRequest();
  xhr.open('GET', fileName + '.html', true);
  xhr.onreadystatechange = function() {
      if (this.readyState !== 4) return;
      if (this.status !== 200) return;
      document.getElementById('title-of-card').innerHTML = fileName;
      document.getElementById('content-of-card').innerHTML = this.responseText;

      $('a[id$=' + fileName.split('/')[1] + ']').addClass('active');
      $('a:not([id$=' + fileName.split('/')[1] + '])').removeClass('active');
  };
  xhr.send();
}

window.onpopstate = function(event) {
  var state = event.state;
  if (state != null) {
    var url = new URL(window.location.href);
    var action = url.searchParams.get("a");
    if (action && fileExist(action + '.html')) {
      loadFile(state.action);

//      $('a[id$=' + action.split('/')[1] + ']').addClass('active');
//      $('a:not([id$=' + action.split('/')[1] + '])').removeClass('active');

      if (state.func != "")
        eval(state.func);
    }
  }
}

function loadPage() {
  // Called only when loading the whole page (e.g. refresh).
  var url = new URL(window.location.href);
  var action = url.searchParams.get("a");
  if (action && fileExist(action + '.html')) {
    if (action.startsWith('htmls')) {
      document.getElementById(action).click();
    }
  } else {
    fileToDiv('htmls/about');
  }
}
