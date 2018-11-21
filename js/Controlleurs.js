
function changerVitesse() {
	jeu.vitesse = (250 - vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = (Math.floor(100000 / jeu.vitesse) / 100) + ' FPS';
	if(jeu.isAlive) {
		clearInterval(myAppInterval);
		myAppInterval = setInterval(myApp, Math.min(jeu.vitesse, 16.67));
	}
}

function changerTaille() {
	var hauteur = tailleSelecteurHTML.elements[0].value * 1;
	var largeur = tailleSelecteurHTML.elements[1].value * 1;
	jeu.setJeu(largeur, hauteur, 'aleatoire');
	canvas.zoom = {left:0, top:0, right:largeur - 1, bottom:hauteur - 1};
	launcherHTML.innerHTML = 'Play';
}


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
