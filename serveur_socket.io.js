const express = require('express');
const { lutimesSync } = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new require("socket.io")(server);
server.listen(8888, () => {console.log('Le serveur écoute sur le port 8888');});
app.use(express.static('public'));
var joueurs=[];
var pseudos = [];
var droit=0;
var id = 0;
var couleurs =["red", "yellow", "pink", "blue", "green", "orange", "purple"]
var plateau = initialiserGrille(11,11);

function initialiserGrille(nbLignes, nbColonnes) {
    var grille = [];
    for (var i = 0; i < nbLignes; i++) {
        grille[i] = [];
        for (var j = 0; j < nbColonnes; j++) {
            grille[i][j] = -1;
        }
    }
    return grille;
}

app.get('/', (request, response) => {
    response.sendFile('client_socket.io.html', {root: __dirname});
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('entree',nom => {
        if(joueurs.length<2 && !(pseudos.includes(nom))){
            console.log(nom ,"est entré dans la partie");
            joueur = {NOM : nom, ID : id, couleur: couleurs.pop()};
            joueurs.push(joueur);
            pseudos.push(nom)
            id++;
            console.log(joueurs);
            socket.emit('entree',{joueurs,joueur});// recoit le nom du joueur entrant et verfie si il est eligible
        } else {
            console.log("La partie est pleine ou le nom est déjà pris");
            token=0; //le token va nous servir à qq chose quand les 2 joueurs auront rejoint la partie
            console.log("token a 0");
        }
    });
    socket.on('jouer', (data) => {
        if(data.j.ID != droit){
            console.log("pas ton tour");
            return;
        }
        let li = data.l;
        let co = data.c;
        console.log(li);
        console.log(co);
        if (plateau[li][co] == -1) { //case libre
            plateau[li][co] = data.j.ID;
            const c = data.j.couleur
            console.log(c);
            droit = (droit == 0) ? 1 : 0;
            io.emit('majHex', {ligne : li, colone : co, coul : c });

        } else {
            alert("case déja occupée")
            return;
        }
    });
    socket.on('sortie',id => {
        if(joueurs.includes(id)){
            couleurs.push(id.couleur)
            let index = joueurs.indexOf(id)
            joueurs.slice(index, 1);
            console.log(nom ,"est sorti de la partie");
            console.log(joueurs);
            io.emit('sortie',joueurs);
        }
    });

    socket.on('message', (msg,nom) => {
        console.log("msg recu");
        io.emit('message', { nom:nom, message:msg });
    });

    socket.on('couleur',(couleur,nom) => {
        console.log("un joueur a selectionné sa couleur");
        let index=joueurs.indexOf(nom);
        joueurs[index].couleur=couleur;
        io.emit('couleurChoisie',(couleur,joueur))
    });

    socket.on("rejouer" ,data => {
        plateau = initialiserGrille(data.nbLignes, data.nbColonnes);
    });
});

