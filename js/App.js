
function myApp() {
	if(isToucheEnfonce) {
		canvas.zoomViaClavier();
		canvas.deplacementCanvasPre();
	}
	
	canvas.dessinerCanvas();
	
	infoStatsHTML.innerHTML = 'Génération ' + jeu.nbGeneration + ' : ' + jeu.nbVivant + ' Cellule vivante (' + ((jeu.nbVivantVariation >= 0) ? '+' : '') + (jeu.nbVivantVariation) + '), max : ' + jeu.nbVivantMax;
	afficheTestHTML.innerHTML = (jeu.isAlive) ? jeu.fps + ' FPS' : '';
}

/************* Initialisation *************/
window.onload = function() {
	canvasHTML = document.getElementById('gameOfLifeCanvas');
	selectPatternHTML = document.getElementById('patternSelecteur');
	tailleSelecteurHTML = document.getElementById('tailleSelecteur');
	vitesseSelecteurHTML = document.getElementById('vitesseSelecteur');
	infoStatsHTML = document.getElementById('infoStats');
	afficheTestHTML = document.getElementById("fill");
	launcherHTML = document.getElementById("launcher");
	
	tailleSelecteurHTML.elements[0].value = 100;
	tailleSelecteurHTML.elements[1].value = 100;
	
	jeu = new JeuDeLaVie(100, 100);
	canvas = new Canvas(canvasHTML, jeu, true);

	myAppInterval = setInterval(myApp, 16.67);
	infoStatsHTML.innerHTML = 'Génération 0 : ' + jeu.nbVivant + ' Cellule vivante';
		
	window.onresize = function() {canvas.calculerDimension()};

	document.getElementById('tailleSelecteurBouton').onclick = changerTaille;

	launcherHTML.onclick = function() {
		jeu.lancer();
		launcherHTML.innerHTML = (jeu.isAlive) ? 'Pause' : 'Play';
		//afficheTestHTML.innerHTML = (jeu.isAlive) ? jeu.fps + ' FPS' : '';
	}

	document.getElementById("nuke").onclick = function() {
		jeu.reset('vide');
		canvas.dessinerJeu();
		launcherHTML.innerHTML = 'Play';
		//infoStatsHTML.innerHTML = 'Génération 0 : 0 Cellule vivante';
		//afficheTestHTML.innerHTML = '';
	}

	document.getElementById("respawn").onclick = function() {
		jeu.reset('aleatoire');
		canvas.dessinerJeu();
		launcherHTML.innerHTML = 'Play';
		//infoStatsHTML.innerHTML = 'Génération 0 : ' + jeu.nbVivant + ' Cellule vivante';
		//afficheTestHTML.innerHTML = '';
	}

	document.getElementById("deplacementLibre").onclick = function() {canvas.deplacement()};

	document.getElementById("onePass").onclick = function() {
		jeu.nouveauCycle();
		infoStatsHTML.innerHTML = 'Génération ' + jeu.nbGeneration + ' : ' + jeu.nbVivant + ' Cellule vivante (' + ((jeu.nbVivantVariation >= 0) ? '+' : '') + (jeu.nbVivantVariation) + ')';
	};

	vitesseSelecteurHTML.oninput = changerVitesse;


	window.addEventListener('keydown', function (e) {
		var keyCode = e.which || e.keyCode;
		if(e.key == 'Shift') shiftPressed = true;
		toucheEnfonce = (toucheEnfonce || []);
		toucheEnfonce[keyCode] = (e.type == "keydown");
		isToucheEnfonce = true;
		canvas.dessinerOutil();
	})
	window.addEventListener('keyup', function (e) {
		var keyCode = e.which || e.keyCode;
		if(e.key == 'Shift') {
			shiftPressed = false;
			canvas.outilsTable = 0;
		}
		toucheEnfonce[keyCode] = (e.type == "keydown");
		isToucheEnfonce = false;
		for(touche of toucheEnfonce) isToucheEnfonce = isToucheEnfonce || touche;
		canvas.dessinerOutil();
	})
		
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

}
/************* Fin Initialisation *********/
