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
var dessinerCanvasInterval = 0;
var tempo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var somme = []; 
var table = []; 
var taille = {hauteur:0, largeur:0};
var taillePixel = {x:1, y:1};
var tailleApparente = {hauteur:0, largeur:0};
var zoom = {depart:{x:0, y:0}, fin:{x:0, y:0}};
var deplacementInterval = 0;
var toucheEnfonce = [];
var deplacementSansBord = false;
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
function dessinerJeu(taillePixel){
	
	canvas.clearRect(0, 0, canvasHTML.clientWidth, canvasHTML.clientHeight);
	
	//création d'un fond noir
	canvas.fillStyle = '#000000';
	canvas.fillRect(0,0,tailleApparente.largeur * taillePixel.x, tailleApparente.hauteur * taillePixel.y);
	//canvas.fillRect(0,0,canvasHTML.clientWidth,canvasHTML.clientHeight);
	
	//création des cellules vivantes
	canvas.fillStyle = '#ffffff';
	/*for(var ligne = zoom.depart.y, hauteur = zoom.fin.y; ligne <= hauteur; ligne++) {
		for(var colonne = zoom.depart.x, largeur = zoom.fin.x; colonne <= largeur; colonne++) {
			if(table[ligne][colonne]) canvas.fillRect((colonne - zoom.depart.x) * taillePixel.x, (ligne - zoom.depart.y) * taillePixel.y, taillePixel.x, taillePixel.y);
		}
	}//*/
	/*tailleApparente.largeur = (zoom.depart.x < zoom.fin.x) ? zoom.fin.x - zoom.depart.x : taille.largeur - zoom.depart.x + zoom.fin.x;
	tailleApparente.hauteur = (zoom.depart.y < zoom.fin.y) ? zoom.fin.y - zoom.depart.y : taille.hauteur - zoom.depart.y + zoom.fin.y;//*/
	for(var ligne = zoom.depart.y, i = 0, hauteur = tailleApparente.hauteur; i < hauteur; ligne = ++ligne % taille.hauteur, i++) {
		for(var colonne = zoom.depart.x, j = 0, largeur = tailleApparente.largeur; j < largeur; colonne = ++colonne % taille.largeur, j++) {
			if(table[ligne][colonne]) canvas.fillRect((j) * taillePixel.x, (i) * taillePixel.y, taillePixel.x, taillePixel.y);
		}
	}//*/
}

// Affichage de l'outils selectionné
function dessinerOutil(taillePixel){
	canvas.fillStyle = '#ff0000';
	
	if(shiftPressed) {
		for(var ligne = 0; ligne < patternActuel.length; ligne++){
			for(var col = 0; col < patternActuel[ligne].length; col++){
				//xRel et yRel permettent de connecter les bord entre eux
				var xRel = coordMouse.x + col;
				xRel = (xRel >= taille.largeur) ? (xRel - taille.largeur) : (xRel < 0) ? xRel + taille.largeur : xRel;
				var yRel = coordMouse.y + ligne;
				yRel = (yRel >= taille.hauteur) ? (yRel - taille.hauteur) : (yRel < 0) ? yRel + taille.hauteur : yRel;
				if(patternActuel[ligne][col]) canvas.fillRect((xRel - zoom.depart.x) * taillePixel.x, (yRel - zoom.depart.y) * taillePixel.y, taillePixel.x, taillePixel.y);
			}
		}
	}
	else canvas.fillRect((coordMouse.x - zoom.depart.x) * taillePixel.x, (coordMouse.y - zoom.depart.y) * taillePixel.y, taillePixel.x, taillePixel.y);
}

function dessinerCanvas() {
	taillePixel = {	x:(canvasHTML.clientWidth / tailleApparente.largeur), 
						y:(canvasHTML.clientHeight / tailleApparente.hauteur)}
	
	zoomViaClavier();
	deplacementCanvasPre();
	
	dessinerJeu(taillePixel);
	
	if(mouseOver) {
		dessinerOutil(taillePixel);
	}
}

