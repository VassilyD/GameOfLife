
function changerVitesse() {
	jeu.vitesse = 1000 / (vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = vitesseSelecteur.value + ' FPS';
	if(jeu.isAlive) {
		clearInterval(myAppInterval);
		myAppInterval = setInterval(myApp, Math.min(jeu.vitesse, 16.67));
	}
}

function changerTaille() {
	var hauteur = tailleSelecteurHTML.elements[0].value * 1;
	var largeur = tailleSelecteurHTML.elements[1].value * 1;
	jeu.setJeu(largeur, hauteur, 'aleatoire');
	canvas.outilsTable = 1;
	canvas.zoom = {left:0, top:0, right:largeur - 1, bottom:hauteur - 1};
	// A passer en design pattern controleur
	launcherHTML.innerHTML = 'Play';
	grapheCanvas.dessinerGraphe();
	canvas.dessinerJeu();
}

function selectionOutil() {
	selecteurOutilElementHTML.forEach(function(item, index) {
		if(item.checked) canvas.outils = item.value;
	});
}

function selectionConnections() {
	selecteurConnectionsElementHTML.forEach(function(item, index) {
		if(item.checked) jeu.connections = item.value*1;
	});
	canvas.deplacementCanvas([0,0]);
}

function changerReglesNaissance() {
	jeu._reglesNaissance = [];
	selecteurReglesNaissanceElementHTML.forEach(function(item, index) {
		if(selecteurReglesNaissanceElementHTML[index].checked) jeu._reglesNaissance.push(item.value*1);
	});
}

function changerReglesSurvie() {
	jeu._reglesSurvie = [];
	selecteurReglesSurvieElementHTML.forEach(function(item, index) {
		if(selecteurReglesSurvieElementHTML[index].checked) jeu._reglesSurvie.push(item.value*1);
	});
}

//Génération du selecteur
function selectionPatternFinal(e){
	var selectLVL1 = document.getElementById('patternsLVL1');
	var selectLVL2 = document.getElementById('patternsLVL2');
	patternActuel = patternList[selectLVL1.value][selectLVL2.value].slice();
	
	selecteurOutilElementHTML[2].checked = true;
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
