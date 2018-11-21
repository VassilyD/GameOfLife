var canvasHTML = document.getElementById('gameOfLifeCanvas');
var selectPatternHTML = document.getElementById('patternSelecteur');
var canvas = canvasHTML.getContext('2d');
var tailleEcran = [window.innerWidth, window.innerHeight];
var tailleSelecteurHTML = document.getElementById('tailleSelecteur');
var coordMouse = {x:0, y:0};
var mouseOver = false;
var vitesseSelecteur = document.getElementById('vitesseSelecteur');
var vitesse = 30;
var nbGeneration = 0;
var nbVivant = 0;
var infoStatsHTML = document.getElementById('infoStats');
var myAppInterval = 0;
var tempo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var somme = []; 
var table = []; 
var taille = {hauteur:0, largeur:0};
var taillePixel = 1;
var tailleApparente = {hauteur:0, largeur:0};
var zoom = {depart:{x:0, y:0}, fin:{x:0, y:0}, zoom:0};
var deplacementInterval = 0;
var toucheEnfonce = [];
var deplacementLibre = false;
var isPainting = false;
var shiftPressed = false;
var testPattern = [[false, true, false], [false, false, true], [true, true, true]];
var patternList = {	marcheur:{	
					NE:[[true, true, true], [false, false, true], [false, true, false]], 
					SE:[[false, true, false], [false, false, true], [true, true, true]], 
					SW:[[false, true, false], [true, false, false], [true, true, true]], 
					NW:[[true, true, true], [true, false, false], [false, true, false]]
				},
				oscillateur:{
					ligne:[[true, true, true]],
					grenouille:[[false, true, true, true], [true, true, true, false]]
				},
				canon:{
					gosperGliderGunSE:[
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
						[true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]]		
				},
				generateur:{
					zeroNW:[
						[false, false, false, false, false, false, true, false],
						[false, false, false, false, true, false, true, true],
						[false, false, false, false, true, false, true, false],
						[false, false, false, false, true, false, false, false],
						[false, false, true, false, false, false, false, false],
						[true, false, true, false, false, false, false, false],],
					unNW:[
						[true, true, true, false, true],
						[true, false, false, false, false],
						[false, false, false, true, true],
						[false, true, true, false, true],
						[true, false, true, false, true]],
					deuxNSE:[[true, true, true, true, true, true, true, true, false, true, true, true, true, true, false, false, false, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, false, true, true, true, true, true]]
				},
				block:{
					carre:[[true, true], [true, true]],
					tube:[
						[false, true, false], 
						[true, false, true], 
						[false, true, false]],
					pecheur:[
						[true, true, false, false], 
						[true, false, true, false], 
						[false, false, true, false], 
						[false, false, true, true]],
					python:[
						[false, false, false, true, true], 
						[true, false, true, false, true], 
						[true, true, false, false, false]]
				}
};
var patternActuel = testPattern.slice();

/************ Gestion de l'affichage du canvas ******************/

// Affiche la grille de cellule
function dessinerJeu(){
	
	canvas.clearRect(0, 0, canvasHTML.clientWidth, canvasHTML.clientHeight);
	
	//création d'un fond noir
	canvas.fillStyle = '#000000';
	canvas.fillRect(0,0,canvasHTML.clientWidth, canvasHTML.clientHeight);
	//canvas.fillRect(0,0,canvasHTML.clientWidth,canvasHTML.clientHeight);
	
	//création des cellules vivantes
	canvas.fillStyle = '#ffffff';
	for(var ligne = zoom.depart.y, i = 0, hauteur = tailleApparente.hauteur; i < hauteur; ligne = ++ligne % taille.hauteur, i++) {
		for(var colonne = zoom.depart.x, j = 0, largeur = tailleApparente.largeur; j < largeur; colonne = ++colonne % taille.largeur, j++) {
			if(table[ligne][colonne]) canvas.fillRect((j) * taillePixel, (i) * taillePixel, taillePixel, taillePixel);
			if(deplacementLibre && ((ligne == 0 && colonne == zoom.fin.x) || (colonne == 0 && ligne == zoom.fin.y))) {
				canvas.fillStyle = 'rgba(255,0,0,0.33)';
				if(ligne == 0) canvas.fillRect(0, i * taillePixel - 2, tailleApparente.largeur * taillePixel, 2);
				if(colonne == 0) canvas.fillRect(j * taillePixel - 2, 0, 2, tailleApparente.hauteur * taillePixel);
				canvas.fillStyle = '#ffffff';
			}
		}
	}
}

