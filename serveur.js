const express = require('express');
const { lutimesSync } = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new require("socket.io")(server);
server.listen(8888, () => {console.log('Le serveur écoute sur le port 8888');});
app.use(express.static('public'));
var joueurs=[];
let spectateurs=[];
var pseudos = [];
var droit=0;
var id = 0;
var couleurs =["red", "yellow", "pink", "blue", "green", "orange", "purple"]
var plateau = initialiserGrille(11,11);
let historique=[];
let utilisateur={};

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
    response.sendFile('clienthtml.html', {root: __dirname});
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');
    utilisateur[socket.id]={role : "spectateur", suivre : false};

    socket.on('entree',nom => {
        if(joueurs.length<2 && !(pseudos.includes(nom))){
            console.log(nom ,"est entré dans la partie");
            let joueur = {NOM : nom, ID : id, couleur: couleurs.pop()};
            joueurs.push(joueur);
            pseudos.push(nom)
            id++;
            console.log(joueurs);
            utilisateur[socket.id].role = "joueur";
            utilisateur[socket.id].suivre = null;
            socket.emit('entree',{joueurs,joueur});// recoit le nom du joueur entrant et verfie si il est eligible
        } else if (joueurs.length>=2 && !spectateurs.includes(socket.id)){
            spectateurs.push(socket.id);
            socket.emit("synch",historique);
        } else {
            console.log("Le nom est déjà pris");
            socket.emit('erreur', "Nom déjà selectionné !");
            token=0; //le token va nous servir à qq chose quand les 2 joueurs auront rejoint la partie
            console.log("token a 0");
            return;
        }
    });

    socket.on("coupsdemander",(index) => {
        let etat=[]
        for (let i =0;i<=index;i++){
            etat.push(historique[i]);
        }
        socket.emit("coupsdemander", etat);
    });

    socket.on("suivre",(data) => {
        if(utilisateur[socket.id].role=="spectateur"){
            utilisateur[socket.id].suivre=data;
            console.log(utilisateur[socket.id]);
            socket.emit("synch",historique);
        }
    });

    socket.on('jouer', (data) => {
        if (!data) {
            console.log("Données invalides :", data);
            socket.emit('erreur', "Données invalides!");
            return;
        }
        idj=data.j
        console.log(idj)
        console.log(droit)
        if(idj != droit){
            console.log("pas ton tour");
            return;
        }
        let li = data.l;
        let co = data.c;
        console.log(li);
        console.log(co);
        if (plateau[li][co] == -1) { //case libre
            plateau[li][co] = data.j.ID;
            const c = couleurs[idj];
            historique.push({Colone : co, Ligne : li, Couleur : c});
            console.log(c);
            droit = (droit == 0) ? 1 : 0;
            Object.entries(utilisateur).forEach(([id,userData]) => {
                if(userData.role=== "joueur" || (userData.role === "spectateur" && userData.suivre)){
                    io.to(id).emit('majHex', {ligne : li, colone : co, coul : c });
                }
            });
        } else {
            console.log("Case déjà occupée");
            socket.emit('erreur', "La case est déjà occupée !");
            return;
        }
    });

    socket.on('sortie',id => {
        console.log(id)
        const idjoueur=joueurs.findIndex(j => j.ID ===id);
        if(idjoueur!=-1){
            const p=joueurs[idjoueur];
            joueurs.slice(idjoueur, 1);
            console.log(p.NOM ,"est sorti de la partie");
            console.log(joueurs);
            io.emit('sortie',joueurs);
        } else {
            console.log("id non retrouvé");
            socket.emit('erreur', "id du joueur inconnu!");
            return;
        }
    });

    socket.on("specsuivre", (maj) => {
        Object.entries(utilisateur).forEach(([id,utilisateur]) => {
            if(utilsiateur.role=== "spectateur" && utilisateur.suivre){
                io.to(id).emit('majHex', {ligne : maj.Ligne, colone : maj.Colone, coul : maj.Couleur });
            }
        });
    });

    socket.on('message', (msg,nom) => {
        if (!msg){
            console.log("MEssage non valide");
            socket.emit('erreur', "DOnnées du message non valides!");
            return;
        } else {
            console.log("msg recu");
            io.emit('message', { nom:nom, message:msg });
        }
    });

    socket.on("rejouer" , (data) => {
        plateau = initialiserGrille(data.nbLignes, data.nbColonnes);
    });
});

