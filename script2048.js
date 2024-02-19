

const HEIGHT = 800;
const WIDTH = 800;


let nbCaseX = 4;   
let nbCaseY = 4;    
let tailleChiffre = WIDTH / nbCaseX / 3;
let tailleCase = WIDTH / nbCaseX;
let tailleBordure = tailleCase / 10;


//cadre de jeu:
let debutPlateauX = tailleBordure;
let debutPlateauY = tailleBordure;
let largeurPlateau = WIDTH - tailleBordure - debutPlateauX;
let hauteurPlateau = HEIGHT - tailleBordure - debutPlateauY;

//plateau de jeu:
let plateau;
let listeCaseMouvement = [
    [{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 }],
    [{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 }],
    [{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 }],
    [{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 },{ value: 0, animation: false, targetX:0, targetY:0 }]
];

let couleurCase = {
    0: "#ccc0b2",
    2: "#eee4da",
    4: "#eddfc4",
    8: "#f4b17a",
    16: "#f59563",
    32: "#f67e5b",  
    64: "#f65e39",
    128: "#edce73",
    256: "#edca64",
    512: "#edc651",
    1024: "#e1cc37",
    2048: "#e9c33c"
}


window.onload = function () {

    board = document.getElementById("board")
    board.height = HEIGHT;
    board.width = WIDTH;
    context = board.getContext("2d");
    
    requestAnimationFrame(game);
    document.addEventListener("keydown", pressKey)
    initGame();

}

function pressKey(event) {
    let deplacement = false;
    if (event.key == "z") {
        deplacementCase("haut");
        deplacement = true;
    } else if (event.key == "q") {
        deplacementCase("gauche");
        deplacement = true;
    } else if (event.key == "s") {
        deplacementCase("bas");
        deplacement = true;
    } else if (event.key == "d") {
        deplacementCase("droite");
        deplacement = true;
    } 
    if (deplacement) {
        ajouterNouvelleCase();
        //affichePlateau(); // sans annimation
        affichePlat();      // avec annimation
    }
    
}

function initGame() {

    listeCaseMouvement = []
    for (let y = 0; y < nbCaseY; y++) {
        listeCaseMouvement.push([])
        for (let x = 0; x < nbCaseX; x++) {
            listeCaseMouvement[y].push({ value: 0, animation: false, x: x*tailleCase, y:y*tailleCase, ancienneX: x*tailleCase, ancienneY:y*tailleCase });
        }
    }
    ////
    plateau = []
    for (let y = 0; y < nbCaseY; y++) {
        plateau.push([])
        for (let x = 0; x < nbCaseX; x++) {
            plateau[y].push(0)
        }
    }
    ajouterNouvelleCase();
    ajouterNouvelleCase();
    affichePlateau();

}

function game() {

    //affichePlateau()

    if (!finGame()) {
        requestAnimationFrame(game)

    }
}





function finGame() {
    nbCaseVide = 0

    plateau.forEach(function (element) {

        element.forEach(function (elem) {

            if (elem == 0) {
                nbCaseVide++
            }
        });
    });
    return nbCaseVide <= 0
}


function affichePlat() {
    listeCaseMouvement.forEach(function (element) {
        element.forEach(function (elem) {
            if ( elem.animation ) {
                gsap.fromTo(elem, {x: elem.x, y : elem.y }, { x: elem.x+elem.targetX, y: elem.y+elem.targetY, duration: 2,
                                onUpdate: function() {
                                    drawSquare(elem);
                                }, onComplete: () => {
                                    // on remet les valeurs à 0:
                                    listeCaseMouvement[(elem.y/tailleCase)][(elem.x/tailleCase)].value = elem.value;
                                    listeCaseMouvement[(elem.y/tailleCase)-(elem.targetY/tailleCase)][(elem.x/tailleCase)-(elem.targetX/tailleCase)].value = 0;
                                    listeCaseMouvement[(elem.y/tailleCase)-(elem.targetY/tailleCase)][(elem.x/tailleCase)-(elem.targetX/tailleCase)].animation = false;
                                    elem.x = elem.ancienneX;
                                    elem.y = elem.ancienneY;
                                    elem.targetY = 0;
                                    elem.targetX = 0;
                                } })
            }
        })
    })
}

