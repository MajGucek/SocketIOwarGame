const http = require("http"),
  express = require("express"),
  app = express(),
  socketIo = require("socket.io");
const fs = require("fs");


const server = http.Server(app).listen(3000);
const io = socketIo(server);
const clients = {};

app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
    // res.sendFile("index.html", { root: __dirname + "/../client" });
    const stream = fs.createReadStream(__dirname + "/../client/index.html");
    stream.pipe(res);
})



const addClient = socket => {
    console.log("New client", socket.id);
    clients[socket.id] = socket;
    
};



const removeClient = socket => {
    console.log("Client disconnected", socket.id);
    delete clients[socket.id];
};

io.on("connection", socket => {
    let id = socket.id;

  
    addClient(socket);

  
    socket.on("mousemove", data => {
      data.id = id;
      socket.broadcast.emit("moving", data);
    });
  
    socket.on("disconnect", () => {
      removeClient(socket);
      socket.broadcast.emit("clientdisconnect", id);
    });
});









const H2 = {value: 2, name: "Srčeva 2"};
const H3 = {value: 3, name: "Srčeva 3"};
const H4 = {value: 4, name: "Srčeva 4"};
const H5 = {value: 5, name: "Srčeva 5"};
const H6 = {value: 6, name: "Srčeva 6"};
const H7 = {value: 7, name: "Srčeva 7"};
const H8 = {value: 8, name: "Srčeva 8"};
const H9 = {value: 9, name: "Srčeva 9"};
const H10 = {value: 10, name: "Srčeva 10"};
const HJ = {value: 11, name: "Srčev Fant"};
const HQ = {value: 12, name: "Srčeva Kraljica"};
const HK = {value: 13, name: "Srčev Kralj"};
const HA = {value: 14, name: "Srčev As"};

const S2 = {value: 2, name: "Pikova 2"};
const S3 = {value: 3, name: "Pikova 3"};
const S4 = {value: 4, name: "Pikova 4"};
const S5 = {value: 5, name: "Pikova 5"};
const S6 = {value: 6, name: "Pikova 6"};
const S7 = {value: 7, name: "Pikova 7"};
const S8 = {value: 8, name: "Pikova 8"};
const S9 = {value: 9, name: "Pikova 9"};
const S10 = {value: 10, name: "Pikova 10"};
const SJ = {value: 11, name: "Pikov Fant"};
const SQ = {value: 12, name: "Pikova Kraljica"};
const SK = {value: 13, name: "Pikov Kralj"};
const SA = {value: 14, name: "Pikov As"};

const D2 = {value: 2, name: "Karina 2"};
const D3 = {value: 3, name: "Karina 3"};
const D4 = {value: 4, name: "Karina 4"};
const D5 = {value: 5, name: "Karina 5"};
const D6 = {value: 6, name: "Karina 6"};
const D7 = {value: 7, name: "Karina 7"};
const D8 = {value: 8, name: "Karina 8"};
const D9 = {value: 9, name: "Karina 9"};
const D10 = {value: 10, name: "Karina 10"};
const DJ = {value: 11, name: "Karov Fant"};
const DQ = {value: 12, name: "Karina Kraljica"};
const DK = {value: 13, name: "Karov Kralj"};
const DA = {value: 14, name: "Karov As"};

const C2 = {value: 2, name: "Križeva 2"};
const C3 = {value: 3, name: "Križeva 3"};
const C4 = {value: 4, name: "Križeva 4"};
const C5 = {value: 5, name: "Križeva 5"};
const C6 = {value: 6, name: "Križeva 6"};
const C7 = {value: 7, name: "Križeva 7"};
const C8 = {value: 8, name: "Križeva 8"};
const C9 = {value: 9, name: "Križeva 9"};
const C10 = {value: 10, name: "Križeva 10"};
const CJ = {value: 11, name: "Križov Fant"};
const CQ = {value: 12, name: "Križeva Kraljica"};
const CK = {value: 13, name: "Križov Kralj"};
const CA = {value: 14, name: "Križov As"};





