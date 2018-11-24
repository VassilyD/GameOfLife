class GrapheCanvas {
	constructor(grapheCanvasHTML, jeu) {
		this._canvasHTML = grapheCanvasHTML;
		this._canvas = this._canvasHTML.getContext('2d');
		this._jeu = jeu;
		this._step = 1;
		this._taillePixelX = 0;
		this._taillePixelY = 0;
		
		this.calculerDimensions();
	}
	
	calculerDimensions() {
		this._canvasHTML.width = this._canvasHTML.clientWidth;
		this._canvasHTML.height = this._canvasHTML.clientHeight;
		this._taillePixelX = this._canvasHTML.clientWidth / Math.min(500 + (this._jeu.nbGeneration - 500 * this._step) / this._step, this._jeu.nbGeneration);
		this._taillePixelY = this._canvasHTML.clientHeight / this._jeu.nbVivantMax;
	}
	
	dessinerGraphe() {
		this._step = Math.max(1, Math.floor(this._jeu.nbGeneration / 500));
		this.calculerDimensions();
		var i = 0, iFin = this._jeu.nbGeneration, height = this._canvasHTML.clientHeight, width = this._canvasHTML.clientWidth;
		var nbVivantMoyen = 0, step = 0;
		
		
		this._canvas.clearRect(0, 0, this._canvasHTML.clientWidth, this._canvasHTML.clientHeight);
		
		this._canvas.beginPath();              
		this._canvas.lineWidth = 1 // Math.max(this._taillePixelX, this._taillePixelY);
		this._canvas.strokeStyle = "green";  // Green path
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
	}
}