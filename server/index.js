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






var players = {},
    unmatched;

function joinGame(socket) {
    players[socket.id] = {
        opponent: unmatched,
        socket: socket
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

const H2 = {value: 2, name: "Heart 2"};
const H3 = {value: 3, name: "Heart 3"};
const H4 = {value: 4, name: "Heart 4"};
const H5 = {value: 5, name: "Heart 5"};
const H6 = {value: 6, name: "Heart 6"};
const H7 = {value: 7, name: "Heart 7"};
const H8 = {value: 8, name: "Heart 8"};
const H9 = {value: 9, name: "Heart 9"};
const H10 = {value: 10, name: "Heart 10"};
const HJ = {value: 11, name: "Heart Jack"};
const HQ = {value: 12, name: "Heart Queen"};
const HK = {value: 13, name: "Heart King"};
const HA = {value: 14, name: "Heart Ace"};

const S2 = {value: 2, name: "Spade 2"};
const S3 = {value: 3, name: "Spade 3"};
const S4 = {value: 4, name: "Spade 4"};
const S5 = {value: 5, name: "Spade 5"};
const S6 = {value: 6, name: "Spade 6"};
const S7 = {value: 7, name: "Spade 7"};
const S8 = {value: 8, name: "Spade 8"};
const S9 = {value: 9, name: "Spade 9"};
const S10 = {value: 10, name: "Spade 10"};
const SJ = {value: 11, name: "Spade Jack"};
const SQ = {value: 12, name: "Spade Queen"};
const SK = {value: 13, name: "Spade King"};
const SA = {value: 14, name: "Spade Ace"};

const D2 = {value: 2, name: "Diamond 2"};
const D3 = {value: 3, name: "Diamond 3"};
const D4 = {value: 4, name: "Diamond 4"};
const D5 = {value: 5, name: "Diamond 5"};
const D6 = {value: 6, name: "Diamond 6"};
const D7 = {value: 7, name: "Diamond 7"};
const D8 = {value: 8, name: "Diamond 8"};
const D9 = {value: 9, name: "Diamond 9"};
const D10 = {value: 10, name: "Diamond 10"};
const DJ = {value: 11, name: "Diamond Jack"};
const DQ = {value: 12, name: "Diamond Queen"};
const DK = {value: 13, name: "Diamond King"};
const DA = {value: 14, name: "Diamond Ace"};

const C2 = {value: 2, name: "Club 2"};
const C3 = {value: 3, name: "Club 3"};
const C4 = {value: 4, name: "Club 4"};
const C5 = {value: 5, name: "Club 5"};
const C6 = {value: 6, name: "Club 6"};
const C7 = {value: 7, name: "Club 7"};
const C8 = {value: 8, name: "Club 8"};
const C9 = {value: 9, name: "Club 9"};
const C10 = {value: 10, name: "Club 10"};
const CJ = {value: 11, name: "Club Jack"};
const CQ = {value: 12, name: "Club Queen"};
const CK = {value: 13, name: "Club King"};
const CA = {value: 14, name: "Club Ace"};





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

let p1BeforeUpdateCard = undefined;
let p2BeforeUpdateCard = undefined;

io.on("connection", function(socket) {
    joinGame(socket);

    
    let MixedDeck = shuffle(deck);
    let player1deck = MixedDeck.slice().splice(0, middleIndex);
    let player2deck = MixedDeck.slice().splice(-middleIndex);
    



if (getOpponent(socket)) {
    socket.emit("game.begin", !isPlayer1, player2deck); // second player
    getOpponent(socket).emit("game.begin", isPlayer1, player1deck); //first player
}

    
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


        // goofy ahh IF statement, because initial value of i == 1, you have to add +1 to check for even
        if ((i + 1) % 2 == 0) {
            checkWin(isPlayer1, PlayerDeck);
        }
        // switch round
        socket.emit("switchTurn"); //second player
        getOpponent(socket).emit("switchTurn"); // first player
    });


    function checkWin(isPlayer1, PlayerDeck) {
        if (isPlayer1 == true) {
            if (PlayerDeck[n].value == player2deck[n].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                // WAR
                console.log("WAR");
                
                // place additional 3 cards face down
                // place a fourth card face up 
                // compare the fifth card in total
                if (PlayerDeck[4].value > player2deck[4].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                    console.log("Player 1 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouWonToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouLostToo", player1deck[4]);
                    // winner takes 5 cards from opponent
                    // five of his own go to the back
                    // 5 times (use for loop)
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    // 
                    // and five of his opponets go to the back
                    player1deck.push(player2deck[0]);
                    player1deck.push(player2deck[1]);
                    player1deck.push(player2deck[2]);
                    player1deck.push(player2deck[3]);
                    player1deck.push(player2deck[4]);

                    player2deck.splice(0, 5);

                    getOpponent(socket).emit("YouWinWar", player1deck); // player 1
                    socket.emit("YouLoseWar", player2deck); // player 2

                } else if (PlayerDeck[4].value < player2deck[4].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                    console.log("Player 2 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouLostToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouWonToo", player1deck[4]);
                    // 5 times
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    // 
                    
                    player2deck.push(player1deck[0]);
                    player2deck.push(player1deck[1]);
                    player2deck.push(player1deck[2]);
                    player2deck.push(player1deck[3]);
                    player2deck.push(player1deck[4]);

                    player1deck.splice(0, 5);

                    getOpponent(socket).emit("YouLoseWar", player1deck); // player 1
                    socket.emit("YouWinWar", player2deck); // player 2
                }
                
                
                
                // account for an aditional war
            } else if (PlayerDeck[n].value > player2deck[n].value && (player2deck[n].value != undefined || player2deck[n].value != null)) {
                
                console.log("player 1 wins");

                // player 1 before deck changes
                p2BeforeUpdateCard = player2deck[n];
                getOpponent(socket).emit("OpponentsCardYouWonToo", player2deck[n]);
                // player 2 before deck changes
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

                // player 2 before deck changes
                socket.emit("OpponentsCardYouWonToo", player1deck[n]);
                // player 1 before deck changes
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
                console.log("WAR");

                if (PlayerDeck[4].value > player1deck[4].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {
                    console.log("Player 2 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouLostToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouWonToo", player1deck[4]);
                    // winner takes in total 10 cards
                    // five of his own go to the back
                    // and five of his opponets go to the back
                    // 5 times (use for loop)
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    player2deck.push(player2deck.shift());
                    // 

                    player2deck.push(player1deck[0]);
                    player2deck.push(player1deck[1]);
                    player2deck.push(player1deck[2]);
                    player2deck.push(player1deck[3]);
                    player2deck.push(player1deck[4]);

                    player1deck.splice(0, 5);

                    getOpponent(socket).emit("YouLoseWar", player1deck); // player 1
                    socket.emit("YouWinWar", player2deck); // player 2

                } else if (PlayerDeck[4].value < player1deck[4].value && (player1deck[n].value != undefined || player1deck[n].value != null)) {
                    console.log("Player 1 Wins the WAR");

                    getOpponent(socket).emit("OpponentsWarCardYouWonToo", player2deck[4]);
                    socket.emit("OpponentsWarCardYouLostToo", player1deck[4]);
                    // 5 times
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    player1deck.push(player1deck.shift());
                    // 
                    
                    player1deck.push(player2deck[0]);
                    player1deck.push(player2deck[1]);
                    player1deck.push(player2deck[2]);
                    player1deck.push(player2deck[3]);
                    player1deck.push(player2deck[4]);

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