const deck = [
    H2,
    H3,
    H4,
    H5,
    H6,
    H7,
    H8,
    H9,
    H10,
    HJ,
    HQ,
    HK,
    HA,

    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    SJ,
    SQ,
    SK,
    SA,

    D2,
    D3,
    D4,
    D5,
    D6,
    D7,
    D8,
    D9,
    D10,
    DJ,
    DQ,
    DK,
    DA,

    C2,
    C3,
    C4,
    C5,
    C6,
    C7,
    C8,
    C9,
    C10,
    CJ,
    CQ,
    CK,
    CA,
];


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}


const middleIndex = Math.ceil(deck.length / 2);

let isPlayer1 = true;
// turn counter
let i = 1;
// array number to compare to
let n = 0;




let MixedDeck, player1deck, player2deck;



function sendName(Socket, Name) {
    getOpponent(Socket).emit("OpponentsName", (Name));
}
function splitDeck() {
    MixedDeck = shuffle(deck);
    player1deck = MixedDeck.slice().splice(0, middleIndex);
    player2deck = MixedDeck.slice().splice(-middleIndex);
}


var players = {},
    unmatched;

function joinGame(socket) {
    players[socket.id] = {
        opponent: unmatched,
        socket: socket,
    };
    if (unmatched) {
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}



function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    } else {
        return players[players[socket.id].opponent].socket;
    }

    
}


