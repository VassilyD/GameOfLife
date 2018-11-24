class GrapheCanvas {
	constructor(grapheCanvasHTML, jeu) {
		this._canvasHTML = grapheCanvasHTML;
		this._canvas = this._canvasHTML.getContext('2d');
		this._jeu = jeu;
		this._step = 1;
		this._taillePixelX = 0;
		this._taillePixelY = 0;
		this._coordPointeurX = 0;
		this._estFocus = false;
		
		this._infoHTML = this._canvasHTML.parentNode.appendChild(document.createElement('div'));
		this._infoHTML.id = 'infoGraphe';
		
		this._canvasOutilsHTML = this._canvasHTML.parentNode.appendChild(document.createElement('canvas'));
		this._canvasOutilsHTML.id = 'outilGraphe';
		this._canvasOutils = this._canvasOutilsHTML.getContext('2d');
		
		this._canvasOutilsHTML.onmousemove = function(event) {this.deplacementPointeur(event)}.bind(this);
		this._canvasOutilsHTML.onmouseleave = function(event) {this.sortiePointeur(event)}.bind(this);
		this._canvasOutilsHTML.onmouseenter = function(event) {this.entreePointeur(event)}.bind(this);
		
		this.calculerDimensions();
	}
	
	positionPointeur(e) {
		this._coordPointeurX = Math.round(this._step * e.offsetX / this._taillePixelX);
	}
	
	deplacementPointeur(e) {
		this.positionPointeur(e);
		this._infoHTML.innerHTML = 'Génération : ' + this._coordPointeurX + ', Population : ' + this._jeu.nbVivantHistorique[this._coordPointeurX] + ' (' + this._jeu.nbVivantVariation(this._coordPointeurX) + ')';
		this.dessinerOutils();
	}
	
	entreePointeur(e) {
		this._estFocus = true;
	}
	
	sortiePointeur(e) {
		this._infoHTML.innerHTML = '';
		this._canvasOutils.clearRect(0, 0, this._canvasOutilsHTML.clientWidth, this._canvasOutilsHTML.clientHeight);
		this._estFocus = false;
	}
	
	calculerDimensions() {
		this._canvasHTML.width = this._canvasOutilsHTML.width = this._canvasHTML.clientWidth;
		this._canvasHTML.height = this._canvasOutilsHTML.height = this._canvasHTML.clientHeight;
		this._taillePixelX = this._canvasHTML.clientWidth / Math.min(500 + (this._jeu.nbGeneration - 500 * this._step) / this._step, this._jeu.nbGeneration);
		this._taillePixelY = this._canvasHTML.clientHeight / this._jeu.nbVivantMax;
	}
	
	dessinerOutils() {
		this._canvasOutils.clearRect(0, 0, this._canvasOutilsHTML.width, this._canvasOutilsHTML.height);
		
		this._canvasOutils.fillStyle = '#ff0000';
		this._canvasOutils.fillRect(0, this._canvasHTML.clientHeight - this._jeu.nbVivantHistorique[this._coordPointeurX] * this._taillePixelY, this._canvasOutilsHTML.width, 1);
		this._canvasOutils.fillRect(this._coordPointeurX * this._taillePixelX / this._step, 0, 1, this._canvasOutilsHTML.height);
	}
	
	dessinerGraphe() {
		this._step = Math.max(1, Math.floor(this._jeu.nbGeneration / 500));
		this.calculerDimensions();
		var i = 0, iFin = this._jeu.nbGeneration, height = this._canvasHTML.clientHeight, width = this._canvasHTML.clientWidth;
		var nbVivantMoyen = 0, step = 0;
		
		
		this._canvas.clearRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		this._canvas.beginPath();              
		this._canvas.lineWidth = 1;
		this._canvas.strokeStyle = "green"; 
		this._canvas.moveTo(0, height - this._jeu.nbVivantHistorique[0] * this._taillePixelY);
		for(var j = 0; i <= iFin; i++) {
			nbVivantMoyen += this._jeu.nbVivantHistorique[i];
			step++;
			if(step % this._step == 0 || iFin - i < this._step) {
				this._canvas.lineTo(j * this._taillePixelX, height - nbVivantMoyen * this._taillePixelY / step);
				nbVivantMoyen = 0;
				step = 0;
				j++;
			}
		}
		this._canvas.stroke();
		if(this._estFocus) this.dessinerOutils();
	}
}