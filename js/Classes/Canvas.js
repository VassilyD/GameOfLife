class Canvas {
	constructor(canvasHTML, jeu) {
		this._canvasHTML = canvasHTML;
		this._canvasHTML.style.height = window.innerHeight * 0.9;
		this._canvasHTML.style.width = window.innerHeight * 0.9;
		this._canvasHTML.style.top = window.innerHeight * 0.025;
		this._canvasHTML.style.right = window.innerWidth * 0.025;
		this._canvas = this._canvasHTML.getContext('2d');
		this._jeu = jeu;
		this._taillePixel = 1;
		this._hauteur = jeu.hauteur;
		this._largeur = jeu.largeur
		this._zoom = {top:0, left:0, right:this._largeur - 1, bottom:this._hauteur - 1};
	}
	// Affiche la grille de cellule
	dessinerJeu(){
		
		this._canvas.clearRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		//création d'un fond noir
		this._canvas.fillStyle = '#000000';
		this._canvas.fillRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		//création des cellules vivantes
		this._canvas.fillStyle = '#ffffff';
		for(var ligne = this._zoom.top, i = 0; i < this._hauteur; ligne = ++ligne % this._jeu._hauteur, i++) {
			for(var colonne = zoom.left, j = 0; j < this._largeur; colonne = ++colonne % this._jeu._largeur, j++) {
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
		canvas.fillStyle = 'rgba(255,0,0,1)';
		
		if(shiftPressed) {
			for(var ligne = 0; ligne < patternActuel.length; ligne++){
				for(var col = 0; col < patternActuel[ligne].length; col++){
					//xRel et yRel permettent de connecter les bord entre eux
					var xRel = coordMouse.x + col;
					xRel = (xRel >= this._jeu._largeur) ? (xRel - this._jeu._largeur) : (xRel < 0) ? xRel + this._jeu._largeur : xRel;
					var yRel = coordMouse.y + ligne;
					yRel = (yRel >= this._jeu._hauteur) ? (yRel - this._jeu._hauteur) : (yRel < 0) ? yRel + this._jeu._hauteur : yRel;
					this._canvas.fillStyle = (patternActuel[ligne][col]) ? 'rgba(255,0,0,0.9)' : 'rgba(0,0,0,0.9)';
					this._canvas.fillRect(((xRel - this._zoom.left + this._jeu._largeur) % this._jeu._largeur) * this._taillePixel, ((yRel - this._zoom.top + this._jeu._hauteur) % this._jeu._hauteur) * this._taillePixel, this._taillePixel, this._taillePixel);
				}
			}
		}
		else this._canvas.fillRect(((coordMouse.x - this._zoom.left + this._jeu._largeur) % this._jeu._largeur) * this._taillePixel, ((coordMouse.y - this._zoom.top + this._jeu._hauteur) % this._jeu._hauteur) * this._taillePixel, this._taillePixel, this._taillePixel);
	}

	dessinerCanvas() {	
		this.dessinerJeu();
		
		if(mouseOver) {
			this.dessinerOutil();
		}
	}

	calculerDimension() {
		var myVH = window.innerHeight / 100;
		var myVW = window.innerWidth / 100;
		
		this._largeur = (this._zoom.left < this._zoom.right) ? this._zoom.right - this._zoom.left + 1 : this._largeur - this._zoom.left + this._zoom.right + 1;
		this._hauteur = (this._zoom.top < this._zoom.bottom) ? this._zoom.bottom - this._zoom.top + 1 : this._hauteur - this._zoom.top + this._zoom.bottom + 1;
		this._taillePixel = (this._jeu._largeur < this._jeu._hauteur) ? this._canvasHTML.clientHeight / this._hauteur : this._canvasHTML.clientWidth / this._largeur;
		
		this._canvasHTML.style.width = Math.min((this._jeu._largeur >= this._jeu._hauteur) ? 90*myVH : this._largeur * this._taillePixel, 90*myVH) + 'px';
		this._canvasHTML.style.height = Math.min((this._jeu._largeur <= this._jeu._hauteur) ? 90*myVH : this._hauteur * this._taillePixel, 90*myVH) + 'px';
		this._canvasHTML.style.right = ((this._jeu._largeur >= this._jeu._hauteur) ? 2.5*myVW : 45*myVH - this._canvasHTML.clientWidth / 2 + 2.5*myVW) + 'px';
		this._canvasHTML.style.top = ((this._jeu._largeur <= this._jeu._hauteur) ? 2.5*myVH : 47.5*myVH - this._canvasHTML.clientHeight / 2) + 'px';
		this._canvasHTML.width = this._canvasHTML.clientWidth;
		this._canvasHTML.height = this._canvasHTML.clientHeight;
		this.dessinerCanvas();
	}
}