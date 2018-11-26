
function myApp() {
	if(isToucheEnfonce) {
		canvas.zoomViaClavier();
		canvas.deplacementCanvasClavier();
	}
	
	canvas.dessinerCanvas();
	
	infoStatsHTML.innerHTML = 'Génération ' + jeu.nbGeneration + ' : ' + jeu.nbVivant + ' Cellule vivante (' + ((jeu.nbVivantVariation(-1) >= 0) ? '+' : '') + (jeu.nbVivantVariation(-1)) + '), max : ' + jeu.nbVivantMax;
	afficheTestHTML.innerHTML = (jeu.isAlive) ? ' (' + jeu.fps + ' FPS)' : '';
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
	grapheCanvasHTML = document.getElementById('grapheCanvas');
	selecteurOutilHTML = document.getElementById('selecteurOutil');
	selecteurOutilElementHTML = document.getElementsByName('outilsGroupe');
	selecteurConnectionsHTML = document.getElementById('selecteurConnections');
	selecteurConnectionsElementHTML = document.getElementsByName('connectionGroupe');
	selecteurReglesNaissanceHTML = document.getElementById('selecteurReglesNaissance');
	selecteurReglesNaissanceElementHTML = document.getElementsByName('regleNaissance');
	selecteurReglesSurvieHTML = document.getElementById('selecteurReglesSurvie');
	selecteurReglesSurvieElementHTML = document.getElementsByName('regleSurvie');
	
	tailleSelecteurHTML.elements[0].value = 250;
	tailleSelecteurHTML.elements[1].value = 250;
	
	jeu = new JeuDeLaVie(250, 250);
	canvas = new Canvas(canvasHTML, jeu, true);
	grapheCanvas = new GrapheCanvas(grapheCanvasHTML, jeu);

	myAppInterval = setInterval(myApp, 16.67);
		
	window.onresize = function() {
		canvas.calculerDimension();
		grapheCanvas.calculerDimensions();
	}

	document.getElementById('tailleSelecteurBouton').onclick = changerTaille;

	launcherHTML.onclick = function() {
		jeu.lancer();
	}

	document.getElementById("nuke").onclick = function() {
		jeu.reset('vide');
		canvas.dessinerJeu();
		grapheCanvas.calculerDimensions();
		launcherHTML.innerHTML = 'Play';
	}

	document.getElementById("respawn").onclick = function() {
		jeu.reset('aleatoire');
		canvas.dessinerJeu();
		grapheCanvas.calculerDimensions();
		launcherHTML.innerHTML = 'Play';
	}

	document.getElementById("deplacementLibre").onclick = function() {
		if(!canvas.deplacementLibre) {
			selecteurOutilElementHTML[0].checked = true;
			selectionOutil()
		}
		canvas.deplacement();
	}

	document.getElementById("onePass").onclick = function() {
		jeu.nouveauCycle();
	};

	vitesseSelecteurHTML.oninput = changerVitesse;
	vitesseSelecteurHTML.value = vitesseSelecteurHTML.defaultValue;
	
	selecteurOutilHTML.oninput = selectionOutil;
	selecteurOutilElementHTML[0].checked = true;

	selecteurConnectionsHTML.oninput = selectionConnections;
	selecteurConnectionsElementHTML[0].checked = true;
	
	selecteurReglesNaissanceHTML.oninput = changerReglesNaissance;
	selecteurReglesNaissanceElementHTML.forEach(function(item, index) {
		selecteurReglesNaissanceElementHTML[index].checked = false;
	});
	selecteurReglesNaissanceElementHTML[3].checked = true;
	
	selecteurReglesSurvieHTML.oninput = changerReglesSurvie;
	selecteurReglesSurvieElementHTML.forEach(function(item, index) {
		selecteurReglesSurvieElementHTML[index].checked = false;
	});
	selecteurReglesSurvieElementHTML[2].checked = true;
	selecteurReglesSurvieElementHTML[3].checked = true;


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
