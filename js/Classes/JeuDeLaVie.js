class JeuDeLaVie {	
	constructor(largeur, hauteur) {
		this._largeur = largeur;
		this._hauteur = hauteur;
		this._somme = []; 
		this._grille = []; 
		this._vitesse = 30;
		this._nbGeneration = 0;
		this._nbVivant = 0;
		this._nbVivantHistorique = [];
		this._nbVivantMax = 0;
		this._interval = 0;
		this._isAlive = false;
		this._fps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		
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
	
	get nbVivantMax() {return this._nbVivantMax}
	
	get nbVivantHistorique() {return this._nbVivantHistorique}
	
	get fps() {
		var fps = 0;
		var j =  0;
		for(var i = 1; i < 11; i++) {
			if(this._fps[i-1] != 0) {
				fps += (this._fps[i] - this._fps[i-1]);
				j++;
			}
		}
		if(j != 0) fps /= j;
		return (Math.floor(100000 / fps) / 100);
	}
	
	nbVivantVariation(Gen = -1) {
		if(Gen < 0) return this.nbVivant - (this._nbVivantHistorique[this.nbGeneration - 1] || 0);
		if(Gen == 0) return this.nbVivantHistorique[0];
		return (this.nbVivantHistorique[Gen] - this.nbVivantHistorique[Gen - 1]);
	}
	
	set vitesse(val) {
		if(val > 1 && val < 250) {
			this._vitesse = val;
			if(this._isAlive) {
				this.lancer();
				this.lancer();
			}
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

	set nbVivantMax(val = 0) {
		if(val > 0) {
			for(population of this._nbVivantHistorique) if(population > val) val = population;
			this._nbVivantMax = val;
		}
	}

	
	
	setCell(ligne, colonne, etat) {
		etat = !!etat;
		if(ligne >= 0 && ligne < this._hauteur && colonne >= 0 && colonne < this._largeur) {
			if(etat != this._grille[ligne][colonne]) {
				this._nbVivant += (etat) ? 1 : -1;
				this.nbVivantHistorique[this.nbGeneration] += (etat) ? 1 : -1;
			}
			this._grille[ligne][colonne] = etat;
		}
	}
	
	setCellInit(ligne, colonne, mode) {
		switch (mode) {
			case 'aleatoire':
				this._grille[ligne][colonne] = (Math.random() <= ((this.aVoisin(ligne, colonne)) ? 0.3 : 0.001));
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
			this._nbVivantHistorique = [];
			this._nbVivantMax = 0;
		}
		this.setGrille(mode);
		this._nbVivantHistorique.push(this._nbVivant);
		this._nbVivantMax = Math.max(this._nbVivant, this._nbVivantMax);
	}
	
	aVoisin(ligne, colonne) {
		var iRelatif = 0;
		var jRelatif = 0;
		var i = ligne - 1;
		var iFin = ligne + 1;
		var aVoisin = false;
		while (!aVoisin && i <= iFin) {
			var j = colonne - 1;
			var jFin = colonne + 1;
			while (!aVoisin &&  j <= jFin) {
				// valeur relative = connecte les bords (exemple si i = -1 avec une hauteur de 10, -1 +10 = 9 et 9 % 10 = 9 ce qui correspond à la dernière ligne)
				iRelatif = (i < 0) ? this._hauteur - 1 : (i < this._hauteur) ? i : 0;
				jRelatif = (j < 0) ? this._largeur - 1 : (j < this._largeur) ? j : 0;
				if(this._grille[iRelatif] && this._grille[iRelatif][jRelatif]) aVoisin = true;
				j++
			}
			i++;
		}
		return aVoisin;
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
		var estStable = true;
		// for (var ligne = 0; ligne < this._hauteur; ligne++) {
			// for (var colonne = 0; colonne < this._largeur; colonne++) {
				// /*si la cellule est vivante, ajouter +1 à la somme des voisins de chaque cellule voisine*/
				// if(this._grille[ligne][colonne]) {
					// this.ajouterVoisin(ligne, colonne);
				// }
			// }
		// }
		
		// this._nbVivant = 0;
		// for (var ligne = 0; ligne < this._hauteur; ligne++) {
			// for (var colonne = 0; colonne < this._largeur; colonne++) {
				// /* Actualise la grille à partir de la somme des voisin de chaque cellule et compte le nombre de cellule vivante */
				// var nouveauStatut = (this._somme[ligne][colonne] == 3 || (this._grille[ligne][colonne] && this._somme[ligne][colonne] == 2));
				// if(this._grille[ligne][colonne] != nouveauStatut) {
					// this._grille[ligne][colonne] = nouveauStatut;
					// estStable = false;
				// }
				// if(nouveauStatut) 
					// this._nbVivant++;
				// this._somme[ligne][colonne] = 0;
			// }
		// }
		var ligne, ligneS, y, hauteur, cellule, celluleS, x, largeur;
		
		for (ligne = this._grille[0], y = 0, hauteur = this._hauteur; y < hauteur; y++, ligne = this._grille[y]) {
			for (cellule = ligne[0], x = 0, largeur = this._largeur; x < largeur; x++, cellule = ligne[x]) {
				/* si la cellule est vivante, ajouter +1 à la somme des voisins de chaque cellule voisine */
				if(cellule) {
					this.ajouterVoisin(y, x);
				}
			}
		}
		
		this._nbVivant = 0;
		for (ligne = this._grille[0], ligneS = this._somme[0], y = 0, hauteur = this._hauteur; y < hauteur; y++, ligne = this._grille[y], ligneS = this._somme[y]) {
			for (cellule = ligne[0], celluleS = ligneS[0], x = 0, largeur = this._largeur; x < largeur; x++, cellule = ligne[x], celluleS = ligneS[x]) {
				/* Actualise la grille à partir de la somme des voisin de chaque cellule et compte le nombre de cellule vivante */
				var nouveauStatut = (celluleS == 3 || (cellule && celluleS == 2));
				if(cellule != nouveauStatut) {
					ligne[x] = nouveauStatut;
					estStable = false;
				}
				if(nouveauStatut) 
					this._nbVivant++;
				ligneS[x] = 0;
			}
		}
		
		this._fps.push(Date.now());
		this._fps.shift();
		this._nbGeneration++;
		this._nbVivantHistorique.push(this._nbVivant);
		if(this._nbVivant > this._nbVivantMax) this._nbVivantMax = this._nbVivant;
		if(estStable && this._isAlive) this.lancer();
		
		// A passer en design pattern controleur
		canvas.dessinerJeu();
		grapheCanvas.dessinerGraphe();
	}

	lancer() {
		if(this._isAlive) {
			clearInterval(this._interval);
			this._isAlive = false;
			for(var i = 0; i < 10; i++) this._fps[i] = 0;
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