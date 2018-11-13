var canvasHTML = document.getElementById('gameOfLifeCanvas');
var canvas = canvasHTML.getContext('2d');
var tailleEcran = [window.innerWidth, window.innerHeight];
var tailleSelecteurHTML = document.getElementById('tailleSelecteur');



function drawCanvasTest () {
	var taillePixelX = canvasHTML.clientWidth / taille.largeur;
	var taillePixelY = canvasHTML.clientHeight / taille.hauteur;
	canvas.fillStyle = '#000000';
	canvas.fillRect(0,0,canvasHTML.clientWidth,canvasHTML.clientHeight);
	canvas.fillStyle = '#ffffff';
	for(var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		for(var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			if(table[ligne][colonne]) canvas.fillRect(colonne * taillePixelX, ligne * taillePixelY, taillePixelX, taillePixelY);
		}
	}
}

function changerTaille() {
	taille.hauteur = tailleSelecteurHTML.elements[0].value * 1;
	taille.largeur = tailleSelecteurHTML.elements[1].value * 1;
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	setGame();
}


document.getElementById('tailleSelecteurBouton').onclick = changerTaille;


canvasHTML.onresize = function(){
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
}



















var tempo = Date.now();
var somme = []; 
var table = []; 
var taille = {hauteur:0, largeur:0};
var zoom = 100;


function setCell(ligne, colonne, mode) {
	switch (mode) {
		case 'aleatoire':
			table[ligne][colonne] = (Math.round(Math.random()) == 0);
			break;
	
		case 'vide':
			table[ligne][colonne] = false;
			break;
	
		case 'extension':
			table[ligne][colonne] = (typeof(table[ligne][colonne]) == 'undefined') ? false : table[ligne][colonne];
			break;
	
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
			if(table[ligne][colonne]) celluleHTML.classList.toggle('alive');
			
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
	//setGrilleHTML();
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	drawCanvasTest();
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
				//document.getElementById(ligne * largeur + colonne).classList.toggle('alive');
			}
			somme[ligne][colonne] = 0;
		}
	}
	drawCanvasTest();
	afficheTest.innerHTML = (Date.now() - tempo);
	tempo = Date.now();
}

function changerStatu(elem) {
	elem.classList.toggle('alive');
	var i = Math.floor(elem.id / taille.largeur);
	var j = elem.id % taille.largeur;
	table[i][j] = !(table[i][j]);
}

taille.hauteur = 100;
taille.largeur = 100;
tailleSelecteurHTML.elements[0].value = taille.hauteur;
tailleSelecteurHTML.elements[1].value = taille.largeur
var painting = false;
var afficheTest = document.getElementById("fill");

setGame();

var ratio = (taille.hauteur / taille.largeur) * (document.getElementById('container').clientWidth / document.getElementById('container').clientHeight);
window.onresize = function(){
	ratio = (taille.hauteur / taille.largeur) * (document.getElementById('container').clientWidth / document.getElementById('container').clientHeight);
	document.styleSheets[0].cssRules[0].style.width = (zoom) + '%';
	document.styleSheets[0].cssRules[0].style.height = (zoom * ratio) + '%';
}
document.styleSheets[0].cssRules[0].style.width = (zoom) + '%';
document.styleSheets[0].cssRules[0].style.height = (zoom * ratio) + '%';

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
		zoom *= 1.1;
		if(zoom > (10 * taille.largeur)) zoom = 10 * taille.largeur;
		document.styleSheets[0].cssRules[0].style.width = (zoom) + '%';
		document.styleSheets[0].cssRules[0].style.height = (zoom * ratio) + '%';
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
		zoom *= 0.9;
		if(zoom < 100) zoom = 100;
		document.styleSheets[0].cssRules[0].style.width = (zoom) + '%';
		document.styleSheets[0].cssRules[0].style.height = (zoom * ratio) + '%';
	}, 100);
}
document.getElementById("moins").onmouseup = function(){
	clearInterval(zoomMoins);
}
document.getElementById("moins").onmouseout = function(){
	clearInterval(zoomMoins);
}
document.getElementById("onePass").onclick = nouveauCycle;