// Affichage de l'outils selectionné
function dessinerOutil(){
	canvas.fillStyle = 'rgba(255,0,0,1)';
	
	if(shiftPressed) {
		for(var ligne = 0; ligne < patternActuel.length; ligne++){
			for(var col = 0; col < patternActuel[ligne].length; col++){
				//xRel et yRel permettent de connecter les bord entre eux
				var xRel = coordMouse.x + col;
				xRel = (xRel >= taille.largeur) ? (xRel - taille.largeur) : (xRel < 0) ? xRel + taille.largeur : xRel;
				var yRel = coordMouse.y + ligne;
				yRel = (yRel >= taille.hauteur) ? (yRel - taille.hauteur) : (yRel < 0) ? yRel + taille.hauteur : yRel;
				canvas.fillStyle = (patternActuel[ligne][col]) ? 'rgba(255,0,0,0.9)' : 'rgba(0,0,0,0.9)';
				canvas.fillRect(((xRel - zoom.depart.x + taille.largeur) % taille.largeur) * taillePixel, ((yRel - zoom.depart.y + taille.hauteur) % taille.hauteur) * taillePixel, taillePixel, taillePixel);
			}
		}
	}
	else canvas.fillRect(((coordMouse.x - zoom.depart.x + taille.largeur) % taille.largeur) * taillePixel, ((coordMouse.y - zoom.depart.y + taille.hauteur) % taille.hauteur) * taillePixel, taillePixel, taillePixel);
}

function dessinerCanvas() {	
	dessinerJeu();
	
	if(mouseOver) {
		dessinerOutil();
	}
}

function calculerDimension() {
	var ratio;
	
	tailleApparente.largeur = (zoom.depart.x < zoom.fin.x) ? zoom.fin.x - zoom.depart.x + 1 : taille.largeur - zoom.depart.x + zoom.fin.x + 1;
	tailleApparente.hauteur = (zoom.depart.y < zoom.fin.y) ? zoom.fin.y - zoom.depart.y + 1 : taille.hauteur - zoom.depart.y + zoom.fin.y + 1;
	
	ratio = tailleApparente.largeur / tailleApparente.hauteur;
	
	canvasHTML.style.width = Math.min(100 * ratio, 100) + '%';
	canvasHTML.style.height = Math.min(100 / ratio, 100) + '%';
	canvasHTML.style.right = Math.max(50 * (1 - ratio), 0) + '%';
	canvasHTML.style.top = Math.max(50 * (1 - 1 / ratio), 0) + '%';
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	
	taillePixel = (tailleApparente.largeur < tailleApparente.hauteur) ? canvasHTML.clientHeight / tailleApparente.hauteur : canvasHTML.clientWidth / tailleApparente.largeur;
}

window.onresize = function(){
	calculerDimension();
	dessinerCanvas();
}

/************ Fin de l'affichage du canvas ******************/

function positionSourieCanvas(e){
    var x = e.offsetX;
    var y = e.offsetY;
	coordMouse.x = (zoom.depart.x + Math.floor(x / taillePixel)) % taille.largeur;
	coordMouse.y = (zoom.depart.y + Math.floor(y / taillePixel)) % taille.hauteur;
}

function changerTaille() {
	taille.hauteur = tailleSelecteurHTML.elements[0].value * 1;
	taille.largeur = tailleSelecteurHTML.elements[1].value * 1;
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	setGame();
}

function zoomViaClavier() {
	if (toucheEnfonce[107] || toucheEnfonce[109]) {
		var e = {};
		e.offsetX = canvasHTML.width / 2;
		e.offsetY = canvasHTML.height / 2;
		e.deltaY = (toucheEnfonce[107]) ? -1 : (toucheEnfonce[109]) ? 1 : 0;
		zooming(e);
	}
}