function drawSquare(elem) {
    
    //affiche carre:
    context.fillStyle = couleurCase[elem.value];
    context.fillRect(elem.x, elem.y, largeurPlateau / nbCaseX, hauteurPlateau / nbCaseY);

    //affiche texte:
    context.font = tailleChiffre+"px verdana";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#776e65";
    context.fillText(elem.value, elem.x+tailleCase/2, elem.y+tailleCase/2);

    affichePlateau() 
}


function affichePlateau() {
 
    //affiche bordure:
    context.strokeStyle = "#bbaea0";
    context.lineWidth = tailleBordure;
    for (let y = 0; y < nbCaseY; y++) {
        for (let x = 0; x < nbCaseX; x++) {
            context.strokeRect(debutPlateauX + (largeurPlateau / nbCaseX) * x, debutPlateauY + (hauteurPlateau / nbCaseY) * y, largeurPlateau / nbCaseX, hauteurPlateau / nbCaseY);
        }
    }
}


function ajouterNouvelleCase() {
    // nombre aleatoire entre 0-3, si c'est 0 je fais apparaitre une case 4
    // sinon je fais apparaiter une case 2
    let nombreAlea = Math.floor(Math.random() * 4);
    let valeurNewCase = 0;
    if (nombreAlea == 0) {
        valeurNewCase=4;
    } else {
        valeurNewCase=2;
    }

    let trouvePlace = false;
    while (!trouvePlace) {
        let x = Math.floor(Math.random() * nbCaseX);;
        let y = Math.floor(Math.random() * nbCaseY);;
        if (listeCaseMouvement[y][x].value == 0) {
            listeCaseMouvement[y][x].value = valeurNewCase;
            trouvePlace = true;
        }
    }
    
}


