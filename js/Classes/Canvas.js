class Canvas {
	constructor(canvasHTML, jeu) {
		this._canvasHTML = canvasHTML;
		this._canvas = this._canvasHTML.getContext('2d');
		this._jeu = jeu;
		this._taillePixel = 1;
		this._hauteur = jeu.hauteur;
		this._largeur = jeu.largeur
		this._zoom = {top:0, left:0, right:this._largeur - 1, bottom:this._hauteur - 1, zoom:Math.max(this._largeur - 1, this._hauteur - 1)};
		this._coordMouse = {x:0, y:0};
		this._mouseOver = false;
		this._canvasHTML.onmousemove = function(event) {this.painting(event)};
		this._canvasHTML.onmousedown = function(event) {this.paintingStart(event)};
		this._canvasHTML.onmouseup = function(event) {this.paintingStop(event)};
		this._canvasHTML.onmouseleave = function(event) {this.paintingLeave(event)};
		this._canvasHTML.onmouseenter = function(event) {this.paintingPre(event)};
		this._canvasHTML.onwheel = function(event) {this.zooming(event)};
		
		this.calculerDimension();
	}
	// Affiche la grille de cellule
	dessinerJeu(){
		
		this._canvas.clearRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		//création d'un fond noir
		this._canvas.fillStyle = '#000000';
		this._canvas.fillRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		//création des cellules vivantes
		this._canvas.fillStyle = '#ffffff';
		for(var ligne = this._zoom.top, i = 0; i < this._hauteur; ligne = ++ligne % this._jeu.hauteur, i++) {
			for(var colonne = zoom.left, j = 0; j < this._largeur; colonne = ++colonne % this._jeu.largeur, j++) {
				if(this._jeu.grille[ligne][colonne]) this._canvas.fillRect((j) * this._taillePixel, (i) * this._taillePixel, this._taillePixel, this._taillePixel);
				if(deplacementLibre && ((ligne == 0 && colonne == this._zoom.right) || (colonne == 0 && ligne == this._zoom.bottom))) {
					this._canvas.fillStyle = 'rgba(255,0,0,0.33)';
					if(ligne == 0) this._canvas.fillRect(0, i * this._taillePixel - 2, this._largeur * this._taillePixel, 2);
					if(colonne == 0) this._canvas.fillRect(j * this._taillePixel - 2, 0, 2, this._hauteur * this._taillePixel);
					this._canvas.fillStyle = '#ffffff';
				}
			}
		}
	}

	// Affichage de l'outils selectionné
	dessinerOutil(){
		this._canvas.fillStyle = 'rgba(255,0,0,1)';
		
		if(shiftPressed) {
			for(var ligne = 0; ligne < patternActuel.length; ligne++){
				for(var col = 0; col < patternActuel[ligne].length; col++){
					//xRel et yRel permettent de connecter les bord entre eux
					var xRel = this._coordMouse.x + col;
					xRel = (xRel >= this._jeu._largeur) ? (xRel - this._jeu._largeur) : (xRel < 0) ? xRel + this._jeu._largeur : xRel;
					var yRel = this._coordMouse.y + ligne;
					yRel = (yRel >= this._jeu._hauteur) ? (yRel - this._jeu._hauteur) : (yRel < 0) ? yRel + this._jeu._hauteur : yRel;
					this._canvas.fillStyle = (patternActuel[ligne][col]) ? 'rgba(255,0,0,0.9)' : 'rgba(0,0,0,0.9)';
					this._canvas.fillRect(((xRel - this._zoom.left + this._jeu._largeur) % this._jeu._largeur) * this._taillePixel, ((yRel - this._zoom.top + this._jeu._hauteur) % this._jeu._hauteur) * this._taillePixel, this._taillePixel, this._taillePixel);
				}
			}
		}
		else this._canvas.fillRect(((this._coordMouse.x - this._zoom.left + this._jeu._largeur) % this._jeu._largeur) * this._taillePixel, ((this._coordMouse.y - this._zoom.top + this._jeu._hauteur) % this._jeu._hauteur) * this._taillePixel, this._taillePixel, this._taillePixel);
	}

	dessinerCanvas() {	
		this.dessinerJeu();
		
		if(this._mouseOver) {
			this.dessinerOutil();
		}
	}

	calculerDimension() {
		var ratio;
		
		this._largeur = (this._zoom.left < this._zoom.right) ? this._zoom.right - this._zoom.left + 1 : this._largeur - this._zoom.left + this._zoom.right + 1;
		this._hauteur = (this._zoom.top < this._zoom.bottom) ? this._zoom.bottom - this._zoom.top + 1 : this._hauteur - this._zoom.top + this._zoom.bottom + 1;
		
		ratio = this._largeur / this._hauteur;
		
		this._canvasHTML.style.width = Math.min(100 * ratio, 100) + '%';
		this._canvasHTML.style.height = Math.min(100 / ratio, 100) + '%';
		this._canvasHTML.style.right = Math.max(50 * (1 - ratio), 0) + '%';
		this._canvasHTML.style.top = Math.max(50 * (1 - 1 / ratio), 0) + '%';
		
		this._canvasHTML.width = this._canvasHTML.clientWidth;
		this._canvasHTML.height = this._canvasHTML.clientHeight;
		this._taillePixel = (this._largeur < this._hauteur) ? this._canvasHTML.clientHeight / this._hauteur : this._canvasHTML.clientWidth / this._largeur;
		
		this.dessinerCanvas();
	}
	
	positionSourieCanvas(e){
		coordMouse.x = (zoom.depart.x + Math.floor(e.offsetX / taillePixel)) % taille.largeur;
		coordMouse.y = (zoom.depart.y + Math.floor(e.offsetY / taillePixel)) % taille.hauteur;
	}

	painting(e) {
		positionSourieCanvas(e);
		var coor = "Coordinates: (" + coordMouse.x + "," + coordMouse.y + ")";
		document.getElementById("testtt").innerHTML = coor;
		if(isPainting && !shiftPressed) {
			jeu.setCell(coordMouse.y, coordMouse.x, (e.altKey) ? false : true);
		}
	}

	paintingStart(e) {
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

	paintingStop(e) {
		isPainting = false;
	}

	//Quand la sourie entre sur la grille
	paintingPre(e) {
		mouseOver = true;
	}

	//Quand la sourie quitte la grille
	paintingLeave() {
		mouseOver = false;
		isPainting = false;
		document.getElementById("testtt").innerHTML = '';
	}

	deplacementCanvasPre() {
		var direction = [0, 0];
		if (toucheEnfonce && toucheEnfonce[37]) {direction[0] = -1; }
		if (toucheEnfonce && toucheEnfonce[39]) {direction[0] = 1; }
		if (toucheEnfonce && toucheEnfonce[38]) {direction[1] = -1; }
		if (toucheEnfonce && toucheEnfonce[40]) {direction[1] = 1; }
		deplacementCanvas(direction);
	}

	deplacementCanvas(direction) {
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

	deplacement() {
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

	zooming(e) {
		positionSourieCanvas(e);
		
		var coordMouseRel = {	x:(coordMouse.x - zoom.depart.x + taille.largeur) % taille.largeur, // coordonné du pointeur dans la zone visible
								y:(coordMouse.y - zoom.depart.y + taille.hauteur) % taille.hauteur}	
		var coordMouseRatio = {	x:(coordMouseRel.x / (tailleApparente.largeur -1 ) - 0.5) * 2, // vaut entre -1 et +1 selon si la sourie est plus ou moins à gauche ou plus ou moins à droite
								y:(coordMouseRel.y / (tailleApparente.hauteur - 1) - 0.5) * 2} // même chose mais entre le haut et le bas/**/
								
		var deltaRatio = Math.round(Math.max(Math.abs(e.deltaY) * zoom.zoom / 60, 1)); // adapte le delta à la taille de la zone visible
		
		var deltaWheel = e.deltaY / Math.abs(e.deltaY); // molette vers l'avant = -1 = zoom in, molette vers l'arrière = 1 = zoom out
		
		var delta = {	
			left:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio * (1 - coordMouseRatio.x) >= taille.largeur - 1 - zoom.fin.x) ? deltaRatio * 2 + zoom.fin.x - (taille.largeur - 1) : deltaRatio * (1 + coordMouseRatio.x)),
			top:deltaWheel * ((!deplacementLibre && deltaWheel == 1 && deltaRatio * (1 - coordMouseRatio.y) >= taille.hauteur - 1 - zoom.fin.y) ? deltaRatio * 2 + zoom.fin.y - (taille.hauteur - 1) : deltaRatio * (1 + coordMouseRatio.y))};
		
		zoom.zoom = Math.min(Math.max(zoom.zoom + deltaWheel * 2 * deltaRatio, 9), Math.max(taille.largeur - 1, taille.hauteur - 1));
		
		// 1) Application du delta
		// 2) Empêche un zoom plus fort que 10 cellule de côté
		// 3) Empêche de sortir des limites de la grille   !deplacementLibre
		var adapt = {	X:{t: zoom.fin.x < zoom.depart.x, vfi: zoom.fin.x + taille.largeur, vfo: zoom.fin.x - taille.largeur}, 
						Y:{t: zoom.fin.y < zoom.depart.y, vfi: zoom.fin.y + taille.hauteur, vfo: zoom.fin.y - taille.hauteur}};
		
		if(!(tailleApparente.largeur == taille.largeur && tailleApparente.largeur < tailleApparente.hauteur)) zoom.depart.x = Math.round(Math.min(Math.max(Math.min(zoom.depart.x - delta.left, ((adapt.X.t) ? adapt.X.vfi : zoom.fin.x) - 9), ((deplacementLibre) ? (((adapt.X.t) ? zoom.fin.x : adapt.X.vfo) + 1) : 0)), (deplacementLibre) ? zoom.depart.x + Math.abs(delta.left) : taille.largeur - 10) + taille.largeur) % taille.largeur;
		
		if(!(tailleApparente.hauteur == taille.hauteur && tailleApparente.hauteur < tailleApparente.largeur)) zoom.depart.y = Math.round(Math.min(Math.max(Math.min(zoom.depart.y - delta.top, ((adapt.Y.t) ? adapt.Y.vfi : zoom.fin.y) - 9), ((deplacementLibre) ? (((adapt.Y.t) ? zoom.fin.y : adapt.Y.vfo) + 1) : 0)), (deplacementLibre) ? zoom.depart.y + Math.abs(delta.top) : taille.hauteur - 10) + taille.hauteur) % taille.hauteur;
		
		zoom.fin.x = (zoom.depart.x + Math.min(zoom.zoom, taille.largeur - 1)) % taille.largeur;
		zoom.fin.y = (zoom.depart.y + Math.min(zoom.zoom, taille.hauteur - 1)) % taille.hauteur;
		
		calculerDimension();
		dessinerCanvas();
		
	}

}