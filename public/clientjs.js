var socket = io();
var id;
var nom = ""
let indice = 0;
suivre = false;

function suivredirect(){
    suivre = !suivre;
    socket.emit("suivre",suivre);
    document.getElementById("suivre").innerText = suivre ? "Ne plus suivre" : "Suivre";
}

function entrerDansLaPartie(){
    nom = document.getElementById("nom");
    socket.emit('entree',nom.value); //envoie au serveur le nom du joueur entrant
}

function sortirDeLaPartie(){
    socket.emit('sortie', id);
}

function envoyermsg(){
    const messagerecu = document.getElementById('message');
    const message = messagerecu.value;
    console.log("msg envoyé");
    socket.emit('message', message,nom.value);
    messagerecu.value = '';
}

socket.on('entree',data => {
    document.getElementById("players").innerHTML = "";
    for (j of data.joueurs){
        document.getElementById("players").innerHTML += `${j.NOM} ,`;
    }
    id = data.joueur.ID;
});

socket.on('majHex', (data) => {
    console.log(data.ligne);
    console.log(data.colone);
    console.log(data.coul);
    var hexId = `h${data.ligne}${data.colone}`;
    const hexagone = document.getElementById(hexId);
    if (hexagone){
        hexagone.setAttribute("fill", data.coul);
        hexagone.setAttribute("disabled", true);    
    } else {
        console.error(`Hexagone ${hexId} non trouvé`);
    }
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

socket.on('erreur', (message) => {
    alert(message);
});

socket.on("synch", (data) =>{
    console.log(data);
    const historique = data;
    for (let coup of historique) {
        console.log(coup);
        const hexId = `h${coup.Ligne}${coup.Colone}`;
        const hexagone = document.getElementById(hexId);
        if (hexagone) {
            hexagone.setAttribute("fill", coup.Couleur);
        }
    }
});

socket.on("demandercoups",data =>{
    for (h of document.querySelectorAll(".hexagone")){
        h.setAttribute(`fill`,`white`);
    }
    for (c of data){
        const hexId = `h${c.Colone}${c.Ligne}`;
        const hexagone = document.getElementById(hexId);
        hexagone.setAttribute(`fill`,c.Couleur);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const rayon = 20;
    const nbLignes = 11;
    const nbColonnes = 11;
    genereDamier(rayon, nbLignes, nbColonnes);
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
                .attr("stroke","black")
                .attr("id",`h${ligne}${colonne}`)
                .attr("ligne", ligne)
                .attr("fill", "#ffffff")
                .attr("colonne", colonne)
                .on("click", function(d) {
                    console.log(d3.select(this).attr('id'));
                    const hligne = this.getAttribute("ligne");
                    const hcolonne = this.getAttribute("colonne")
                    socket.emit('jouer', {l : hligne, c : hcolonne, j : id})//ici je dois renvoyer le nom du joueur qui a cliqué mais jsp comment faire
            });
            }
    }
}