//fonction de déplacement:
function deplacementCase(direction) {
    // déplacement vers le haut:
    /*
    dans un premier temps, je place la ligne que je gere dnas un liste est 
    je supprime tout les 0 pour les mettre à la fin, ensuite je regarde si
    deux chiffres sont egaux ou si un chiffre est égale à 0 et le chiffre d'apres
    si oui, j 'additionne les deux chiffres et je supprime le deuxieme chiffre
    ensuite je remet les 0 à la fin, et je replace bien la liste dans le plateau
    */
    let arrayModif = []

    if (direction == "bas") {
        for (let x = 0; x < nbCaseX; x++) {
            arrayModif.push([]);
            for (let y = 0; y < nbCaseY; y++) {
                arrayModif[x].push(listeCaseMouvement[y][x].value);
                

            }
        }
    }
    else if (direction == "haut") {
        for (let x = 0; x < nbCaseX; x++) {
            arrayModif.push([]);
            for (let y = 1; y < nbCaseY+1; y++) {
                arrayModif[x].push(listeCaseMouvement[nbCaseY-y][x].value);
                

            }
        }
    }    else if (direction == "droite") {
        for (let y = 0; y < nbCaseY; y++) {
            arrayModif.push([])
            for (let x = 0; x < nbCaseX; x++) {
                arrayModif[y].push(listeCaseMouvement[y][x].value)
            }
        }
    } else if (direction == "gauche") {
        for (let y = 0; y < nbCaseY; y++) {
            arrayModif.push([])
            for (let x = 1; x < nbCaseX + 1; x++) {
                arrayModif[y].push(listeCaseMouvement[y][nbCaseX-x].value)
            }
        }
    }

    //Etape 2.2:
    //on supprime les 0:
    let mouvementCase = []
    let nb0aSupprimer = 0;
    let decallage = 0;
    for (let y = 0; y < nbCaseY; y++) {
        mouvementCase.push([]);
        for (let x = 1; x < nbCaseX + 1; x++) {

            if (arrayModif[y][nbCaseX -x +decallage] == 0) {
                arrayModif[y].splice(nbCaseX - x+decallage, 1);
                arrayModif[y].unshift(0);
                nb0aSupprimer ++;
                decallage++;
                mouvementCase[y].push(0);
            }
            else if (arrayModif[y][nbCaseX - x+decallage] != 0) {
                mouvementCase[y].push(nb0aSupprimer*tailleCase) 
            }
        }
        console.log("test")
        nb0aSupprimer = 0;
        decallage = 0;

    }

    //Etape 3.2:
    //je replace les chiffres dans la grille:
    if (direction == "droite") {
        for (let y = 0; y<mouvementCase.length; y++) {
            mouvementCase[y].reverse();
            for (let x = 0; x < mouvementCase[y].length; x++) {
                if (mouvementCase[y][x] != 0) {
                    listeCaseMouvement[y][x].targetX = mouvementCase[y][x];
                    listeCaseMouvement[y][x].targetY = 0;
                    listeCaseMouvement[y][x].animation = true;
                }
            }
        }
    } else if (direction == "gauche") {
        for (let y = 0; y<mouvementCase.length; y++) {
            for (let x = 0; x < mouvementCase[y].length; x++) {
                if (mouvementCase[y][x] != 0) {
                    listeCaseMouvement[y][x].targetX = -mouvementCase[y][x];
                    listeCaseMouvement[y][x].targetY = 0;
                    listeCaseMouvement[y][x].animation = true;
                }
            }
        }
    }
   

    /*
    //Etape 3:
    let tailleListeX = arrayModif[0].length
    let tailleListeY = arrayModif.length

    for (let y = 0; y < tailleListeY; y++) {
        for (let x = 2; x < tailleListeX+1; x++) {
            if (arrayModif[y][tailleListeX - x] == arrayModif[y][tailleListeX - x + 1] || arrayModif[y][tailleListeX - x + 1] == 0 ) {
                arrayModif[y][tailleListeX - x + 1] += arrayModif[y][tailleListeX - x]
                arrayModif[y].splice(tailleListeX - x, 1);
                arrayModif[y].unshift(0);
            }
        }
    }

    // Etape 4 replacer dans le grille du plateau:
    if (direction == "haut") {
        for (let x = 0; x < nbCaseX; x++) {
            arrayModif[x].reverse()
            for (let y = 0; y < nbCaseY; y++) {
                listeCaseMouvement[y][x].ancienneX = x*tailleCase;
                listeCaseMouvement[y][x].ancienneY = y*tailleCase;
                listeCaseMouvement[y][x].value = arrayModif[x][y];
            }
        }
    } else if (direction == "bas") {
        for (let x = 0; x < nbCaseX; x++) {
            for (let y = 0; y < nbCaseY; y++) {
                listeCaseMouvement[y][x].ancienneX = x*tailleCase;
                listeCaseMouvement[y][x].ancienneY = y*tailleCase;
                listeCaseMouvement[y][x].value = arrayModif[x][y]  // listeCaseMouvement[y][x].value
            }
        }
    } else if (direction == "droite") {
        for (let y = 0; y < nbCaseY; y++) {
            for (let x = 0; x < nbCaseX; x++) {
                listeCaseMouvement[y][x].ancienneX = x*tailleCase;
                listeCaseMouvement[y][x].ancienneY = y*tailleCase;
                listeCaseMouvement[y][x].value = arrayModif[y][x]
            }
        }
    } else if (direction == "gauche") {
        for (let y = 0; y < nbCaseY; y++) {
            arrayModif[y].reverse()
            for (let x = 0; x < nbCaseX; x++) {
                listeCaseMouvement[y][x].ancienneX = x*tailleCase;
                listeCaseMouvement[y][x].ancienneY = y*tailleCase;
                listeCaseMouvement[y][x].value = arrayModif[y][x]
            }
        }
    }
    */
    console.log("test")
    

}



function restartGame() {
    gsap.to(".jeu2048", {
        y: -1000, duration: 0.5, ease: "step", onComplete: function () {
            initGame()
            gsap.to(".jeu2048", { y: 0, duration: 2, ease: "bounce" }); // Retour à la position initiale
            
        }
    });
}





