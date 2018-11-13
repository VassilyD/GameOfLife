var canvasHTML = document.getElementById('gameOfLifeCanvas');
var canvas = canvasHTML.getContext('2d');
var tailleEcran = [window.innerWidth, window.innerHeight];
var tailleSelecteurHTML = document.getElementById('tailleSelecteur');
var coordMouse = [0, 0];
var mouseOver = false;
var vitesseSelecteur = document.getElementById('vitesseSelecteur');
var vitesse = 10;
var testPattern = [[false, true, false], [false, false, true], [true, true, true]];
var pattern = {	marcheur:{	
					NE:[[true, true, true], [false, false, true], [false, true, false]], 
					SE:[[false, true, false], [false, false, true], [true, true, true]], 
					SW:[[false, true, false], [true, false, false], [true, true, true]], 
					NW:[[true, true, true], [true, false, false], [false, true, false]]
				},
				oscillateur:{
					ligne:[true, true, true],
					grenouille:[[false, true, true, true], [true, true, true, false]]
				}
};



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
	canvas.fillStyle = '#ff0000';
	
	if(mouseOver) {
		if(shiftPressed) {
			for(var ligne = 0; ligne < testPattern.length; ligne++){
				for(var col = 0; col < testPattern[ligne].length; col++){
					if(testPattern[ligne][col]) canvas.fillRect((coordMouse[0] + col) * taillePixelX, (coordMouse[1] + ligne) * taillePixelY, taillePixelX, taillePixelY);
				}
			}
		}
		else canvas.fillRect(coordMouse[0] * taillePixelX, coordMouse[1] * taillePixelY, taillePixelX, taillePixelY);
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


window.onresize = function(){
	canvasHTML.width = canvasHTML.clientWidth;
	canvasHTML.height = canvasHTML.clientHeight;
	drawCanvasTest();
}

var tempo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
			}
			somme[ligne][colonne] = 0;
		}
	}
	drawCanvasTest();
	var tempsTemp = 0;
	for(var i = 1; i < 10; i++) tempsTemp += (tempo[i] - tempo[i-1]);
	tempsTemp /= 10;
	afficheTest.innerHTML = (Math.floor(100000 / tempsTemp) / 100) + ' FPS';;
	tempo.push(Date.now());
	tempo.shift();
}

taille.hauteur = 100;
taille.largeur = 100;
tailleSelecteurHTML.elements[0].value = taille.hauteur;
tailleSelecteurHTML.elements[1].value = taille.largeur
var afficheTest = document.getElementById("fill");

setGame();

var isAlive = 0;
var launcher = document.getElementById("launcher");
launcher.onclick = function(){
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = 0;
		launcher.innerHTML = 'Play';
		afficheTest.innerHTML = '';
	}
	else {
		isAlive = setInterval(nouveauCycle, vitesse);
		launcher.innerHTML = 'Pause';
	}
}
document.getElementById("nuke").onclick = function(){
	for (var i = 0; i < taille.hauteur; i++) {
		for (var j = 0; j < taille.largeur; j++) {
			table[i][j] = false;
		}
	}
	drawCanvasTest();
}

document.getElementById("respawn").onclick = function(){
	setGame('aleatoire');
}

document.getElementById("onePass").onclick = nouveauCycle;

vitesseSelecteur.oninput = function(e){
	vitesse = (500 - vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = (Math.floor(100000 / vitesse) / 100) + ' FPS';
	if(isAlive != 0) {
		clearInterval(isAlive);
		isAlive = setInterval(nouveauCycle, vitesse);
	}
}

//Painting options
var isPainting = false;
var shiftPressed = false;

function painting(e) {
    var x = e.offsetX;
    var y = e.offsetY;
	var taillePixelX = canvasHTML.clientWidth / taille.largeur;
	var taillePixelY = canvasHTML.clientHeight / taille.hauteur;
	coordMouse[0] = Math.floor(x / taillePixelX);
	coordMouse[1] = Math.floor(y / taillePixelY);
    var coor = "Coordinates: (" + coordMouse[0] + "," + coordMouse[1] + ")";
    document.getElementById("testtt").innerHTML = coor;
	if(isPainting && !shiftPressed) {
		table[coordMouse[1]][coordMouse[0]] = (e.altKey) ? false : true;
		canvas.fillStyle = (e.altKey) ? '#0' : '#f';
		canvas.fillRect(coordMouse[0] * taillePixelX, coordMouse[1] * taillePixelY, taillePixelX, taillePixelY);
	}
	drawCanvasTest();
}

function paintingStart(e) {
	isPainting = true;
	var x = e.offsetX;
    var y = e.offsetY;
	var taillePixelX = canvasHTML.clientWidth / taille.largeur;
	var taillePixelY = canvasHTML.clientHeight / taille.hauteur;
	x = Math.floor(x / taillePixelX);
	y = Math.floor(y / taillePixelY);
	if(shiftPressed) {
		for(var ligne = 0; ligne < testPattern.length; ligne++){
			for(var col = 0; col < testPattern[ligne].length; col++){
				table[y + ligne][x + col] = testPattern[ligne][col];
			}
		}
		drawCanvasTest();
	}
	else {
		table[y][x] = (e.altKey) ? false : true;
		canvas.fillStyle = (e.altKey) ? '#0' : '#f';
		canvas.fillRect(x * taillePixelX, y * taillePixelY, taillePixelX, taillePixelY);
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
	drawCanvasTest();
}

//Active certain booléen en fonction des touche enfoncé
function activeControle(e) {
	if(e.key == 'Shift') shiftPressed = true;
	console.log(e.key + ' ' + shiftPressed + ' shit');
}

//Désctive certain booléen en fonction des touche enfoncé
function desactiveControle(e) {
	if(e.key == 'Shift') shiftPressed = false;
	console.log(e.key + ' ' + shiftPressed + ' fuck');
}

canvasHTML.setAttribute('onmousemove', "painting(event)");
canvasHTML.setAttribute('onmousedown', "paintingStart(event)");
canvasHTML.setAttribute('onmouseup', "paintingStop(event)");
canvasHTML.setAttribute('onmouseleave', "paintingLeave(event)");
canvasHTML.setAttribute('onmouseenter', "paintingPre(event)");

document.body.setAttribute('onkeydown', "activeControle(event)");
document.body.setAttribute('onkeyup', "desactiveControle(event)");