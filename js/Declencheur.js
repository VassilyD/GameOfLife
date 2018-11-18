
window.onresize = function() {calculerDimension()};

document.getElementById('tailleSelecteurBouton').onclick = changerTaille;

document.getElementById("launcher").onclick = jeu.lancer;

document.getElementById("nuke").onclick = function() {jeu.reset('vide')};

document.getElementById("respawn").onclick = function() {jeu.reset('aleatoire')};

document.getElementById("deplacementLibre").onclick = deplacement;

document.getElementById("onePass").onclick = jeu.nouveauCycle;

vitesseSelecteur.oninput = function() {changerVitesse(event)};

canvasHTML.setAttribute('onmousemove', "painting(event)");
canvasHTML.setAttribute('onmousedown', "paintingStart(event)");
canvasHTML.setAttribute('onmouseup', "paintingStop(event)");
canvasHTML.setAttribute('onmouseleave', "paintingLeave(event)");
canvasHTML.setAttribute('onmouseenter', "paintingPre(event)");
canvasHTML.setAttribute('onwheel', "zooming(event)");

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