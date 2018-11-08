var tempo = Date.now();
var somme = []; 
var table = []; 
var taille = {hauteur:0, largeur:0};


function setCell(ligne, colonne, mode) {
	switch (mode) {
		case 'aleatoire':
			table[ligne][colonne] = (Math.round(Math.random()) == 0);
			break;
	
		case 'vide':
			table[ligne][colonne] = false;
			break;
	
		/*case 'extension':
			table[id] = (typeof(table[tableActuelle][id]) == 'undefined') ? false : table[tableActuelle][id];
			break;*/
	
		default:
			table[ligne][colonne] = false;
	}
}

function setGrilleHTML() {
	var grilleHTML = document.createElement('table');
	grilleHTML.id = 'grille';
	
	for (var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		var ligneHTML = document.createElement('tr');
		
		for (var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			var celluleHTML = document.createElement('td');
			celluleHTML.id = ligne * largeur + colonne;
			celluleHTML.className = (table[ligne][colonne])?'alive':'dead';
			
			//Ajoute les différents évènements de sourie permettant d'éditer la grille manuellement
			celluleHTML.onmouseenter = function(){
				if(painting) changerStatu(this);
			}
			celluleHTML.onmousedown = function(){
				painting = true;
				changerStatu(this);
			}
			celluleHTML.onmouseup = function(){
				painting = false;
			}
			
			ligneHTML.appendChild(celluleHTML);
		}
		grilleHTML.appendChild(ligneHTML);
	}
	var grilleHTMLActuelle = document.getElementById('grille');
	grilleHTMLActuelle.parentNode.replaceChild(grilleHTML, grilleHTMLActuelle);
}

function setGame(mode = 'aleatoire') {
	table = [];
	somme = [];
	for (var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		table[ligne] = [];
		somme[ligne] = [];
		for (var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			setCell(ligne, colonne, mode);
			somme[ligne][colonne] = 0;
		}
	}
	setGrilleHTML();
}

// Ajoute +1 à la somme des voisins de chaque cellule voisine de la cellule indiqué
function ajouterVoisin(ligne, colonne) {
	var largeur = taille.largeur;
	var hauteur = taille.hauteur;
	var iRelatif = 0;
	var jRelatif = 0;
	for (var i = ligne - 1, iFin = ligne + 1; i <= iFin; i++) {
		for (var j = colonne - 1, jFin = colonne + 1; j <= jFin; j++) {
			// valeur relative = connecte les bords (exemple si i = -1 avec une hauteur de 10, -1 +10 = 9 et 9 % 10 = 9 ce qui correspond à la dernière ligne)
			iRelatif = (i < 0) ? hauteur - 1 : (i < hauteur) ? i : 0;
			jRelatif = (j < 0) ? largeur - 1 : (j < largeur) ? j : 0;
			somme[iRelatif][jRelatif]++;
		}
	}
	somme[ligne][colonne]--;
}

function nouveauCycle() {
	for (var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		for (var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			//si la cellule est vivante, ajouter +1 à la somme des voisins de chaque cellule voisine
			if(table[ligne][colonne]) ajouterVoisin(ligne, colonne);
		}
	}
	
	for (var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		for (var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			//Actualise la grille à partir de la somme des voisin de chaque cellule
			var nouveauStatut = (somme[ligne][colonne] == 3 || (table[ligne][colonne] && somme[ligne][colonne] == 2));
			if(table[ligne][colonne] != nouveauStatut) {
				table[ligne][colonne] = nouveauStatut;
				document.getElementById(ligne * largeur + colonne).className = (table[ligne][colonne])?'alive':'dead';
			}
			somme[ligne][colonne] = 0;
		}
	}
	afficheTest.innerHTML = (Date.now() - tempo);
	tempo = Date.now();
}

function changerStatu(elem) {
	elem.className = (elem.className == 'alive')?'dead':'alive';
	var i = Math.floor(elem.id / taille.largeur);
	var j = elem.id % taille.largeur;
	table[i][j] = !(table[i][j]);
}

taille.hauteur = 150;
taille.largeur = 150;
var painting = false;
var afficheTest = document.getElementById("fill");

setGame();

console.log(document.styleSheets[0].cssRules[0]);
document.styleSheets[0].cssRules[0].style.width = (95 / taille.largeur) + 'vh';
document.styleSheets[0].cssRules[0].style.height = (95 / taille.hauteur) + 'vh';

var isAlive = 0;
var launcher = document.getElementById("launcher");
launcher.onclick = function(){
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = 0;
		launcher.innerHTML = 'Play';
	}
	else {
		isAlive = setInterval(nouveauCycle, 10);
		launcher.innerHTML = 'Pause';
	}
}
document.getElementById("nuke").onclick = function(){
	for (var i = 0; i < taille.hauteur; i++) {
		for (var j = 0; j < taille.largeur; j++) {
			table[i][j] = false;
			document.getElementById(i * taille.largeur + j).className = 'dead';
		}
	}
}
document.getElementById("fill").onclick = function(){
	setGame('vide');
}
document.getElementById("respawn").onclick = function(){
	setGame('aleatoire');
}
var zoomPlus = 0;
document.getElementById("plus").onmousedown = function(){
	zoomPlus = setInterval(function(){
		document.styleSheets[0].cssRules[0].style.width = Math.min(++document.getElementById(0).offsetWidth, Math.floor(document.body.offsetWidth / taille.hauteur)) + 'px';
		document.styleSheets[0].cssRules[0].style.height = Math.min(++document.getElementById(0).offsetHeight, Math.floor(document.body.offsetWidth / taille.hauteur)) + 'px';
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
document.getElementById("onePass").onclick = nouveauCycle;