// Obsolète mais gardé au cas ou
function zoomingOld(e) {
	positionSourieCanvas(e);
	
	var coordMouseRel = {	x:(coordMouse.x - zoom.depart.x + taille.largeur) % taille.largeur, // coordonné du pointeur dans la zone visible
							y:(coordMouse.y - zoom.depart.y + taille.hauteur) % taille.hauteur}	
	var coordMouseRatio = {	x:(coordMouseRel.x / (tailleApparente.largeur -1 ) - 0.5) * 2, // vaut entre -1 et +1 selon si la sourie est plus ou moins à gauche ou plus ou moins à droite
							y:(coordMouseRel.y / (tailleApparente.hauteur - 1) - 0.5) * 2} // même chose mais entre le haut et le bas/**/
							
	var deltaRatio = {x:Math.max(Math.abs(e.deltaY) * tailleApparente.largeur / 60, 1), y:Math.max(Math.abs(e.deltaY) * tailleApparente.hauteur / 60, 1)}; // adapte le delta à la taille de la zone visible
	
	var deltaWheel = e.deltaY / Math.abs(e.deltaY); // molette vers l'avant = -1 = zoom in, molette vers l'arrière = 1 = zoom out
	
	var delta = {	
		left:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio.x * (1 - coordMouseRatio.x) >= taille.largeur - 1 - zoom.fin.x) ? deltaRatio.x * 2 + zoom.fin.x - (taille.largeur - 1) : deltaRatio.x * (1 + coordMouseRatio.x)),
		right:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio.x * (1 + coordMouseRatio.x) > zoom.depart.x) ? deltaRatio.x * 2 - zoom.depart.x : deltaRatio.x * (1 - coordMouseRatio.x)),
		top:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio.y * (1 - coordMouseRatio.y) >= taille.hauteur - 1 - zoom.fin.y) ? deltaRatio.y * 2 + zoom.fin.y - (taille.hauteur - 1) : deltaRatio.y * (1 + coordMouseRatio.y)),
		bottom:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio.y * (1 + coordMouseRatio.y) > zoom.depart.y) ? deltaRatio.y * 2 - zoom.depart.y : deltaRatio.y * (1 - coordMouseRatio.y))};
	
	// 1) Application du delta
	// 2) Empêche un zoom plus fort que 10 cellule de côté
	// 3) Empêche de sortir des limites de la grille   !deplacementLibre
	function zoomAdapt(){
		return {X:{t: zoom.fin.x < zoom.depart.x, vfi: zoom.fin.x + taille.largeur, vfo: zoom.fin.x - taille.largeur, vdi: zoom.depart.x - taille.largeur, vdo: zoom.depart.x + taille.largeur}, 
				Y:{t: zoom.fin.y < zoom.depart.y, vfi: zoom.fin.y + taille.hauteur, vfo: zoom.fin.y - taille.hauteur, vdi: zoom.depart.y - taille.hauteur, vdo: zoom.depart.y + taille.hauteur}};
	}
	var adapt = zoomAdapt();
	
	if(!(tailleApparente.largeur == taille.largeur && tailleApparente.largeur < tailleApparente.hauteur)) zoom.depart.x = Math.round(Math.min(Math.max(Math.min(zoom.depart.x - delta.left, ((adapt.X.t) ? adapt.X.vfi : zoom.fin.x) - 9), ((deplacementLibre) ? (((adapt.X.t) ? zoom.fin.x : adapt.X.vfo) + 1) : 0)), (deplacementLibre) ? zoom.depart.x + Math.abs(delta.left) : taille.largeur - 10) + taille.largeur) % taille.largeur;
	
	if(!(tailleApparente.hauteur == taille.hauteur && tailleApparente.hauteur < tailleApparente.largeur)) zoom.depart.y = Math.round(Math.min(Math.max(Math.min(zoom.depart.y - delta.top, ((adapt.Y.t) ? adapt.Y.vfi : zoom.fin.y) - 9), ((deplacementLibre) ? (((adapt.Y.t) ? zoom.fin.y : adapt.Y.vfo) + 1) : 0)), (deplacementLibre) ? zoom.depart.y + Math.abs(delta.top) : taille.hauteur - 10) + taille.hauteur) % taille.hauteur;
	
	adapt = zoomAdapt();
	
	if(!(tailleApparente.largeur == taille.largeur && tailleApparente.largeur < tailleApparente.hauteur)) zoom.fin.x = Math.round(Math.min(Math.max(zoom.fin.x + delta.right, ((adapt.X.t) ? adapt.X.vdi : zoom.depart.x) + 9), ((deplacementLibre) ? (((adapt.X.t) ? zoom.depart.x : adapt.X.vdo) - 1) : taille.largeur - 1)) + taille.largeur) % taille.largeur;
	
	if(!(tailleApparente.hauteur == taille.hauteur && tailleApparente.hauteur < tailleApparente.largeur)) zoom.fin.y = Math.round(Math.min(Math.max(zoom.fin.y + delta.bottom, ((adapt.Y.t) ? adapt.Y.vdi : zoom.depart.y) + 9), ((deplacementLibre) ? (((adapt.Y.t) ? zoom.depart.y : adapt.Y.vdo) - 1) : taille.hauteur - 1)) + taille.hauteur) % taille.hauteur;
	
	calculerDimension();
	dessinerCanvas();
	
}

