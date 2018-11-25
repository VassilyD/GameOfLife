let canvasHTML;
let selectPatternHTML;
let tailleSelecteurHTML;
let vitesseSelecteurHTML;
let infoStatsHTML;
let afficheTestHTML;
let launcherHTML;
let grapheCanvasHTML;

let myAppInterval = 0;
let deplacementInterval = 0;
let toucheEnfonce = [];
let isToucheEnfonce = false;
let isPainting = false;
let shiftPressed = false;
let patternActuel;
let jeu, canvas, grapheCanvas;


var testPattern = [[false, true, false], [false, false, true], [true, true, true]];
var patternList = {	marcheur:{	
					NE:[[true, true, true], [false, false, true], [false, true, false]], 
					SE:[[false, true, false], [false, false, true], [true, true, true]], 
					SW:[[false, true, false], [true, false, false], [true, true, true]], 
					NW:[[true, true, true], [true, false, false], [false, true, false]]
				},
				oscillateur:{
					ligne:[[true, true, true]],
					grenouille:[[false, true, true, true], [true, true, true, false]],
					pentadecathlon:[[false, false, true , false, false, false, false, true , false, false],
									[true , true , false, true , true , true , true , false, true , true ],
									[false, false, true , false, false, false, false, true , false, false]],
					rosace:[[true , true , true , true , true ],
							[true , false, false, false, true ],
							[true , true , true , true , true ]],
					galaxyDeKok:[	[true , true , true , true , true , true , false, true , true ],
									[true , true , true , true , true , true , false, true , true ],
									[false, false, false, false, false, false, false, true , true ],
									[true , true , false, false, false, false, false, true , true ],
									[true , true , false, false, false, false, false, true , true ],
									[true , true , false, false, false, false, false, true , true ],
									[true , true , false, false, false, false, false, false, false],
									[true , true , false, true , true , true , true , true , true ],
									[true , true , false, true , true , true , true , true , true ]]
				},
				canon:{
					gosperGliderGunSE:[
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
						[true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]],
					gosperGliderGunNE:[
						[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false]],
					gosperGliderGunNW:[
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,     true,     false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, true, true, false, true, false, false, false, true, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, true, true],
						[true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]],
					gosperGliderGunSW:[
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false],
						[true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, true, true, false, true, false, false, false, true, false, false, false, false, false, false, false, false, true, true],
						[false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false]]
				},
				generateur:{
					zeroNW:[
						[false, false, false, false, false, false, true, false],
						[false, false, false, false, true, false, true, true],
						[false, false, false, false, true, false, true, false],
						[false, false, false, false, true, false, false, false],
						[false, false, true, false, false, false, false, false],
						[true, false, true, false, false, false, false, false],],
					unNW:[
						[true, true, true, false, true],
						[true, false, false, false, false],
						[false, false, false, true, true],
						[false, true, true, false, true],
						[true, false, true, false, true]],
					deuxNSE:[[true, true, true, true, true, true, true, true, false, true, true, true, true, true, false, false, false, true, true, true, false, false, false, false, false, false, true, true, true, true, true, true, true, false, true, true, true, true, true]]
				},
				block:{
					carre:[[true, true], [true, true]],
					tube:[
						[false, true, false], 
						[true, false, true], 
						[false, true, false]],
					pecheur:[
						[true, true, false, false], 
						[true, false, true, false], 
						[false, false, true, false], 
						[false, false, true, true]],
					python:[
						[false, false, false, true, true], 
						[true, false, true, false, true], 
						[true, true, false, false, false]]
				}
};
patternActuel = patternList.canon.gosperGliderGunSE.slice();