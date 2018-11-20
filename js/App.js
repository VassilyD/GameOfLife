

/************ Gestion de l'affichage du canvas ******************/

/************ Fin de l'affichage du canvas ******************/

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

function myApp() {
	if(toucheEnfonce) {
		zoomViaClavier();
		deplacementCanvasPre();
	}
	canvas.dessinerCanvas();
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