function zooming(e) {
	positionSourieCanvas(e);
	
	var coordMouseRel = {	x:(coordMouse.x - zoom.depart.x + taille.largeur) % taille.largeur, // coordonné du pointeur dans la zone visible
							y:(coordMouse.y - zoom.depart.y + taille.hauteur) % taille.hauteur}	
	var coordMouseRatio = {	x:(coordMouseRel.x / (tailleApparente.largeur -1 ) - 0.5) * 2, // vaut entre -1 et +1 selon si la sourie est plus ou moins à gauche ou plus ou moins à droite
							y:(coordMouseRel.y / (tailleApparente.hauteur - 1) - 0.5) * 2} // même chose mais entre le haut et le bas/**/
							
	var deltaRatio = Math.round(Math.max(Math.abs(e.deltaY) * zoom.zoom / 60, 1)); // adapte le delta à la taille de la zone visible
	
	var deltaWheel = e.deltaY / Math.abs(e.deltaY); // molette vers l'avant = -1 = zoom in, molette vers l'arrière = 1 = zoom out
	
	var delta = {	
		left:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio * (1 - coordMouseRatio.x) >= taille.largeur - 1 - zoom.fin.x) ? deltaRatio * 2 + zoom.fin.x - (taille.largeur - 1) : deltaRatio * (1 + coordMouseRatio.x)),
		top:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio * (1 - coordMouseRatio.y) >= taille.hauteur - 1 - zoom.fin.y) ? deltaRatio * 2 + zoom.fin.y - (taille.hauteur - 1) : deltaRatio * (1 + coordMouseRatio.y))};
	
	zoom.zoom = Math.min(Math.max(zoom.zoom + deltaWheel * 2 * deltaRatio, 9), Math.max(taille.largeur - 1, taille.hauteur - 1));
	
	// 1) Application du delta
	// 2) Empêche un zoom plus fort que 10 cellule de côté
	// 3) Empêche de sortir des limites de la grille   !deplacementLibre
	var adapt = {	X:{t: zoom.fin.x < zoom.depart.x, vfi: zoom.fin.x + taille.largeur, vfo: zoom.fin.x - taille.largeur}, 
					Y:{t: zoom.fin.y < zoom.depart.y, vfi: zoom.fin.y + taille.hauteur, vfo: zoom.fin.y - taille.hauteur}};
	
	if(!(tailleApparente.largeur == taille.largeur && tailleApparente.largeur < tailleApparente.hauteur)) zoom.depart.x = Math.round(Math.min(Math.max(Math.min(zoom.depart.x - delta.left, ((adapt.X.t) ? adapt.X.vfi : zoom.fin.x) - 9), ((deplacementLibre) ? (((adapt.X.t) ? zoom.fin.x : adapt.X.vfo) + 1) : 0)), (deplacementLibre) ? zoom.depart.x + Math.abs(delta.left) : taille.largeur - 10) + taille.largeur) % taille.largeur;
	
	if(!(tailleApparente.hauteur == taille.hauteur && tailleApparente.hauteur < tailleApparente.largeur)) zoom.depart.y = Math.round(Math.min(Math.max(Math.min(zoom.depart.y - delta.top, ((adapt.Y.t) ? adapt.Y.vfi : zoom.fin.y) - 9), ((deplacementLibre) ? (((adapt.Y.t) ? zoom.fin.y : adapt.Y.vfo) + 1) : 0)), (deplacementLibre) ? zoom.depart.y + Math.abs(delta.top) : taille.hauteur - 10) + taille.hauteur) % taille.hauteur;
	
	zoom.fin.x = (zoom.depart.x + Math.min(zoom.zoom, taille.largeur - 1)) % taille.largeur;
	zoom.fin.y = (zoom.depart.y + Math.min(zoom.zoom, taille.hauteur - 1)) % taille.hauteur;
	
	calculerDimension();
	dessinerCanvas();
	
}

document.getElementById('tailleSelecteurBouton').onclick = changerTaille;

