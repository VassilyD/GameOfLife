function deplacement() {
	deplacementLibre = !deplacementLibre;
	if (zoom.depart.x + tailleApparente.largeur >= taille.largeur) {
		var delta = zoom.depart.x + tailleApparente.largeur - taille.largeur;
		if(delta > tailleApparente.largeur / 2) delta = -1 * (tailleApparente.largeur - delta);
		
		zoom.depart.x = (zoom.depart.x - delta + taille.largeur) % taille.largeur;
		zoom.fin.x = (zoom.fin.x - delta + taille.largeur) % taille.largeur;
	}
	if (zoom.depart.y + tailleApparente.hauteur >= taille.hauteur) {
		var delta = zoom.depart.y + tailleApparente.hauteur - taille.hauteur;
		if(delta > tailleApparente.hauteur / 2) delta = -1 * (tailleApparente.hauteur - delta);
		
		zoom.depart.y = (zoom.depart.y - delta + taille.hauteur) % taille.hauteur;
		zoom.fin.y = (zoom.fin.y - delta + taille.hauteur) % taille.hauteur;
	}
	document.getElementById("deplacementLibre").innerHTML = (deplacementLibre) ? 'Désactiver déplacement libre' : 'Activer déplacement libre';
}

function changerVitesse(e) {
	jeu.vitesse = (250 - vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = (Math.floor(100000 / vitesse) / 100) + ' FPS';
	if(jeu.isAlive) {
		clearInterval(myAppInterval);
		myAppInterval = setInterval(myApp, Math.min(jeu.vitesse, 16.67));
	}
}


function painting(e) {
	positionSourieCanvas(e);
    var coor = "Coordinates: (" + coordMouse.x + "," + coordMouse.y + ")";
    document.getElementById("testtt").innerHTML = coor;
	if(isPainting && !shiftPressed) {
		jeu.setCell(coordMouse.y, coordMouse.x, (e.altKey) ? false : true);
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
				jeu.setCell(yRel, xRel, patternActuel[ligne][col]);
			}
		}
	}
	else {
		jeu.setCell(coordMouse.y, coordMouse.x, (e.altKey) ? false : true);
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

function deplacementCanvasPre() {
	var direction = [0, 0];
    if (toucheEnfonce && toucheEnfonce[37]) {direction[0] = -1; }
    if (toucheEnfonce && toucheEnfonce[39]) {direction[0] = 1; }
    if (toucheEnfonce && toucheEnfonce[38]) {direction[1] = -1; }
    if (toucheEnfonce && toucheEnfonce[40]) {direction[1] = 1; }
	deplacementCanvas(direction);
}

function deplacementCanvas(direction) {
	delta = {x:Math.max(1, Math.round(tailleApparente.largeur / 50)), y:Math.max(1, Math.round(tailleApparente.hauteur / 50))};
	if(direction[0] != 0) {
		if(!deplacementLibre) {
			zoom.depart.x = Math.min(Math.max(zoom.depart.x + direction[0] * delta.x, 0),  taille.largeur - tailleApparente.largeur);
			zoom.fin.x = Math.min(Math.max(zoom.fin.x + direction[0] * delta.x, tailleApparente.largeur - 1),  taille.largeur - 1);
		} else {
			zoom.depart.x = (zoom.depart.x + direction[0] * delta.x + taille.largeur) % taille.largeur;
			zoom.fin.x = (zoom.fin.x + direction[0] * delta.x + taille.largeur) % taille.largeur;
		}
	}
	if(direction[1] != 0) {
		if(!deplacementLibre) {
			zoom.depart.y = Math.min(Math.max(zoom.depart.y + direction[1] * delta.y, 0),  taille.hauteur - tailleApparente.hauteur);
			zoom.fin.y = Math.min(Math.max(zoom.fin.y + direction[1] * delta.y, tailleApparente.hauteur - 1),  taille.hauteur - 1);
		} else {
			zoom.depart.y = (zoom.depart.y + direction[1] * delta.y + taille.hauteur) % taille.hauteur;
			zoom.fin.y = (zoom.fin.y + direction[1] * delta.y + taille.hauteur) % taille.hauteur;
		}
	}
}