io.on("connection", function(socket) {
    let hasSubmittedName = 0;
    
    joinGame(socket);

    if (getOpponent(socket)) {
        
        getOpponent(socket).emit("OpponentFound");
        socket.emit("OpponentFound");
    }





    splitDeck();

    let pass = Math.floor(Math.random() * 10000);


    if (getOpponent(socket)) {
        console.log(pass);
        getOpponent(socket).emit("password", pass); // p1
        socket.emit("PasswordReq"); // p2
    }


    socket.on("Name", (name) => {
        sendName(socket, name);
        hasSubmittedName++;
    });

    

    socket.on("PasswordRes", (PassToCompare) => {
        if (pass == PassToCompare) {
            console.log("Password Correct");
            if (getOpponent(socket)) {
                socket.emit("game.begin", !isPlayer1, player2deck); // second player
                getOpponent(socket).emit("game.begin", isPlayer1, player1deck); //first player
            }
        } else {
            console.log("Incorrect Password");  
        }
    });
    

        



    

    
    socket.on("move", (isPlayer1, PlayerDeck) => {
        if (player1deck.length == 0) {
            getOpponent(socket).emit("GameOverLost");
            socket.emit("GameOverWon");
        }
        if (player2deck.length == 0) {
            getOpponent(socket).emit("GameOverWon");
            socket.emit("GameOverLost");
        }

        i++;

        if ((i + 1) % 2 == 0) {
            checkWin(isPlayer1, PlayerDeck);
        }

        socket.emit("switchTurn");
        getOpponent(socket).emit("switchTurn");
    });


    function checkWin(isPlayer1, PlayerDeck) {
        if (isPlayer1 == true) {
            if (PlayerDeck[n].value == player2deck[n].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                // WAR
                
                if (PlayerDeck[4].value > player2deck[4].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                    console.log("Player 1 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouWonToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouLostToo", player1deck[4]);
                    
                    for (let j = 0; j < 5; j++) {
                        player1deck.push(player1deck.shift());
                    }
                    for (let j = 0; j < 5; j++) {
                        player1deck.push(player2deck[j]);
                    } 
                    
                    player2deck.splice(0, 5);

                    getOpponent(socket).emit("YouWinWar", player1deck); // player 1
                    socket.emit("YouLoseWar", player2deck); // player 2

                } else if (PlayerDeck[4].value < player2deck[4].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                    console.log("Player 2 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouLostToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouWonToo", player1deck[4]);
                    
                    for (let j = 0; j < 5; j++) {
                        player2deck.push(player2deck.shift());
                    }
                    for (let j = 0; j < 5; j++) {
                        player2deck.push(player1deck[j]);
                    }

                    player1deck.splice(0, 5);

                    getOpponent(socket).emit("YouLoseWar", player1deck); // player 1
                    socket.emit("YouWinWar", player2deck); // player 2
                }
                
                
                
                // account for an aditional war
            } else if (PlayerDeck[n].value > player2deck[n].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                console.log("player 1 wins");

                getOpponent(socket).emit("OpponentsCardYouWonToo", player2deck[n]);
                socket.emit("OpponentsCardYouLostToo", player1deck[n]);

                // player 1
                player1deck.push(player1deck.shift());
                player1deck.push(player2deck[n]);
                getOpponent(socket).emit("Win", player1deck, player2deck[n]);

                // player 2
                player2deck.splice(n, 1);

                socket.emit("Lose", player2deck, player1deck[n]); 

            } else if (PlayerDeck[n].value < player2deck[n].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                console.log("player 2 wins");

                socket.emit("OpponentsCardYouWonToo", player1deck[n]);
                getOpponent(socket).emit("OpponentsCardYouLostToo", player2deck[n]);

                // player 2
                player2deck.push(player2deck.shift());
                player2deck.push(player1deck[n]);

                socket.emit("Win", player2deck);

                // player 1
                player1deck.splice(n, 1);
                getOpponent(socket).emit("Lose", player1deck);
            }
        
        } else {
            if (PlayerDeck[n].value == player1deck[n].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {
                // WAR
                

                if (PlayerDeck[4].value > player1deck[4].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {
                    console.log("Player 2 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouLostToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouWonToo", player1deck[4]);
                    
                    for (let j = 0; j < 5; j++) {
                        player2deck.push(player2deck.shift());
                    }
                    for (let j = 0; j < 5; j++) {
                        player2deck.push(player1deck[j]);
                    }

                    player1deck.splice(0, 5);

                    getOpponent(socket).emit("YouLoseWar", player1deck); // player 1
                    socket.emit("YouWinWar", player2deck); // player 2

                } else if (PlayerDeck[4].value < player1deck[4].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {
                    console.log("Player 1 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouWonToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouLostToo", player1deck[4]);
                    
                    for (let j = 0; j < 5; j++) {
                        player1deck.push(player1deck.shift());
                    }
                    for (let j = 0; j < 5; j++) {
                        player1deck.push(player2deck[j]);
                    }

                    player2deck.splice(0, 5);

                    getOpponent(socket).emit("YouWinWar", player1deck); // player 1
                    socket.emit("YouLoseWar", player2deck); // player 2 
                }


            } else if (PlayerDeck[n].value > player1deck[n].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {

                console.log("player 2 wins");

                // player 1 before deck changes
                socket.emit("OpponentsCardYouWonToo", player1deck[n]);

                // player 2 before deck changes
                getOpponent(socket).emit("OpponentsCardYouLostToo", player2deck[n]);

                // player 2
                player2deck.push(player2deck.shift());
                player2deck.push(player1deck[n]);

                socket.emit("Win", player2deck);

                // player 1
                player1deck.splice(n, 1);
                getOpponent(socket).emit("Lose", player1deck); 

                 

            } else if (PlayerDeck[n].value < player1deck[n].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {

                console.log("player 1 wins");

                // player 1 before deck changes
                getOpponent(socket).emit("OpponentsCardYouWonToo", player2deck[n]);

                // player 2 before deck changes
                socket.emit("OpponentsCardYouLostToo", player1deck[n]);

                // player 1
                player1deck.push(player1deck.shift());
                player1deck.push(player2deck[n]);
                getOpponent(socket).emit("Win", player1deck); 

                // player 2
                player2deck.splice(n, 1);
                socket.emit("Lose", player2deck); 
            }
        }
    }

    
});