window.onresize = function(){
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	dessinerCanvas();
}

/************ Fin de l'affichage du canvas ******************/

function positionSourieCanvas(e){
    var x = e.offsetX;
    var y = e.offsetY;
	//tailleApparente = {hauteur:(zoom.fin.y - zoom.depart.y), largeur:(zoom.fin.x - zoom.depart.x)};
	taillePixel.x = canvasHTML.clientWidth / tailleApparente.largeur;
	taillePixel.y = canvasHTML.clientHeight / tailleApparente.hauteur;
	coordMouse.x = zoom.depart.x + Math.floor(x / taillePixel.x);
	coordMouse.y = zoom.depart.y + Math.floor(y / taillePixel.y);
}

function changerTaille() {
	taille.hauteur = tailleSelecteurHTML.elements[0].value * 1;
	taille.largeur = tailleSelecteurHTML.elements[1].value * 1;
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	setGame();
}

function zoomViaClavier() {
	if (toucheEnfonce && (toucheEnfonce[107] || toucheEnfonce[109])) {
		var e = {};
		e.offsetX = canvasHTML.width / 2;
		e.offsetY = canvasHTML.height / 2;
		e.deltaY = (toucheEnfonce[107]) ? -1 : (toucheEnfonce[109]) ? 1 : 0;
		zooming(e);
	}
}

