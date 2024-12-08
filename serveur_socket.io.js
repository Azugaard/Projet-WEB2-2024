const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new require("socket.io")(server);
server.listen(8888, () => {console.log('Le serveur écoute sur le port 8888');});
app.use(express.static('public'));
var joueurs=[];
var token=-1;
var droit=0;
var id = 0;

app.get('/', (request, response) => {
    response.sendFile('client.html', {root: __dirname});
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('entree',nom => {
        if(joueurs.length<2 && !(joueurs.includes(nom))){
            console.log(nom ,"est entré dans la partie");
            joueurs.push({NOM : nom, ID : id, couleur:""});
            id++;
            console.log(joueurs);
            io.emit('entree',joueurs);// recoit le nom du joueur entrant et verfie si il est eligible
        } else {
            console.log("La partie est pleine ou le nom est déjà pris");
            token=0; //le token va nous servir à qq chose quand les 2 joueurs auront rejoint la partie
            console.log("token a 0");
        }
    });
    socket.on('jouer', (ligne, colonne, nom) => {
        if(joueurs[droit].NOM!=nom){
            alert("pas ton tour");
            return;
        }
        if (grille[ligne][colonne] == 0) { //case libre
            var j=joueurs.indexOf(nom)
            grille[ligne][colonne] = j;
            socket.emit('majGrille', (ligne, colonne, j ));
            droit==0?droit=1:0;
        } else {
            alert("case déja occupée")
            return;
        }
    });
    socket.on('sortie',nom => {
        if(joueurs.includes(nom)){
            let index=joueurs.indexOf(nom);
            if(index!=-1){
                joueurs.splice(index,1);
            }
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
});