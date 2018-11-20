
function changerVitesse(e) {
	jeu.vitesse = (250 - vitesseSelecteur.value*1);
	document.getElementById('vitesseAffiche').innerHTML = (Math.floor(100000 / vitesse) / 100) + ' FPS';
	if(jeu.isAlive) {
		clearInterval(myAppInterval);
		myAppInterval = setInterval(myApp, Math.min(jeu.vitesse, 16.67));
	}
}

