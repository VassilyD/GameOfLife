class Canvas {
	constructor(canvasHTML, jeu, estEditable) {
		this._canvasHTML = canvasHTML;
		this._canvasOutilsHTML = canvasHTML.parentNode.appendChild(document.createElement('canvas'));
		this._canvas = this._canvasHTML.getContext('2d');
		this._canvasOutils = this._canvasOutilsHTML.getContext('2d');
		this._jeu = jeu;
		this._taillePixel = 1;
		this._hauteur = jeu.hauteur;
		this._largeur = jeu.largeur
		this._zoom = {top:0, left:0, right:this._largeur - 1, bottom:this._hauteur - 1, zoom:Math.max(this._largeur - 1, this._hauteur - 1)};
		this._coordMouse = {x:-1, y:-1, xRel:-1, yRel:-1};
		this._mouseOver = false;
		this._deplacementLibre = false;
		this._outilsTable = [];
		this.outilsTable = 1;
		if(estEditable) {
			var t = this;
			this._canvasOutilsHTML.onmousemove = function(event) {t.mouseMove(event)};
			this._canvasOutilsHTML.onmousedown = function(event) {t.paintingStart(event)};
			this._canvasOutilsHTML.onmouseup = function(event) {t.mouseUp(event)};
			this._canvasOutilsHTML.onmouseleave = function(event) {t.mouseLeave(event)};
			this._canvasOutilsHTML.onmouseenter = function(event) {t.mouseEnter(event)};
			this._canvasOutilsHTML.parentNode.onwheel = function(event) {t.zooming(event)};
		}
		
		this.calculerDimension();
	}
	
	set zoom(zoom) {
		this._zoom.left = Math.abs(zoom.left) % this._jeu.largeur;
		this._zoom.right = Math.abs(zoom.right) % this._jeu.largeur;
		this._zoom.top = Math.abs(zoom.top) % this._jeu.hauteur;
		this._zoom.bottom = Math.abs(zoom.bottom) % this._jeu.hauteur;
		this.calculerDimension();
		this._zoom.zoom = Math.max(this._largeur - 1, this._hauteur - 1)
	}
	
	set outilsTable(mode) {
		if(mode == 0){
			// this._outilsTable = [];
			for(var ligne = 0; ligne < this._jeu.hauteur; ligne++) {
				// this._outilsTable.push([]);
				for(var colonne = 0; colonne < this._jeu.largeur; colonne++) {
					if(this._outilsTable[ligne][colonne]) this._outilsTable[ligne][colonne] = 0;
				}
			}
		}
		else if(mode == 1){
			this._outilsTable = [];
			for(var ligne = 0; ligne < this._jeu.hauteur; ligne++) {
				this._outilsTable.push([]);
				for(var colonne = 0; colonne < this._jeu.largeur; colonne++) {
					this._outilsTable[ligne].push(0);
				}
			}
		}
	}
	// Affiche la grille de cellule
	dessinerJeu(){
		
		this._canvas.clearRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		//création d'un fond noir
		this._canvas.fillStyle = '#000000';
		this._canvas.fillRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		//création des cellules vivantes
		this._canvas.fillStyle = '#ffffff';
		// for(var ligne = this._zoom.top, i = 0; i < this._hauteur; ligne = ++ligne % this._jeu.hauteur, i++) {
			// for(var colonne = this._zoom.left, j = 0; j < this._largeur; colonne = ++colonne % this._jeu.largeur, j++) {
				// if(this._jeu.grille[ligne][colonne]) this._canvas.fillRect((j) * this._taillePixel, (i) * this._taillePixel, this._taillePixel, this._taillePixel);
				// if(this._deplacementLibre && ((ligne == 0 && colonne == this._zoom.right) || (colonne == 0 && ligne == this._zoom.bottom))) {
					// this._canvas.fillStyle = 'rgba(255,0,0,0.33)';
					// if(ligne == 0) this._canvas.fillRect(0, i * this._taillePixel - 2, this._largeur * this._taillePixel, 2);
					// if(colonne == 0) this._canvas.fillRect(j * this._taillePixel - 2, 0, 2, this._hauteur * this._taillePixel);
					// this._canvas.fillStyle = '#ffffff';
				// }
			// }
		// }
		var ligne, y, yRel, hauteur = this._hauteur, hauteurMax = this._jeu.hauteur,
			cellule, x, xRel, largeur = this._largeur, largeurMax = this._jeu.largeur;
		for(yRel = this._zoom.top, ligne = this._jeu.grille[yRel], y = 0; y < hauteur; y++) {
			for(xRel = this._zoom.left, cellule = ligne[xRel], x = 0; x < largeur; x++) {
				if(cellule) this._canvas.fillRect(x * this._taillePixel, y * this._taillePixel, this._taillePixel, this._taillePixel);
				if(this._deplacementLibre && ((yRel == 0 && xRel == this._zoom.right) || (xRel == 0 && yRel == this._zoom.bottom))) {
					this._canvas.fillStyle = 'rgba(255,0,0,0.33)';
					if(yRel == 0) this._canvas.fillRect(0, y * this._taillePixel - 2, this._largeur * this._taillePixel, 2);
					if(xRel == 0) this._canvas.fillRect(x * this._taillePixel - 2, 0, 2, this._hauteur * this._taillePixel);
					this._canvas.fillStyle = '#ffffff';
				}
				xRel = ++xRel % largeurMax;
				cellule = ligne[xRel];
			}
			yRel = ++yRel % hauteurMax;
			ligne = this._jeu.grille[yRel];
		}
	}

	// Affichage de l'outils selectionné
	dessinerOutil(){
		this._canvasOutils.clearRect(0, 0, this._canvasOutilsHTML.clientWidth, this._canvasOutilsHTML.clientHeight);
		
		// this._canvasOutils.fillStyle = 'rgba(0,0,0,0.8)';
		// for(var ligne = this._zoom.top, i = 0; i < this._hauteur; ligne = ++ligne % this._jeu.hauteur, i++) {
			// for(var colonne = this._zoom.left, j = 0; j < this._largeur; colonne = ++colonne % this._jeu.largeur, j++) {
				// if(this._outilsTable[ligne][colonne] == 1) this._canvasOutils.fillRect((j) * this._taillePixel, (i) * this._taillePixel, this._taillePixel, this._taillePixel);
			// }
		// }
		
		// this._canvasOutils.fillStyle = 'rgba(255,0,0,0.8)';
		// for(var ligne = this._zoom.top, i = 0; i < this._hauteur; ligne = ++ligne % this._jeu.hauteur, i++) {
			// for(var colonne = this._zoom.left, j = 0; j < this._largeur; colonne = ++colonne % this._jeu.largeur, j++) {
				// if(this._outilsTable[ligne][colonne] == 2) this._canvasOutils.fillRect((j) * this._taillePixel, (i) * this._taillePixel, this._taillePixel, this._taillePixel);
			// }
		// }
		if(this._mouseOver) {
			if(shiftPressed) {
				for(var ligne = 0; ligne < patternActuel.length; ligne++){
					for(var col = 0; col < patternActuel[ligne].length; col++){
						// xRel et yRel permettent de connecter les bord entre eux
						if(true || patternActuel[ligne][col]) {
							var xRel = this._coordMouse.x + col;
							xRel = (((xRel >= this._jeu._largeur) ? (xRel - this._jeu._largeur) : (xRel < 0) ? xRel + this._jeu._largeur : xRel) - this._zoom.left + this._jeu.largeur) % this._jeu.largeur;
							var yRel = this._coordMouse.y + ligne;
							yRel = (((yRel >= this._jeu._hauteur) ? (yRel - this._jeu._hauteur) : (yRel < 0) ? yRel + this._jeu._hauteur : yRel) - this._zoom.top + this._jeu.hauteur) % this._jeu.hauteur;
							this._canvasOutils.fillStyle = (patternActuel[ligne][col]) ? 'rgba(255,0,0,0.9)' : 'rgba(0,255,0,0.9)';
							this._canvasOutils.fillRect(xRel * this._taillePixel, yRel * this._taillePixel, this._taillePixel, this._taillePixel);
						}
					}
				}
			}
			else {
				this._canvasOutils.fillStyle = 'rgba(255,0,0,0.9)';
				this._canvasOutils.fillRect(this._coordMouse.xRel * this._taillePixel, 
											this._coordMouse.yRel * this._taillePixel, 
											this._taillePixel, 
											this._taillePixel);
			}
		}
	}

	dessinerCanvas() {	
		//this.dessinerJeu();
		
		/*if(this._mouseOver) {
			this.dessinerOutil();
		}*/
	}

	calculerDimension() {
		var ratio;
		
		this._largeur = (this._zoom.left < this._zoom.right) ? this._zoom.right - this._zoom.left + 1 : this._jeu.largeur - this._zoom.left + this._zoom.right + 1;
		this._hauteur = (this._zoom.top < this._zoom.bottom) ? this._zoom.bottom - this._zoom.top + 1 : this._jeu.hauteur - this._zoom.top + this._zoom.bottom + 1;
		
		ratio = this._largeur / this._hauteur;
		
		this._canvasOutilsHTML.style.width = this._canvasHTML.style.width = Math.min(100 * ratio, 100) + '%';
		this._canvasOutilsHTML.style.height = this._canvasHTML.style.height = Math.min(100 / ratio, 100) + '%';
		this._canvasOutilsHTML.style.right = this._canvasHTML.style.right = Math.max(50 * (1 - ratio), 0) + '%';
		this._canvasOutilsHTML.style.top = this._canvasHTML.style.top = Math.max(50 * (1 - 1 / ratio), 0) + '%';
		
		this._canvasHTML.width = this._canvasOutilsHTML.width = this._canvasHTML.clientWidth;
		this._canvasHTML.height = this._canvasOutilsHTML.height = this._canvasHTML.clientHeight;
		this._taillePixel = (this._largeur < this._hauteur) ? this._canvasHTML.clientHeight / this._hauteur : this._canvasHTML.clientWidth / this._largeur;
		
		this.dessinerJeu();
		this.dessinerOutil();
	}
	
	positionSourieCanvas(e){
		var offset = {X:e.offsetX, Y:e.offsetY};
		if(e.target != undefined && e.target == this._canvasHTML.parentNode) {
			offset.X += this._canvasHTML.offsetLeft;
			offset.Y += this._canvasHTML.offsetTop;
		}
		this._coordMouse.x = (this._zoom.left + Math.min(Math.floor(offset.X / this._taillePixel), this._largeur)) % this._jeu.largeur;
		this._coordMouse.y = (this._zoom.top + Math.min(Math.floor(offset.Y / this._taillePixel), this._hauteur)) % this._jeu.hauteur;
		this._coordMouse.xRel = (this._coordMouse.x - this._zoom.left + this._jeu.largeur) % this._jeu.largeur;
		this._coordMouse.yRel = (this._coordMouse.y - this._zoom.top + this._jeu.hauteur) % this._jeu.hauteur;
	}

	mouseMove(e) {
		this.outilsTable = 0;
		this.positionSourieCanvas(e);
		var coor = "Coordinates: (" + this._coordMouse.x + "," + this._coordMouse.y + ")";
		document.getElementById("testtt").innerHTML = coor;
		if(isPainting && !shiftPressed) {
			this._jeu.setCell(this._coordMouse.y, this._coordMouse.x, (e.altKey) ? false : true);
			if(!this._jeu.isAlive) this.dessinerJeu();
		}
		if(shiftPressed) {
			for(var ligne = 0; ligne < patternActuel.length; ligne++){
				for(var colonne = 0; colonne < patternActuel[ligne].length; colonne++){
					var xRel = (this._coordMouse.x + colonne) % this._jeu.largeur;
					var yRel = (this._coordMouse.y + ligne) % this._jeu.hauteur;
					this._outilsTable[yRel][xRel] = (patternActuel[ligne][colonne]) ? 2 : 1;
				}
			}
		}
		else this._outilsTable[this._coordMouse.y][this._coordMouse.x] = 2;
		this.dessinerOutil();
	}

	paintingStart(e) {
		isPainting = true;
		this.positionSourieCanvas(e);
		if(shiftPressed) {
			for(var ligne = 0; ligne < patternActuel.length; ligne++){
				for(var col = 0; col < patternActuel[ligne].length; col++){
					var xRel = (this._coordMouse.x + col) % this._jeu.largeur;
					var yRel = (this._coordMouse.y + ligne) % this._jeu.hauteur;
					this._jeu.setCell(yRel, xRel, patternActuel[ligne][col]);
				}
			}
		}
		else {
			this._jeu.setCell(this._coordMouse.y, this._coordMouse.x, (e.altKey) ? false : true);
		}
		if(!this._jeu.isAlive) this.dessinerJeu();
	}

	mouseUp(e) {
		isPainting = false;
	}

	//Quand la sourie entre sur la grille
	mouseEnter(e) {
		this._mouseOver = true;
	}

	//Quand la sourie quitte la grille
	mouseLeave() {
		this._mouseOver = false;
		isPainting = false;
		document.getElementById("testtt").innerHTML = '';
		this._canvasOutils.clearRect(0, 0, this._canvasOutilsHTML.clientWidth, this._canvasOutilsHTML.clientHeight);
	}

	deplacementCanvasPre() {
		var direction = [0, 0];
		if (toucheEnfonce && toucheEnfonce[37]) {direction[0] = -1; }
		if (toucheEnfonce && toucheEnfonce[39]) {direction[0] = 1; }
		if (toucheEnfonce && toucheEnfonce[38]) {direction[1] = -1; }
		if (toucheEnfonce && toucheEnfonce[40]) {direction[1] = 1; }
		if(direction[0] != 0 || direction[1] != 0)  this.deplacementCanvas(direction);
	}

	deplacementCanvas(direction) {
		var delta = {x:Math.max(1, Math.round(this._largeur / 50)), y:Math.max(1, Math.round(this._hauteur / 50))};
		if(direction[0] != 0) {
			if(!this._deplacementLibre) {
				this._zoom.left = Math.min(Math.max(this._zoom.left + direction[0] * delta.x, 0),  this._jeu.largeur - this._largeur);
				this._zoom.right = Math.min(Math.max(this._zoom.right + direction[0] * delta.x, this._largeur - 1),  this._jeu.largeur - 1);
			} else {
				this._zoom.left = (this._zoom.left + direction[0] * delta.x + this._jeu.largeur) % this._jeu.largeur;
				this._zoom.right = (this._zoom.right + direction[0] * delta.x + this._jeu.largeur) % this._jeu.largeur;
			}
		}
		if(direction[1] != 0) {
			if(!this._deplacementLibre) {
				this._zoom.top = Math.min(Math.max(this._zoom.top + direction[1] * delta.y, 0),  this._jeu.hauteur - this._hauteur);
				this._zoom.bottom = Math.min(Math.max(this._zoom.bottom + direction[1] * delta.y, this._hauteur - 1),  this._jeu.hauteur - 1);
			} else {
				this._zoom.top = (this._zoom.top + direction[1] * delta.y + this._jeu.hauteur) % this._jeu.hauteur;
				this._zoom.bottom = (this._zoom.bottom + direction[1] * delta.y + this._jeu.hauteur) % this._jeu.hauteur;
			}
		}
		if(!(this._jeu.isAlive && (this._jeu.vitesse < 50 || this._jeu.vitesse >= 50 && this._jeu._fps[10] - this._jeu._fps[9] > this._jeu.vitesse * 1.2))) {
			this.dessinerJeu();
		}
	}

	deplacement() {
		this._deplacementLibre = !this._deplacementLibre;
		if (this._zoom.left + this._largeur >= this._jeu.largeur) {
			var delta = this._zoom.left + this._largeur - this._jeu.largeur;
			if(delta > this._largeur / 2) delta = -1 * (this._largeur - delta);
			
			this._zoom.left = (this._zoom.left - delta + this._jeu.largeur) % this._jeu.largeur;
			this._zoom.right = (this._zoom.right - delta + this._jeu.largeur) % this._jeu.largeur;
		}
		if (this._zoom.top + this._hauteur >= this._jeu.hauteur) {
			var delta = this._zoom.top + this._hauteur - this._jeu.hauteur;
			if(delta > this._hauteur / 2) delta = -1 * (this._hauteur - delta);
			
			this._zoom.top = (this._zoom.top - delta + this._jeu.hauteur) % this._jeu.hauteur;
			this._zoom.bottom = (this._zoom.bottom - delta + this._jeu.hauteur) % this._jeu.hauteur;
		}
		document.getElementById("deplacementLibre").innerHTML = (this._deplacementLibre) ? 'Désactiver déplacement libre' : 'Activer déplacement libre';
	}

	zoomViaClavier() {
		if (toucheEnfonce[107] || toucheEnfonce[109]) {
			var e = {};
			e.offsetX = this._canvasHTML.width / 2;
			e.offsetY = this._canvasHTML.height / 2;
			e.deltaY = (toucheEnfonce[107]) ? -1 : (toucheEnfonce[109]) ? 1 : 0;
			this.zooming(e);
		}
	}

	zooming(e) {
		this.positionSourieCanvas(e);
		
		var coordMouseRel = {	x:(this._coordMouse.x - this._zoom.left + this._jeu.largeur) % this._jeu.largeur, // coordonné du pointeur dans la zone visible
								y:(this._coordMouse.y - this._zoom.top + this._jeu.hauteur) % this._jeu.hauteur}	
		var coordMouseRatio = {	x:(coordMouseRel.x / (this._largeur -1 ) - 0.5) * 2, // vaut entre -1 et +1 selon si la sourie est plus ou moins à gauche ou plus ou moins à droite
								y:(coordMouseRel.y / (this._hauteur - 1) - 0.5) * 2} // même chose mais entre le haut et le bas/**/
								
		var deltaRatio = Math.round(Math.max(Math.abs(e.deltaY) * this._zoom.zoom / 60, 1)); // adapte le delta à la taille de la zone visible
		
		var deltaWheel = e.deltaY / Math.abs(e.deltaY); // molette vers l'avant = -1 = zoom in, molette vers l'arrière = 1 = zoom out
		
		var delta = {	
			left:deltaWheel * ((!this._deplacementLibre && deltaWheel == 1 && deltaRatio * (1 - coordMouseRatio.x) >= this._jeu.largeur - 1 - this._zoom.right) ? deltaRatio * 2 + this._zoom.right - (this._jeu.largeur - 1) : deltaRatio * (1 + coordMouseRatio.x)),
			top:deltaWheel * ((!this._deplacementLibre && deltaWheel == 1 && deltaRatio * (1 - coordMouseRatio.y) >= this._jeu.hauteur - 1 - this._zoom.bottom) ? deltaRatio * 2 + this._zoom.bottom - (this._jeu.hauteur - 1) : deltaRatio * (1 + coordMouseRatio.y))};
		
		this._zoom.zoom = Math.min(Math.max(this._zoom.zoom + deltaWheel * 2 * deltaRatio, 9), Math.max(this._jeu.largeur - 1, this._jeu.hauteur - 1));
		
		// 1) Application du delta
		// 2) Empêche un zoom plus fort que 10 cellule de côté
		// 3) Empêche de sortir des limites de la grille   !this._deplacementLibre
		var adapt = {	X:{t: this._zoom.right < this._zoom.left, vfi: this._zoom.right + this._jeu.largeur, vfo: this._zoom.right - this._jeu.largeur}, 
						Y:{t: this._zoom.bottom < this._zoom.top, vfi: this._zoom.bottom + this._jeu.hauteur, vfo: this._zoom.bottom - this._jeu.hauteur}};
		
		if(!(this._largeur == this._jeu.largeur && this._largeur < this._hauteur)) this._zoom.left = Math.round(Math.min(Math.max(Math.min(this._zoom.left - delta.left, ((adapt.X.t) ? adapt.X.vfi : this._zoom.right) - 9), ((this._deplacementLibre) ? (((adapt.X.t) ? this._zoom.right : adapt.X.vfo) + 1) : 0)), (this._deplacementLibre) ? this._zoom.left + Math.abs(delta.left) : this._jeu.largeur - 10) + this._jeu.largeur) % this._jeu.largeur;
		
		if(!(this._hauteur == this._jeu.hauteur && this._hauteur < this._largeur)) this._zoom.top = Math.round(Math.min(Math.max(Math.min(this._zoom.top - delta.top, ((adapt.Y.t) ? adapt.Y.vfi : this._zoom.bottom) - 9), ((this._deplacementLibre) ? (((adapt.Y.t) ? this._zoom.bottom : adapt.Y.vfo) + 1) : 0)), (this._deplacementLibre) ? this._zoom.top + Math.abs(delta.top) : this._jeu.hauteur - 10) + this._jeu.hauteur) % this._jeu.hauteur;
		
		this._zoom.right = (this._zoom.left + Math.min(this._zoom.zoom, this._jeu.largeur - 1)) % this._jeu.largeur;
		this._zoom.bottom = (this._zoom.top + Math.min(this._zoom.zoom, this._jeu.hauteur - 1)) % this._jeu.hauteur;
		
		this.calculerDimension();
	}

}