function setCell(ligne, colonne, mode) {
	switch (mode) {
		case 'aleatoire':
			table[ligne][colonne] = (Math.random() <= 0.3);
			if(table[ligne][colonne]) nbVivant++;
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
	zoom.depart = {x:0, y:0};
	zoom.fin = {x:taille.largeur - 1, y:taille.hauteur - 1};
	zoom.zoom = Math.max(taille.largeur - 1, taille.hauteur - 1);
	calculerDimension();
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
	var nbVivantPasse = nbVivant;
	nbVivant = 0;
	for (var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		for (var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			//si la cellule est vivante, ajouter +1 à la somme des voisins de chaque cellule voisine
			if(table[ligne][colonne]) {
				ajouterVoisin(ligne, colonne);
				nbVivant++;
			}
		}
	}
	
	for (var ligne = 0, hauteur = taille.hauteur; ligne < hauteur; ligne++) {
		for (var colonne = 0, largeur = taille.largeur; colonne < largeur; colonne++) {
			//Actualise la grille à partir de la somme des voisin de chaque cellule
			var nouveauStatut = (somme[ligne][colonne] == 3 || (table[ligne][colonne] && somme[ligne][colonne] == 2));
			if(table[ligne][colonne] != nouveauStatut) {
				table[ligne][colonne] = nouveauStatut;
			}
			somme[ligne][colonne] = 0;
		}
	}
	var tempsTemp = 0;
	for(var i = 1; i < 10; i++) tempsTemp += (tempo[i] - tempo[i-1]);
	tempsTemp /= 10;
	afficheTest.innerHTML = (Math.floor(100000 / tempsTemp) / 100) + ' FPS';;
	tempo.push(Date.now());
	tempo.shift();
	nbGeneration++;
	infoStatsHTML.innerHTML = 'Génération ' + nbGeneration + ' : ' + nbVivant + ' Cellule vivante (' + ((nbVivant >= nbVivantPasse) ? '+' : '') + (nbVivant - nbVivantPasse) + ')';
}

function myApp() {
	if(toucheEnfonce) {
		zoomViaClavier();
		deplacementCanvasPre();
	}
	dessinerCanvas();
}

/************* Initialisation *************/
window.onload = function() {
	taille.hauteur = 100;
	taille.largeur = 100;
	tailleSelecteurHTML.elements[0].value = taille.hauteur;
	tailleSelecteurHTML.elements[1].value = taille.largeur;
	canvasHTML.style.width = '90vh';
	canvasHTML.style.height = '90vh';
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	
	setGame();

	myAppInterval = setInterval(myApp, 16.67);
	infoStatsHTML.innerHTML = 'Génération 0 : ' + nbVivant + ' Cellule vivante (+0)';
}/**/

/************* Fin Initialisation *********/

var afficheTest = document.getElementById("fill");

var isAlive = 0;
var launcher = document.getElementById("launcher");
launcher.onclick = function(){
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = 0;
		launcher.innerHTML = 'Play';
		afficheTest.innerHTML = '';
		if(vitesse < 16.67) {
			clearInterval(myAppInterval);
			myAppInterval = setInterval(myApp, 16.67);
		}
	}
	else {
		isAlive = setInterval(nouveauCycle, vitesse);
		launcher.innerHTML = 'Pause';
		if(vitesse < 16.67) {
			clearInterval(myAppInterval);
			myAppInterval = setInterval(myApp, vitesse);
		}
	}
}
document.getElementById("nuke").onclick = function(){
	for (var i = 0; i < taille.hauteur; i++) {
		for (var j = 0; j < taille.largeur; j++) {
			table[i][j] = false;
		}
	}
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = 0;
		launcher.innerHTML = 'Play';
		afficheTest.innerHTML = '';
		if(vitesse < 16.67) {
			clearInterval(myAppInterval);
			myAppInterval = setInterval(myApp, 16.67);
		}
	}
	nbGeneration = 0;
	nbVivant = 0;
	infoStatsHTML.innerHTML = 'Génération 0 : 0 Cellule vivante (+0)';
}

document.getElementById("respawn").onclick = function(){
	nbGeneration = 0;
	nbVivant = 0;
	setGame('aleatoire');
	infoStatsHTML.innerHTML = 'Génération 0 : ' + nbVivant + ' Cellule vivante (+0)';
}

