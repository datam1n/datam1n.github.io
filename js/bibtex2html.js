/* 
 * Author: Zalán Bodó
 *
 * Requires: 
 * bibtexParseJs: https://github.com/ORCID/bibtexParseJs
 * BibTeX-js: https://github.com/pcooksey/bibtex-js
*/ 

var b2h = {};

b2h.toText = function (bibObj) {
	var bib = '@' + bibObj.entryType + '{' + bibObj.citationKey;
	for (let key of Object.keys(bibObj.entryTags)) {
		bib += ',\n  ' + key + "={" + bibObj.entryTags[key] + "}";
	}
	bib += '\n}';
	return bib;
}

b2h.bd = new BibtexDisplay();
b2h.fixValue = function(value) {
	return this.bd.fixValue(value);
}

b2h.formatRecord = function(bibObj, fieldList, preList, cssList) {
	var record = '<div id="' + bibObj.citationKey + '">\n';
	var j = 0;
	for (let key of fieldList) {
		if (Array.isArray(key)) {
			var i = 0, l = 0;
			for (let k of key) {
				if (typeof(bibObj.entryTags[k]) != "undefined") {
					if (k == "title" && typeof(bibObj.entryTags.url) != "undefined")
						record += ((i==0)?'':', ') + '<a href="' + bibObj.entryTags.url + '">' + preList[j][l] + ' ' + this.fixValue(bibObj.entryTags[k]) + '</a>';
					else
						if (k == 'pages')
							record += ((i==0)?'':', ') + preList[j][l] + ' ' + this.fixValue(bibObj.entryTags[k].replace(/\-+/, '-')); // -- => - in pages
						else
							record += ((i==0)?'':', ') + preList[j][l] + ' ' + this.fixValue(bibObj.entryTags[k]);
					i++;
				}
				l++;
			}
			if (i > 0) // if there was such field in the bibtex record
				record = '<div class="b2h_' + cssList[j] + '">' + ((j==0)?'&bull;':'') + record + '.</div>\n';
		} else {
			if (typeof(bibObj.entryTags[key]) != "undefined") {
				if (key == "title" && typeof(bibObj.entryTags.url) != "undefined")
					record += '<div class="b2h_' + cssList[j] + '">' + ((j==0)?'&bull;':'') + '<a href="' + bibObj.entryTags.url + '">' + preList[j] + ' ' + this.fixValue(bibObj.entryTags[key]) + '</a>.</div>\n';
				else
					record += '<div class="b2h_' + cssList[j] + '">' + ((j==0)?'&bull;':'') + preList[j] + ' ' + this.fixValue(bibObj.entryTags[key]) + '.</div>\n';
			}
		}
		j++;
	}
	record += '</div>\n';
	// return '<div>&bull;</div>' + record;
	return record;
}

b2h.toggle = function(id) {
	var elem = document.getElementById(id);
	if(elem.style.display == "block")
		elem.style.display = "none";
	else
        elem.style.display = "block";
}

b2h.displayBibTeX = function(bibObj) {
	var code = '<a href="#' + bibObj.citationKey + '_bib" onclick="b2h.toggle(\'' + bibObj.citationKey + '_bib' + '\');">[bib]</a>\n';
	code += '<div id="' + bibObj.citationKey + '_bib' + '" style="display:none" class="b2h_bibtex">\n';
	code += '<pre>\n' + this.toText(bibObj) + '\n</pre>\n';
	code += '</div>\n';
	return code;
}

b2h.parseBib = function(fName, elementId, fieldList, preList, cssList, sortFunc=this.byDateDesc, bibtex=true) {
	var client = new XMLHttpRequest();
	client.open('GET', fName);
	client.onreadystatechange = function() {
		if (this.readyState !== 4) return;
		if (this.status !== 200) return;

		objs = bibtexParse.toJSON(client.responseText);
		objs = objs.sort(sortFunc);
		
		document.getElementById(elementId).innerHTML = "";

		var prevYear = -1;

		for (let bibObj of objs) {
			if ((sortFunc === b2h.byDateDesc || sortFunc === b2h.byDateAsc) && bibObj.entryTags.year != prevYear) {
				document.getElementById(elementId).innerHTML += '<h1>' + bibObj.entryTags.year + '</h1>';
				prevYear = bibObj.entryTags.year;
			}
			document.getElementById(elementId).innerHTML += '<p>\n' + b2h.formatRecord(bibObj, fieldList, preList, cssList);
			if (bibtex)
				document.getElementById(elementId).innerHTML += b2h.displayBibTeX(bibObj);
			document.getElementById(elementId).innerHTML += '</p>\n';
		}
	}
	client.send();
}

b2h.byTitleAsc = function(a, b) {
		return a.entryTags.title - b.entryTags.title;
}

b2h.byTitleDesc = function(a, b) {
		return b.entryTags.title - a.entryTags.title;
}

b2h.byAuthorAsc = function(a, b) {
		return a.entryTags.author - b.entryTags.author;
}

b2h.byAuthorDesc = function(a, b) {
		return b.entryTags.author - a.entryTags.author;
}

b2h.byDateAsc = function(a, b) {
		return a.entryTags.year - b.entryTags.year;
}

b2h.byDateDesc = function(a, b) {
		return b.entryTags.year - a.entryTags.year;
}
