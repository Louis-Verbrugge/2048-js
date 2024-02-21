

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
let largeurPlateau = WIDTH - debutPlateauX;
let hauteurPlateau = HEIGHT - tailleBordure - debutPlateauY;

//plateau de jeu:
let plateau;
let listeCaseMouvement = [
    [{ valeurAnnimation: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }],
    [{ value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }],
    [{ value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }],
    [{ value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }, { value: 0, animation: false, targetX: 0, targetY: 0 }]
];
let creationNewCase = false;
let direction;

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
        direction = "haut";
        deplacement = true;

    } else if (event.key == "q") {
        direction = "gauche";
        deplacement = true;

    } else if (event.key == "s") {
        direction = "bas";
        deplacement = true;

    } else if (event.key == "d") {
        direction = "droite";
        deplacement = true;
    }
    if (deplacement) {
        if (testSiAnnimationEnCours()) {
            alert("annimation en cours, veuillez attendre")
        }
        deplacementCase(direction);
        annimationCase();      // avec annimation
    }

}

function initGame() {

    listeCaseMouvement = []
    for (let y = 0; y < nbCaseY; y++) {
        listeCaseMouvement.push([])
        for (let x = 0; x < nbCaseX; x++) {
            listeCaseMouvement[y].push({ newValue: 0, value: 0, animation: false, x: x * tailleCase, y: y * tailleCase, addition : false });
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
    //ajouterNouvelleCase();
    //ajouterNouvelleCase();
    listeCaseMouvement[1][1].value = 16;
    listeCaseMouvement[2][1].value = 16;
    listeCaseMouvement[3][1].value = 2;    



    affichePlateau();

}

function game() {


    if (!finGame()) {
        requestAnimationFrame(game)
    }

    if (creationNewCase) {
        mettreAjourListe();
        ajouterNouvelleCase();
        creationNewCase = false;
        affichePlateau();
        //maintenant je dois remettre les information dans la grille pour etre pret pour le nouveau mouvement

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


function annimationCase() {
    

    listeCaseMouvement.forEach(function (element) {
        
        element.forEach(function (elem) {
            if (elem.animation) {

                gsap.fromTo(elem, { x: elem.x, y: elem.y }, {
                    x: elem.x + elem.targetX, y: elem.y + elem.targetY, duration: 0.4,
                    onUpdate: function () {
                        affichePlateau();
                    }, onComplete: () => {
                        // on remet les valeurs à 0:
                        listeCaseMouvement[(elem.y / tailleCase)][(elem.x / tailleCase)].newValue = elem.value;
                        
                        //listeCaseMouvement[(elem.y / tailleCase)][(elem.x / tailleCase)].newValue = elem.value;
                        
                        console.log((elem.y / tailleCase) - (elem.targetY / tailleCase), (elem.x / tailleCase) - (elem.targetX / tailleCase))
                        listeCaseMouvement[(elem.y / tailleCase) - (elem.targetY / tailleCase)][(elem.x / tailleCase) - (elem.targetX / tailleCase)].animation = false;
                        elem.targetY = 0;
                        elem.targetX = 0;
                        creationNewCase = true;
                    }
                })


            }
        })
    })

}


function testSiAnnimationEnCours() {
    let annimationEnCours = false;
    listeCaseMouvement.forEach(function (element) {
        element.forEach(function (elem) {
            if (elem.animation) {
                annimationEnCours = true;
            }
        })
    })
    return annimationEnCours;

}

function mettreAjourListe() {
    listeCaseMouvement.forEach(function (element, indexY) {
        element.forEach(function (elem, indexX) {
           
            if (elem.addition) {
                elem.value = elem.newValue*2;
            }else{
                elem.value = elem.newValue;
            }
            //elem.value = elem.newValue;

            elem.newValue = 0;
            elem.y = indexY * tailleCase;
            elem.x = indexX * tailleCase;
        })
    })




}

function affichePlateau() {

    context.fillStyle = "black";
    context.clearRect(0, 0, WIDTH, HEIGHT);

    listeCaseMouvement.forEach(function (element) {

        element.forEach(function (elem) {

            if (elem.value != 0) {
                //affiche carre:
                context.fillStyle = couleurCase[elem.value];
                context.fillRect(elem.x, elem.y, largeurPlateau / nbCaseX, hauteurPlateau / nbCaseY);

                //affiche texte:
                context.font = tailleChiffre + "px verdana";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "#776e65";
                context.fillText(elem.value, elem.x + tailleCase / 2, elem.y + tailleCase / 2);
            }
        })


    });

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
        valeurNewCase = 4;
    } else {
        valeurNewCase = 2;
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
            for (let y = 1; y < nbCaseY + 1; y++) {
                arrayModif[x].push(listeCaseMouvement[nbCaseY - y][x].value);


            }
        }
    } else if (direction == "droite") {
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
                arrayModif[y].push(listeCaseMouvement[y][nbCaseX - x].value)
            }
        }
    }

    //Etape 2.2:
    //on supprime les 0:
    let mouvementCase = [];
    let nb0aSupprimer = 0;
    for (let y = 0; y < nbCaseY; y++) {
        mouvementCase.push([]);
        for (let x = 1; x < nbCaseX + 1; x++) {

            if (arrayModif[y][nbCaseX - x] == 0) {
                arrayModif[y].splice(nbCaseX - x, 1);
                nb0aSupprimer++;
            }
            else {
                mouvementCase[y].push(nb0aSupprimer * tailleCase)
            }
        }
        nb0aSupprimer = 0;
    }

    //Etape 2.3:
    //on additionne les chiffres si c'est possible:

    console.log("FALITY !!!")
    let nbCaseListeX;
    let additionCase = [];
    nb0aSupprimer = 1;
    for (let y = 0; y < mouvementCase.length; y++) {
        nbCaseListeX = mouvementCase[y].length;
        additionCase.push([])
        for (let x = 2; x < nbCaseListeX+1 ; x++) {

            
            if (arrayModif[y][nbCaseListeX - x] == arrayModif[y][nbCaseListeX - x + 1] || arrayModif[y][nbCaseListeX - x + 1] == 0) {

                mouvementCase[y].reverse();
                mouvementCase[y][nbCaseListeX - x] += tailleCase*nb0aSupprimer;
                mouvementCase[y].reverse();


                if (arrayModif[y][nbCaseListeX - x + 1] == 0) {
                    nb0aSupprimer++;
                    additionCase[y].push(false);
                } else {
                    additionCase[y].push(true);
                    arrayModif[y][nbCaseListeX - x] = 0
                }
            } else {
                additionCase[y].push(false);
            }
        }
        additionCase[y].push(false); // car le dernier chiffre ne peut pas etre additionné
    }


    //Etape 3.2:
    //je replace les chiffres dans la grille:
    if (direction == "droite") {
        for (let y = 0; y < listeCaseMouvement.length; y++) {
            mouvementCase[y].reverse();
            additionCase[y].reverse();
            for (let x = 0; x < listeCaseMouvement[y].length; x++) {
                if (listeCaseMouvement[y][x].value != 0) {
                    listeCaseMouvement[y][x].targetX = mouvementCase[y][0];
                    listeCaseMouvement[y][x].targetY = 0;
                    listeCaseMouvement[y][x].animation = true;
                    listeCaseMouvement[y][x].addition = additionCase[y][0];
                    mouvementCase[y].splice(0, 1);
                    additionCase[y].splice(0, 1);
                }
            }
        }
    } else if (direction == "gauche") {
        for (let y = 0; y < listeCaseMouvement.length; y++) {
            
            for (let x = 0; x < listeCaseMouvement[y].length; x++) {
                if (listeCaseMouvement[y][x].value != 0) {
                    listeCaseMouvement[y][x].targetX = -mouvementCase[y][0];
                    listeCaseMouvement[y][x].targetY = 0;
                    listeCaseMouvement[y][x].animation = true;
                    listeCaseMouvement[y][x].addition = additionCase[y][0];
                    mouvementCase[y].splice(0, 1);
                    additionCase[y].splice(0, 1);
                }
            }
        }
    } else if (direction == "haut") {
        for (let x = 0; x < listeCaseMouvement.length; x++) {
            for (let y = 0; y < listeCaseMouvement[x].length; y++) {
                if (listeCaseMouvement[y][x].value != 0) {
                    listeCaseMouvement[y][x].targetX = 0;
                    listeCaseMouvement[y][x].targetY = -mouvementCase[x][0];
                    listeCaseMouvement[y][x].animation = true;
                    listeCaseMouvement[y][x].addition = additionCase[x][0];
                    mouvementCase[x].splice(0, 1);
                    additionCase[x].splice(0, 1);
                }
            }
        }
    } else if (direction == "bas") {
        for (let y = 0; y < listeCaseMouvement.length; y++) {
            mouvementCase[y].reverse();
            additionCase[y].reverse();

            for (let x = 0; x < listeCaseMouvement[y].length; x++) {

                if (listeCaseMouvement[x][y].value != 0) {
                    listeCaseMouvement[x][y].targetY = mouvementCase[y][0];
                    listeCaseMouvement[x][y].targetX = 0;
                    listeCaseMouvement[x][y].animation = true;
                    listeCaseMouvement[x][y].addition = additionCase[y][0];
                    mouvementCase[y].splice(0, 1);
                    additionCase[y].splice(0, 1);
                }
            }
        }
    }
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