document.getElementById("deplacementLibre").onclick = function(){
	deplacementLibre = !deplacementLibre;
	if (zoom.depart.x + tailleApparente.largeur >= taille.largeur) {
		var delta = zoom.depart.x + tailleApparente.largeur - taille.largeur;
		if(delta > tailleApparente.largeur / 2) delta = -1 * (tailleApparente.largeur - delta);
		
		zoom.depart.x = (zoom.depart.x - delta + taille.largeur) % taille.largeur;
		zoom.fin.x = (zoom.fin.x - delta + taille.largeur) % taille.largeur;
	}
	if (zoom.depart.y + tailleApparente.hauteur >= taille.hauteur) {
		var delta = zoom.depart.y + tailleApparente.hauteur - taille.hauteur;
		if(delta > tailleApparente.hauteur / 2) delta = -1 * (tailleApparente.hauteur - delta);
		
		zoom.depart.y = (zoom.depart.y - delta + taille.hauteur) % taille.hauteur;
		zoom.fin.y = (zoom.fin.y - delta + taille.hauteur) % taille.hauteur;
	}
	document.getElementById("deplacementLibre").innerHTML = (deplacementLibre) ? 'Désactiver déplacement libre' : 'Activer déplacement libre';
}

document.getElementById("onePass").onclick = nouveauCycle;

vitesseSelecteur.oninput = function(e){
	vitesse = (250 - vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = (Math.floor(100000 / vitesse) / 100) + ' FPS';
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = setInterval(nouveauCycle, vitesse);
		if(vitesse < 16.67) {
			clearInterval(myAppInterval);
			myAppInterval = setInterval(myApp, vitesse);
		}
		else {
			clearInterval(myAppInterval);
			myAppInterval = setInterval(myApp, 16.67);
		}
	}
}

/****************  Painting options  ***********************/

//Génération du selecteur
function selectionPatternFinal(e){
	var selectLVL1 = document.getElementById('patternsLVL1');
	var selectLVL2 = document.getElementById('patternsLVL2');
	patternActuel = patternList[selectLVL1.value][selectLVL2.value].slice();
}

function selectionSousPattern(e) {
	if(choixTmp = document.getElementById('patternsLVL2')) selectPatternHTML.removeChild(choixTmp);
	
	var selectLVL1 = document.getElementById('patternsLVL1');
	var selecteurPatternTmp = document.createElement('select');
	selecteurPatternTmp.name = 'patternsLVL2';
	selecteurPatternTmp.id = 'patternsLVL2';
	selecteurPatternTmp.setAttribute('oninput', "selectionPatternFinal(event)");
	var choixTmp = document.createElement('option');
	choixTmp.value = '';
	choixTmp.innerHTML = 'Selectionner patron';
	selecteurPatternTmp.appendChild(choixTmp);
	for(pattern in patternList[selectLVL1.value]) {
		var choixTmp = document.createElement('option');
		choixTmp.value = pattern;
		choixTmp.innerHTML = pattern;
		selecteurPatternTmp.appendChild(choixTmp);
	}
	selectPatternHTML.appendChild(selecteurPatternTmp);
}

var selecteurPatternTmp = document.createElement('select');
selecteurPatternTmp.name = 'patternsLVL1';
selecteurPatternTmp.id = 'patternsLVL1';
selecteurPatternTmp.setAttribute('oninput', "selectionSousPattern(event)");
var choixTmp = document.createElement('option');
choixTmp.value = '';
choixTmp.innerHTML = 'Selectionner banque';
selecteurPatternTmp.appendChild(choixTmp);
for(pattern in patternList) {
	var choixTmp = document.createElement('option');
	choixTmp.value = pattern;
	choixTmp.innerHTML = pattern;
	selecteurPatternTmp.appendChild(choixTmp);
}
selectPatternHTML.appendChild(selecteurPatternTmp);



function painting(e) {
	positionSourieCanvas(e);
    var coor = "Coordinates: (" + coordMouse.x + "," + coordMouse.y + ")";
    document.getElementById("testtt").innerHTML = coor;
	if(isPainting && !shiftPressed) {
		table[coordMouse.y][coordMouse.x] = (e.altKey) ? false : true;
	}
}