function zooming(e) {
	positionSourieCanvas(e);
	
	var coordMouseRel = {	x:(coordMouse.x - zoom.depart.x), // coordonné du pointeur dans la zone affiché
							y:(coordMouse.y - zoom.depart.y)}	
	var coordMouseRatio = {	x:(coordMouseRel.x / tailleApparente.largeur - 0.5) * 2, // vaut entre -1 et +1 selon si la sourie est plus ou moins à gauche ou plus ou moins à droite
							y:(coordMouseRel.y / tailleApparente.hauteur - 0.5) * 2} // même chose mais entre le haut et le bas
							
	var deltaRatio = {x:Math.max(tailleApparente.largeur * Math.abs(e.deltaY) / 60, 1), y:Math.max(tailleApparente.hauteur * Math.abs(e.deltaY)/ 60, 1)};
	
	var deltaWheel = e.deltaY / Math.abs(e.deltaY); // molette vers l'avant = -1 = zoom in, molette vers l'arrière = 1 = zoom out
	
	// pour chaque bord : 	Si zoom in : prendre en compte position curseur pour zoomer en direction de celui ci
	// 						Sinon, si bord opposé trop proche du bord de la grille alors compenser sur le bord actuel (augmenter le delta)
	//						Sinon simple delta pour un zoom out loin des bord de la grille
	var delta = {	
		left:((deltaWheel == -1)?( - deltaRatio.x - deltaRatio.x * coordMouseRatio.x) : (!deplacementSansBord && deltaRatio.x >= taille.largeur - zoom.fin.x) ? (deltaRatio.x * 2 - taille.largeur + zoom.fin.x +1) : deltaRatio.x),
		right:((deltaWheel == -1) ? ( - deltaRatio.x + deltaRatio.x * coordMouseRatio.x) : (!deplacementSansBord && deltaRatio.x > zoom.depart.x) ? (deltaRatio.x * 2 - zoom.depart.x) : deltaRatio.x),
		top:((deltaWheel == -1)?( - deltaRatio.y - deltaRatio.y * coordMouseRatio.y) : (!deplacementSansBord && deltaRatio.y >= taille.hauteur - zoom.fin.y) ? (deltaRatio.y * 2 - taille.hauteur + zoom.fin.y +1) : deltaRatio.y),
		bottom:((deltaWheel == -1) ? ( - deltaRatio.y + deltaRatio.y * coordMouseRatio.y) : (!deplacementSansBord && deltaRatio.y > zoom.depart.y) ? (deltaRatio.y * 2 - zoom.depart.y) : deltaRatio.y)};
	
	// 1) Application du delta
	// 2) Empêche un zoom plus fort que 10 cellule de côté
	// 3) Empêche de sortir des limites de la grille
	if(!deplacementSansBord) {
		zoom.depart.x = Math.round(Math.min(Math.max(Math.min(zoom.depart.x - delta.left, zoom.fin.x - 10), 0), taille.largeur - 11));
		zoom.depart.y = Math.round(Math.min(Math.max(Math.min(zoom.depart.y - delta.top, zoom.fin.y - 10), 0), taille.hauteur - 11));
		zoom.fin.x = Math.round(Math.min(Math.max(Math.max(zoom.fin.x + delta.right, zoom.depart.x + 10), 9), taille.largeur - 1));
		zoom.fin.y = Math.round(Math.min(Math.max(Math.max(zoom.fin.y + delta.bottom, zoom.depart.y + 10), 9), taille.hauteur - 1));
	}
	else {
		zoom.depart.x = Math.max(Math.min((Math.round(zoom.depart.x - delta.left) + taille.largeur) % taille.largeur, (zoom.fin.x - 10 + taille.largeur) % taille.largeur), (zoom.fin.x < zoom.depart.x) ? zoom.fin.x + 1 : zoom.depart.x - 1);
		zoom.depart.y = Math.max(Math.min((Math.round(zoom.depart.y - delta.top) + taille.hauteur) % taille.hauteur, (zoom.fin.y - 10 + taille.hauteur) % taille.hauteur), (zoom.fin.y < zoom.depart.y) ? zoom.fin.y + 1 : zoom.depart.y - 1);
		zoom.fin.x = Math.min(Math.max((Math.round(zoom.fin.x + delta.right) + taille.largeur) % taille.largeur, (zoom.depart.x + 10 + taille.largeur) % taille.largeur), (zoom.fin.x < zoom.depart.x) ? zoom.depart.x - 1 : zoom.fin.x + 1);
		zoom.fin.y = Math.min(Math.max((Math.round(zoom.fin.y + delta.bottom) + taille.hauteur) % taille.hauteur, (zoom.depart.y + 10 + taille.hauteur) % taille.hauteur), (zoom.depart.y + taille.hauteur - 1) % taille.hauteur);
		
		/*tailleApparente.largeur = (zoom.depart.x < zoom.fin.x) ? zoom.fin.x - zoom.depart.x : taille.largeur - zoom.depart.x + zoom.fin.x;
		tailleApparente.hauteur = (zoom.depart.y < zoom.fin.y) ? zoom.fin.y - zoom.depart.y : taille.hauteur - zoom.depart.y + zoom.fin.y;
		
		if(tailleApparente.largeur > taille.largeur) zoom.fin.x = (zoom.depart.x + taille.largeur - 1) % taille.largeur;
		else if(tailleApparente.largeur < 10) zoom.fin.x = (zoom.depart.x + 9) % taille.largeur;
		
		if(tailleApparente.hauteur > taille.hauteur) zoom.fin.y = (zoom.depart.y + taille.hauteur - 1) % taille.hauteur;
		else if(tailleApparente.hauteur < 10) zoom.fin.y = (zoom.depart.y + 9) % taille.hauteur;*/
	}
	
	tailleApparente.largeur = (zoom.depart.x < zoom.fin.x) ? zoom.fin.x - zoom.depart.x : taille.largeur - zoom.depart.x + zoom.fin.x;
	tailleApparente.hauteur = (zoom.depart.y < zoom.fin.y) ? zoom.fin.y - zoom.depart.y : taille.hauteur - zoom.depart.y + zoom.fin.y;
	taillePixel.x = canvasHTML.clientWidth / tailleApparente.largeur;
	taillePixel.y = canvasHTML.clientHeight / tailleApparente.hauteur;
}

document.getElementById('tailleSelecteurBouton').onclick = changerTaille;

