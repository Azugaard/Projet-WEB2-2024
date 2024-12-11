var socket = io();
var id;
var nom = ""



function entrerDansLaPartie(){
    nom = document.getElementById("nom");
    socket.emit('entree',nom.value); //envoie au serveur le nom du joueur entrant
}

function sortirDeLaPartie(){
socket.emit('sortie',nom.value);
}

function envoyermsg(){
const messagerecu = document.getElementById('message');
const message = messagerecu.value;
console.log("msg envoyé");
socket.emit('message', message,nom.value);
messagerecu.value = '';
}

socket.on('entree',data => {
document.getElementById("players").innerHTML=data;
id = data.joueur;
});

socket.on('majGrille', (ligne, colonne, nom) => {
    //faut update les hexagones, les couleurs
});

socket.on('sortie',data => {
console.log(joueurs.length);
if(!(joueurs.length==2)){
    token=-1;
    console.log("token a -1");
}// a modifier jme souviens plus trop quoi modifier dsl je demanderai à pompidor vendredi matin
document.getElementById("players").innerHTML=data;
});//affiche la liste des joueurs quand il recoit un signal de sortie

socket.on('message',data => {
const li = document.createElement('li');
li.textContent = data.nom +' : '+ data.message;
document.getElementById('listemsg').appendChild(li);
});

document.getElementById('selection').addEventListener('click', function() {
socket.emit('couleur', (this.value,nom));
});

socket.on('couleurChoisie', data => { //recoit la couleur choisie par le joueur et son nom
  // A REMPLIR je dois assigner a l'hexagone du joueur la couleur que j'ai recu
});

function creeHexagone(rayon) {
    var points = new Array();
    for (var i = 0; i < 6; ++i) {
        var angle = i * Math.PI / 3;
        var x = Math.sin(angle) * rayon;
        var y = -Math.cos(angle) * rayon;
        console.log("x="+Math.round(x*100)/100+" y="+Math.round(y*100)/100);
        points.push([Math.round(x*100)/100, Math.round(y*100)/100]);
    }
    return points;
}

function genereDamier(rayon, nbLignes, nbColonnes) {
    distance =  rayon - (Math.sin(1 * Math.PI / 3) * rayon);  // plus grande distance entre l'hexagone et le cercle circonscrit
    d3.select("#damier").append("svg").attr("width", nbColonnes*(rayon*2+distance)).attr("height", nbLignes*(rayon+distance*2));
    var hexagone = creeHexagone(rayon);
    var grille=initialiserGrille(nbLignes,nbColonnes);
    for (var ligne=0; ligne < nbLignes; ligne++) {
        for (var colonne=0; colonne < nbColonnes; colonne++) {
            var d = "";
            var x, y;
            for (h in hexagone) {
                x = hexagone[h][0]+(rayon-distance)*(2+2*colonne);
                y = distance*2 + hexagone[h][1]+(rayon-distance*2)*(1+2*ligne);
                let angle=1*Math.PI/3;
                x+=ligne*(Math.sin(angle)*rayon);
                if(h==0){
                    d="M"+x+" "+y;
                } else {
                    d+=" L"+x+" "+y;
                }
            }
            d +=" Z";
            console.log(d);
            d3.select("svg")
                .append("path")
                .attr("d", d)
                .attr("stroke-width",1) // car un id doit commencer par une lettre
                .attr("stroke","white")
                .attr("id","h"+(ligne*nbLignes+colonne))
                .on("click", function(d) {
                    console.log(d3.select(this).attr('id'));
                    socket.emit('jouer', (this.ligne, this.colonne, id.ID))//ici je dois renvoyer le nom du joueur qui a cliqué mais jsp comment faire
            });
            }
    }
}