function paintingStart(e) {
	isPainting = true;
	positionSourieCanvas(e);
	if(shiftPressed) {
		for(var ligne = 0; ligne < patternActuel.length; ligne++){
			for(var col = 0; col < patternActuel[ligne].length; col++){
				var xRel = coordMouse.x + col;
				xRel = (xRel >= taille.largeur) ? (xRel - taille.largeur) : (xRel < 0) ? xRel + taille.largeur : xRel;
				var yRel = coordMouse.y + ligne;
				yRel = (yRel >= taille.hauteur) ? (yRel - taille.hauteur) : (yRel < 0) ? yRel + taille.hauteur : yRel;
				table[yRel][xRel] = patternActuel[ligne][col];
			}
		}
	}
	else {
		table[coordMouse.y][coordMouse.x] = (e.altKey) ? false : true;
	}
}

function paintingStop(e) {
	isPainting = false;
}

//Quand la sourie entre sur la grille
function paintingPre(e) {
	mouseOver = true;
}

//Quand la sourie quitte la grille
function paintingLeave() {
	mouseOver = false;
	isPainting = false;
    document.getElementById("testtt").innerHTML = '';
}

function deplacementCanvas(direction) {
	delta = {x:Math.max(1, Math.round(tailleApparente.largeur / 75)), y:Math.max(1, Math.round(tailleApparente.hauteur / 75))};
	if(direction[0] != 0) {
		if(!deplacementLibre) {
			zoom.depart.x = Math.min(Math.max(zoom.depart.x + direction[0] * delta.x, 0),  taille.largeur - tailleApparente.largeur);
			zoom.fin.x = Math.min(Math.max(zoom.fin.x + direction[0] * delta.x, tailleApparente.largeur - 1),  taille.largeur - 1);
		} else {
			zoom.depart.x = (zoom.depart.x + direction[0] * delta.x + taille.largeur) % taille.largeur;
			zoom.fin.x = (zoom.fin.x + direction[0] * delta.x + taille.largeur) % taille.largeur;
		}
	}
	if(direction[1] != 0) {
		if(!deplacementLibre) {
			zoom.depart.y = Math.min(Math.max(zoom.depart.y + direction[1] * delta.y, 0),  taille.hauteur - tailleApparente.hauteur);
			zoom.fin.y = Math.min(Math.max(zoom.fin.y + direction[1] * delta.y, tailleApparente.hauteur - 1),  taille.hauteur - 1);
		} else {
			zoom.depart.y = (zoom.depart.y + direction[1] * delta.y + taille.hauteur) % taille.hauteur;
			zoom.fin.y = (zoom.fin.y + direction[1] * delta.y + taille.hauteur) % taille.hauteur;
		}
	}
}

function deplacementCanvasPre() {
	var direction = [0, 0];
    if (toucheEnfonce && toucheEnfonce[37]) {direction[0] = -1; }
    if (toucheEnfonce && toucheEnfonce[39]) {direction[0] = 1; }
    if (toucheEnfonce && toucheEnfonce[38]) {direction[1] = -1; }
    if (toucheEnfonce && toucheEnfonce[40]) {direction[1] = 1; }
	deplacementCanvas(direction);
}

//Active certain booléen en fonction des touche enfoncé
function activeControle(e) {
	var keyCode = e.which || e.keyCode;
	if(e.key == 'Shift') shiftPressed = true;
}

//Désctive certain booléen en fonction des touche enfoncé
function desactiveControle(e) {
	var keyCode = e.which || e.keyCode;
	if(e.key == 'Shift') shiftPressed = false;
}

canvasHTML.setAttribute('onmousemove', "painting(event)");
canvasHTML.setAttribute('onmousedown', "paintingStart(event)");
canvasHTML.setAttribute('onmouseup', "paintingStop(event)");
canvasHTML.setAttribute('onmouseleave', "paintingLeave(event)");
canvasHTML.setAttribute('onmouseenter', "paintingPre(event)");
canvasHTML.setAttribute('onwheel', "zooming(event)");

//document.body.setAttribute('onkeydown', "activeControle(event)");
//document.body.setAttribute('onkeyup', "desactiveControle(event)");


window.addEventListener('keydown', function (e) {
	var keyCode = e.which || e.keyCode;
	if(e.key == 'Shift') shiftPressed = true;
	//e.preventDefault();
	toucheEnfonce = (toucheEnfonce || []);
	toucheEnfonce[keyCode] = (e.type == "keydown");
})
window.addEventListener('keyup', function (e) {
	var keyCode = e.which || e.keyCode;
	if(e.key == 'Shift') shiftPressed = false;
	toucheEnfonce[keyCode] = (e.type == "keydown");
})