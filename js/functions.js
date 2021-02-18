function fileToDiv(fileName) {
  // Loads content of file into div: pushes current action into history stack
  // and calls `loadFile`.
  var action = fileName;
  window.history.pushState({'action':action}, null, '?a=' + action);
  loadFile(fileName);
}

loadFile = async (fileName) => {
  document.getElementById('title-of-card').innerHTML = fileName;
  
  if (fileName === 'htmls/publications') {
    document.getElementById('content-of-card').innerHTML = '<h3>Publications</h3>\n<div id=\'pubs\'>Loading... [from Zotero]</div>';
    generateBib('pubs');
  } else {
    fetch(fileName + '.html')
      .then(function (r) {
        return r.text();
      })
      .then(function (r) {
        document.getElementById('content-of-card').innerHTML = r;
      });
  }

  $('a[id$=' + fileName.split('/')[1] + ']').addClass('active');
  $('a:not([id$=' + fileName.split('/')[1] + '])').removeClass('active');  
}

window.onpopstate = function(event) {
  var state = event.state;
  if (state != null) {
    var url = new URL(window.location.href);
    var action = url.searchParams.get("a");
    if (action) {
      if (action.startsWith('htmls')) {
        try { // if there is no such file
          loadFile(state.action);
        }
        catch (err) {}
      }
    }
  }
}

function loadPage() {
  // Called only when loading the whole page (e.g. refresh).
  var url = new URL(window.location.href);
  var action = url.searchParams.get("a");
  if (action) {
    if (action.startsWith('htmls')) {
      try { // if there is no such id/file
        document.getElementById(action).click();
      } 
      catch (err) {}
    }
  } else {
    fileToDiv('htmls/about');
  }
}

function getAuthors(js) {
  var authors = [];
  js['data']['creators'].forEach((a) => {
    if (a['creatorType'] == 'author') {
      authors.push(a['firstName'] + ' ' + a['lastName']);
    }
  })
  return authors.join(', ');
}

function putURL(url) {
  return '<a href="' + url + '">' + url + '</a>';
}

function formatBib(js) {
  return getAuthors(js) + '. ' + js['data']['title'] + '. ' 
    + ((js['data'].hasOwnProperty('proceedingsTitle')) ? 
      (
        (js['data']['proceedingsTitle'] != '' ? js['data']['proceedingsTitle'] + ', ' : '')
        + (js['data']['volume'] != '' ? 'vol. ' + js['data']['volume'] + ', ' : '')
      )
      : (
        (js['data'].hasOwnProperty('publicationTitle')) ? 
        (
          (js['data']['publicationTitle'] != '' ? js['data']['publicationTitle'] + ', ' : '')
          + (js['data']['volume'] != '' ? 'vol. ' + js['data']['volume'] + ', ' : '')
          + (js['data']['issue'] != '' ? js['data']['issue'] + ', ' : '')
        )
        : ''
      )
    )
    + (js['data']['pages'] != '' ? 'pages ' + js['data']['pages'] + ', ' : '')
    + (js['data'].hasOwnProperty('publisher') && js['data']['publisher'] != '' ? js['data']['publisher'] + ', ' : '')
    + (js['data']['date'] != '' ? js['data']['date'] + '.' : '')
    + (js['data']['url'] != '' ? ' ' + putURL(js['data']['url']) : '') ;
}

const generateBib = async (element_id) => {
  var bib_text = '';
  var ind = 0;
  const limit = 100;
  bibs = [];
  
  while (true) {
    const response = await fetch('https://api.zotero.org/groups/2770680/collections/YREG49H9/items?format=json&sort=date&start=' + ind + '&limit=' + limit);
    const bib = await response.json();
    bibs = bibs.concat(bib);
    if (bib.length == 0)
      break;
    ind += limit;
  }
  
  var year = -1;
  for (i = 0; i < bibs.length; i++) {
    if (bibs[i]['data']['date'] != '' && bibs[i]['data']['date'] != year) {
      bib_text += "<h4>" + bibs[i]['data']['date'] + "</h4>\n";
      year = bibs[i]['data']['date'];
    }
    bib_text += "<p>" + formatBib(bibs[i]) + "</p>\n";
  }
  
  // console.log(bibs);

  try {
    document.getElementById(element_id).innerHTML = bib_text;
  }
  catch (err) {}
}

// function createCache() {
//   const bibCache = await caches.open('bib-cache');
// }
