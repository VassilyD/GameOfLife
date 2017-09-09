var table = [];
function changerStatu(elem) {
	elem.className = (elem.className == 'alive')?'dead':'alive';
	var i = Math.floor(elem.id / table[0].length);
	var j = elem.id % table[0].length;
	table[i][j] = (table[i][j])?false:true;
}

function genTable(x = 10, y = 10) {
	lignes = x;
	colonnes = y;
	table = [];
	//var tableau = document.getElementById("grille");
	var tableau = document.createElement("table");
	tableau.id = 'grille';
	document.styleSheets[0].cssRules[0].style.width = (95 / y) + 'vh';
	document.styleSheets[0].cssRules[0].style.height = (95 / x) + 'vh';
	for (var i = 0; i < x; i++) {
		var ligne = document.createElement("tr");
		var tableL = [];
		for (var j = 0; j < y; j++) {
			tableL.push(Math.round(Math.random()) == 0);
			//tableL.push(false);
			var elem = document.createElement("td");
			elem.id = i * y + j;
			elem.className = (tableL[j])?'alive':'dead';
			elem.onmouseenter = function(){
				if(painting) changerStatu(this);
			}
			elem.onmousedown = function(){
				painting = true;
				changerStatu(this);
			}
			elem.onmouseup = function(){
				painting = false;
			}
			ligne.appendChild(elem);
		}
		table.push(tableL);
		tableau.appendChild(ligne);
	}
	document.body.removeChild(document.getElementById('grille'));
	document.body.appendChild(tableau);
}

function actuTable() {
	var tmpt = [];
	for (var i = 0; i < lignes; i++) {
		var fuck = [];
		for (var j = 0; j < colonnes; j++) {
			fuck.push(table[i][j]);
		}
		tmpt.push(fuck);
	}
	for(var i = 0; i < lignes; i++) {
		for (var j = 0; j < colonnes; j++) {
			var voisin = 0;
			for (var m = i-1; m <= i+1; m++) {
				var y;
				if(m == -1) y = lignes - 1;
				else if(m == lignes) y = 0;
				else y = m;
				for (var n = j-1; n <= j+1; n++) {
					var x;
					if(n == -1) x = colonnes - 1;
					else if(n == colonnes) x = 0;
					else x = n;
					if(!(m == i && n == j) && table[y][x]) voisin++;
				}
			}
			/*for (var m = Math.max(0, i-1); m <= Math.min(i+1, table.length-1); m++) {
				for (var n = Math.max(0, j-1); n <= Math.min(j+1, table[i].length-1); n++) {
					if(!(m == i && n == j) && table[m][n]) voisin++;
				}
			}*/
			tmpt[i][j] = (voisin == 3 || (table[i][j] && voisin == 2));
			if(tmpt[i][j]) document.getElementById(i * colonnes + j).className = 'alive';
			else document.getElementById(i * colonnes + j).className = 'dead';
		}
	}
	table = [];
	for (var i = 0; i < lignes; i++) {
		var fuck = [];
		for (var j = 0; j < colonnes; j++) {
			fuck.push(tmpt[i][j]);
		}
		table.push(fuck);
	}
}


var lignes = 0;
var colonnes = 0;
var painting = false;
genTable(150,150);
var isAlive = 0;
var launcher = document.getElementById("launcher");
launcher.onclick = function(){
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = 0;
		launcher.innerHTML = 'Play';
	}
	else {
		isAlive = setInterval(actuTable, 100);
		launcher.innerHTML = 'Pause';
	}
}
document.getElementById("nuke").onclick = function(){
	for (var i = 0; i < lignes; i++) {
		for (var j = 0; j < colonnes; j++) {
			table[i][j] = false;
			document.getElementById(i * colonnes + j).className = 'dead';
		}
	}
}
document.getElementById("fill").onclick = function(){
	for (var i = 0; i < lignes; i++) {
		for (var j = 0; j < colonnes; j++) {
			table[i][j] = true;
			document.getElementById(i * colonnes + j).className = 'alive';
		}
	}
}
document.getElementById("respawn").onclick = function(){
	/*for (var i = 0; i < lignes; i++) {
		for (var j = 0; j < colonnes; j++) {
			table[i][j] = (Math.round(Math.random()) == 0);
			document.getElementById(i * colonnes + j).className = (table[i][j])?'alive':'dead';
		}
	}*/
	genTable(lignes, colonnes);
}
var zoomPlus = 0;
document.getElementById("plus").onmousedown = function(){
	zoomPlus = setInterval(function(){
		document.styleSheets[0].cssRules[0].style.width = Math.min(++document.getElementById(0).offsetWidth, Math.floor(document.body.offsetWidth / lignes)) + 'px';
		document.styleSheets[0].cssRules[0].style.height = Math.min(++document.getElementById(0).offsetHeight, Math.floor(document.body.offsetWidth / lignes)) + 'px';
	}, 100);
}
document.getElementById("plus").onmouseup = function(){
	clearInterval(zoomPlus);
}
document.getElementById("plus").onmouseout = function(){
	clearInterval(zoomPlus);
}
var zoomMoins = 0;
document.getElementById("moins").onmousedown = function(){
	zoomMoins = setInterval(function(){
		document.styleSheets[0].cssRules[0].style.width = Math.max(--document.getElementById(0).offsetWidth, 1) + 'px';
		document.styleSheets[0].cssRules[0].style.height = Math.max(--document.getElementById(0).offsetHeight, 1) + 'px';
	}, 100);
}
document.getElementById("moins").onmouseup = function(){
	clearInterval(zoomMoins);
}
document.getElementById("moins").onmouseout = function(){
	clearInterval(zoomMoins);
}
document.getElementById("onePass").onclick = actuTable;
