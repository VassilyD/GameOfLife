class JeuDeLaVie {	
	constructor(largeur, hauteur) {
		this._largeur = largeur;
		this._hauteur = hauteur;
		this._somme = []; 
		this._grille = []; 
		this._vitesse = 30;
		this._nbGeneration = 0;
		this._nbVivant = 0;
		this._interval = 0;
		this._isAlive = false;
		this.setJeu(largeur, hauteur);
	}
	
	get somme() {return this._somme}
		
	get grille() {return this._grille}
		
	get largeur() {return this._largeur}
		
	get hauteur() {return this._hauteur}
		
	get vitesse() {return this._vitesse}
		
	get nbGeneration() {return this._nbGeneration}
		
	get nbVivant() {return this._nbVivant}
	
	get isAlive() {return this._isAlive}
	
	set vitesse(val) {
		if(val > 1 && val < 250) this._vitesse = val;
		if(this._isAlive) {
			this.lancer();
			this.lancer();
		}
	}
	
	set hauteur(val) {
		if(val > 20) this._hauteur = val;
	}
	
	set largeur(val) {
		if(val > 20) this._largeur = val;
	}
	
	set nbGeneration(val) {
		if(val > 0) this._nbGeneration = val;
	}
	
	set nbVivant(val) {
		if(val > 0) this._nbVivant = val;
	}

	setCell(ligne, colonne, etat) {
		etat = !!etat;
		if(ligne >= 0 && ligne < this._hauteur && colonne >= 0 && colonne < this._largeur)
			this._grille[ligne][colonne] = etat;
	}
	
	setCellInit(ligne, colonne, mode) {
		switch (mode) {
			case 'aleatoire':
				this._grille[ligne][colonne] = (Math.random() <= 0.3);
				if(this._grille[ligne][colonne]) this._nbVivant++;
				break;
		
			case 'vide':
				this._grille[ligne][colonne] = false;
				break;
		
			/*case 'extension':
				table[ligne][colonne] = (typeof(table[ligne][colonne]) == 'undefined') ? false : table[ligne][colonne];
				break;*/
		
			default:
				this._grille[ligne][colonne] = false;
		}
	}

	setGrille(mode = 'aleatoire') {
		this._grille = [];
		this._somme = [];
		for (var ligne = 0, hauteur = this._hauteur; ligne < hauteur; ligne++) {
			this._grille[ligne] = [];
			this._somme[ligne] = [];
			for (var colonne = 0, largeur = this._largeur; colonne < largeur; colonne++) {
				this.setCellInit(ligne, colonne, mode);
				this._somme[ligne][colonne] = 0;
			}
		}
	}
	
	setJeu(largeur, hauteur, mode = 'aleatoire') {
		if(this._isAlive) {
			clearInterval(this._interval);
			this._isAlive = false;
		}
		this._largeur = largeur;
		this._hauteur = hauteur;
		if(mode != 'extension') {
			this._nbGeneration = 0;
			this._nbVivant = 0;
		}
		this.setGrille(mode);
	}

	// Ajoute +1 à la somme des voisins de chaque cellule voisine de la cellule indiqué
	ajouterVoisin(ligne, colonne) {
		var iRelatif = 0;
		var jRelatif = 0;
		for (var i = ligne - 1, iFin = ligne + 1; i <= iFin; i++) {
			for (var j = colonne - 1, jFin = colonne + 1; j <= jFin; j++) {
				// valeur relative = connecte les bords (exemple si i = -1 avec une hauteur de 10, -1 +10 = 9 et 9 % 10 = 9 ce qui correspond à la dernière ligne)
				iRelatif = (i < 0) ? this._hauteur - 1 : (i < this._hauteur) ? i : 0;
				jRelatif = (j < 0) ? this._largeur - 1 : (j < this._largeur) ? j : 0;
				this._somme[iRelatif][jRelatif]++;
			}
		}
		this._somme[ligne][colonne]--;
	}

	nouveauCycle() {
		var nbVivantPasse = 0;
		for (var ligne = 0; ligne < this._hauteur; ligne++) {
			for (var colonne = 0; colonne < this._largeur; colonne++) {
				//si la cellule est vivante, ajouter +1 à la somme des voisins de chaque cellule voisine
				if(this._grille[ligne][colonne]) {
					this.ajouterVoisin(ligne, colonne);
					nbVivantPasse++;
				}
			}
		}
		
		this._nbVivant = 0;
		for (var ligne = 0; ligne < this._hauteur; ligne++) {
			for (var colonne = 0; colonne < this._largeur; colonne++) {
				//Actualise la grille à partir de la somme des voisin de chaque cellule et compte le nombre de cellule vivante
				var nouveauStatut = (this._somme[ligne][colonne] == 3 || (this._grille[ligne][colonne] && this._somme[ligne][colonne] == 2));
				if(this._grille[ligne][colonne] != nouveauStatut)
					this._grille[ligne][colonne] = nouveauStatut;
				if(nouveauStatut) 
					this._nbVivant++;
				this._somme[ligne][colonne] = 0;
			}
		}
		
		this._nbGeneration++;
	}

	lancer() {
		if(this._isAlive) {
			clearInterval(this._interval);
			this._isAlive = false;
		}
		else {
			var t = this;
			this._interval = setInterval(function(){t.nouveauCycle()}, this._vitesse);
			this._isAlive = true;
		}
	}
	
	reset(mode) {
		if(this._isAlive) clearInterval(this._interval);
		this._isAlive = false;
		this.setJeu(this._largeur, this._hauteur, mode)
	}
}