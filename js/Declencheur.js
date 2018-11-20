
window.onresize = function() {calculerDimension()};

document.getElementById('tailleSelecteurBouton').onclick = canvas.changerTaille;

document.getElementById("launcher").onclick = jeu.lancer;

document.getElementById("nuke").onclick = function() {jeu.reset('vide')};

document.getElementById("respawn").onclick = function() {jeu.reset('aleatoire')};

document.getElementById("deplacementLibre").onclick = canvas.deplacement;

document.getElementById("onePass").onclick = jeu.nouveauCycle;

vitesseSelecteur.oninput = function() {changerVitesse(event)};


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