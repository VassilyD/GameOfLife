

/************ Gestion de l'affichage du canvas ******************/

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

function zooming(e) {
	positionSourieCanvas(e);
	
	var coordMouseRel = {	x:(coordMouse.x - zoom.depart.x + taille.largeur) % taille.largeur, // coordonné du pointeur dans la zone affiché
							y:(coordMouse.y - zoom.depart.y + taille.hauteur) % taille.hauteur}	
	var coordMouseRatio = {	x:(coordMouseRel.x / tailleApparente.largeur - 0.5) * 2, // vaut entre -1 et +1 selon si la sourie est plus ou moins à gauche ou plus ou moins à droite
							y:(coordMouseRel.y / tailleApparente.hauteur - 0.5) * 2} // même chose mais entre le haut et le bas
							
	var deltaRatio = {x:Math.max(tailleApparente.largeur * Math.abs(e.deltaY) / 60, 1), y:Math.max(tailleApparente.hauteur * Math.abs(e.deltaY)/ 60, 1)};
	
	var deltaWheel = e.deltaY / Math.abs(e.deltaY); // molette vers l'avant = -1 = zoom in, molette vers l'arrière = 1 = zoom out
	
	// pour chaque bord : 	Si zoom in : prendre en compte position curseur pour zoomer en direction de celui ci
	// 						Sinon, si bord opposé trop proche du bord de la grille alors compenser sur le bord actuel (augmenter le delta)
	//						Sinon simple delta pour un zoom out loin des bord de la grille ou lorsque le deplacement libre est activé
	var delta = {	
		left:((deltaWheel == -1)?( - deltaRatio.x - deltaRatio.x * coordMouseRatio.x) : (!deplacementLibre && deltaRatio.x >= taille.largeur - zoom.fin.x) ? (deltaRatio.x * 2 - taille.largeur + zoom.fin.x +1) : deltaRatio.x),
		right:((deltaWheel == -1) ? ( - deltaRatio.x + deltaRatio.x * coordMouseRatio.x) : (!deplacementLibre && deltaRatio.x > zoom.depart.x) ? (deltaRatio.x * 2 - zoom.depart.x) : deltaRatio.x),
		top:((deltaWheel == -1)?( - deltaRatio.y - deltaRatio.y * coordMouseRatio.y) : (!deplacementLibre && deltaRatio.y >= taille.hauteur - zoom.fin.y) ? (deltaRatio.y * 2 - taille.hauteur + zoom.fin.y +1) : deltaRatio.y),
		bottom:((deltaWheel == -1) ? ( - deltaRatio.y + deltaRatio.y * coordMouseRatio.y) : (!deplacementLibre && deltaRatio.y > zoom.depart.y) ? (deltaRatio.y * 2 - zoom.depart.y) : deltaRatio.y)};
	
	// 1) Application du delta
	// 2) Empêche un zoom plus fort que 10 cellule de côté
	// 3) Empêche de sortir des limites de la grille   !deplacementLibre
	function zoomAdapt(){
		return {X:{t: zoom.fin.x < zoom.depart.x, vfi: zoom.fin.x + taille.largeur, vfo: zoom.fin.x - taille.largeur, vdi: zoom.depart.x - taille.largeur, vdo: zoom.depart.x + taille.largeur}, 
				Y:{t: zoom.fin.y < zoom.depart.y, vfi: zoom.fin.y + taille.hauteur, vfo: zoom.fin.y - taille.hauteur, vdi: zoom.depart.y - taille.hauteur, vdo: zoom.depart.y + taille.hauteur}};
	}
	var adapt = zoomAdapt();
	
	if(canvasHTML.clientWidth >= canvasHTML.clientHeight) zoom.depart.x = (Math.min(Math.max(Math.min(Math.round(zoom.depart.x - delta.left), ((adapt.X.t) ? adapt.X.vfi : zoom.fin.x) - 10), ((deplacementLibre) ? (((adapt.X.t) ? zoom.fin.x : adapt.X.vfo) + 1) : 0)), (deplacementLibre) ? Math.round(zoom.depart.x + Math.abs(delta.left)) : taille.largeur - 11) + taille.largeur) % taille.largeur;
	
	if(canvasHTML.clientWidth <= canvasHTML.clientHeight) zoom.depart.y = (Math.min(Math.max(Math.min(Math.round(zoom.depart.y - delta.top), ((adapt.Y.t) ? adapt.Y.vfi : zoom.fin.y) - 10), ((deplacementLibre) ? (((adapt.Y.t) ? zoom.fin.y : adapt.Y.vfo) + 1) : 0)), (deplacementLibre) ? Math.round(zoom.depart.y + Math.abs(delta.top)) : taille.hauteur - 11) + taille.hauteur) % taille.hauteur;
	
	adapt = zoomAdapt();
	
	if(canvasHTML.clientWidth >= canvasHTML.clientHeight) zoom.fin.x = (Math.min(Math.max(Math.round(zoom.fin.x + delta.right), ((adapt.X.t) ? adapt.X.vdi : zoom.depart.x) + 10), ((deplacementLibre) ? (((adapt.X.t) ? zoom.depart.x : adapt.X.vdo) - 1) : taille.largeur - 1)) + taille.largeur) % taille.largeur;
	
	if(canvasHTML.clientWidth <= canvasHTML.clientHeight)zoom.fin.y = (Math.min(Math.max(Math.round(zoom.fin.y + delta.bottom), ((adapt.Y.t) ? adapt.Y.vdi : zoom.depart.y) + 10), ((deplacementLibre) ? (((adapt.Y.t) ? zoom.depart.y : adapt.Y.vdo) - 1) : taille.hauteur - 1)) + taille.hauteur) % taille.hauteur;
	
	calculerDimension();
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