function setCell(ligne, colonne, mode) {
	switch (mode) {
		case 'aleatoire':
			table[ligne][colonne] = (Math.round(Math.random()) == 0);
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
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
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

/************* Initialisation *************/

taille.hauteur = 100;
taille.largeur = 100;
tailleSelecteurHTML.elements[0].value = taille.hauteur;
tailleSelecteurHTML.elements[1].value = taille.largeur;
zoom.depart = {x:0, y:0};
zoom.fin = {x:taille.largeur - 1, y:taille.hauteur - 1};
tailleApparente.largeur = (zoom.depart.x < zoom.fin.x) ? zoom.fin.x - zoom.depart.x : taille.largeur - zoom.depart.x + zoom.fin.x;
tailleApparente.hauteur = (zoom.depart.y < zoom.fin.y) ? zoom.fin.y - zoom.depart.y : taille.hauteur - zoom.depart.y + zoom.fin.y;

setGame();
dessinerCanvasInterval = setInterval(dessinerCanvas, 16.67);
infoStatsHTML.innerHTML = 'Génération 0 : ' + nbVivant + ' Cellule vivante (+0)';

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
			clearInterval(dessinerCanvasInterval);
			dessinerCanvasInterval = setInterval(dessinerCanvas, 16.67);
		}
	}
	else {
		isAlive = setInterval(nouveauCycle, vitesse);
		launcher.innerHTML = 'Pause';
		if(vitesse < 16.67) {
			clearInterval(dessinerCanvasInterval);
			dessinerCanvasInterval = setInterval(dessinerCanvas, vitesse);
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
			clearInterval(dessinerCanvasInterval);
			dessinerCanvasInterval = setInterval(dessinerCanvas, 16.67);
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

document.getElementById("onePass").onclick = nouveauCycle;

vitesseSelecteur.oninput = function(e){
	vitesse = (250 - vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = (Math.floor(100000 / vitesse) / 100) + ' FPS';
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = setInterval(nouveauCycle, vitesse);
		if(vitesse < 16.67) {
			clearInterval(dessinerCanvasInterval);
			dessinerCanvasInterval = setInterval(dessinerCanvas, vitesse);
		}
		else {
			clearInterval(dessinerCanvasInterval);
			dessinerCanvasInterval = setInterval(dessinerCanvas, 16.67);
		}
	}
}

/****************  Painting options  ***********************/
var isPainting = false;
var shiftPressed = false;

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
		canvas.fillStyle = (e.altKey) ? '#0' : '#f';
		canvas.fillRect(coordMouse.x * taillePixel.x, coordMouse.y * taillePixel.y, taillePixel.x, taillePixel.y);
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
		canvas.fillStyle = (e.altKey) ? '#0' : '#f';
		canvas.fillRect(coordMouse.x * taillePixel.x, coordMouse.y * taillePixel.y, taillePixel.x, taillePixel.y);
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
	delta = {x:Math.max(1, Math.round(tailleApparente.largeur / 50)), y:Math.max(1, Math.round(tailleApparente.hauteur / 50))};
	if(direction[0] != 0) {
		if(!deplacementSansBord) {
			delta.x = (direction[0] == -1) ? ((delta.x > zoom.depart.x) ? -zoom.depart.x : -delta.x) : ((delta.x > taille.largeur - zoom.fin.x - 1) ? (taille.largeur - zoom.fin.x - 1) : delta.x);
			zoom.depart.x += delta.x;
			zoom.fin.x += delta.x;
		} else {
			zoom.depart.x = (zoom.depart.x + direction[0] * delta.x + taille.largeur) % taille.largeur;
			zoom.fin.x = (zoom.fin.x + direction[0] * delta.x + taille.largeur) % taille.largeur;
		}
	}
	if(direction[1] != 0) {
		if(!deplacementSansBord) {
			delta.y = (direction[1] == -1) ? ((delta.y > zoom.depart.y) ? -zoom.depart.y : -delta.y) : ((delta.y > taille.hauteur - zoom.fin.y - 1) ? (taille.hauteur - zoom.fin.y - 1) : delta.y);
			zoom.depart.y += delta.y;
			zoom.fin.y += delta.y;
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