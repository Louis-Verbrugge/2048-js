

const HEIGHT = 800;
const WIDTH = 800;

//cadre de jeu:
let debutPlateauX = 100;
let debutPlateauY = 100;
let largeurPlateau = WIDTH-100-debutPlateauX;
let hauteurPlateau = HEIGHT-100-debutPlateauY;

let nbCaseX = 4;
let nbCaseY = 4;


window.onload = function() {

    board = document.getElementById("board")
    board.height = HEIGHT;
    board.width = WIDTH;
    context = board.getContext("2d");
    requestAnimationFrame(game)

}

function game() {
    context.fillStyle = "red"
    context.fillRect(100, 100, 100, 100)
    affichePlateau()

}

function affichePlateau() {
    //affiche les pièces:
    context.fillStyle = "red";
    for (let y = 0; y<nbCaseY; y++) {
        for (let x = 0; x<nbCaseX; x++) {
            context.fillRect(debutPlateauX+(largeurPlateau/nbCaseX)*x, debutPlateauY+(hauteurPlateau/nbCaseY)*y, largeurPlateau/nbCaseX, hauteurPlateau/nbCaseY);
        }
    }
    
    //affiche bordure:
    context.strokeStyle  = "yellow";
    context.lineWidth = 4;
    for (let y = 0; y<nbCaseY; y++) {
        for (let x = 0; x<nbCaseX; x++) {
            context.strokeRect(debutPlateauX+(largeurPlateau/nbCaseX)*x, debutPlateauY+(hauteurPlateau/nbCaseY)*y, largeurPlateau/nbCaseX, hauteurPlateau/nbCaseY);
        }
    }
    
}


//// test:
/*
gsap.set("#board", { opacity: 0, x:500, y:50 })
gsap.to("#board", { opacity: 1, y: 600, x: -800, rotation: 360, duration: 3, ease: "bounce", onComplete: function() {
    gsap.to("#board", { opacity: 0.2, x:500, y:50, duration: 3, rotation: -360, ease: "bounce" }); // Retour à la position initiale
} });
*/