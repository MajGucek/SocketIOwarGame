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




const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];


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


let i = 1;
let x = 0;


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
        
        i++;

        if ((i + 1) % 2 == 0) {
            checkWin(isPlayer1, PlayerDeck);
            x++;
        }
        // switch round
        socket.emit("switchTurn"); //second players
        getOpponent(socket).emit("switchTurn"); // first player
    });


    function checkWin(isPlayer1, PlayerDeck) {
        if (isPlayer1 == true) {
            // player 1
            if (PlayerDeck[x] > player2deck[x]) {
                console.log("player 1 wins");
                getOpponent(socket).emit("Win"); // player 1
                socket.emit("Lose"); // player 2

            } else if (PlayerDeck[x] < player2deck[x]) {
                console.log("player 2 wins");
                getOpponent(socket).emit("Lose"); // player 1
                socket.emit("Win"); // player 2
            }
        } else {
            // player 2
            if (PlayerDeck[x] > player1deck[x]) {
                console.log("player 2 wins");
                getOpponent(socket).emit("Lose"); // player 1
                socket.emit("Win"); // player 2

            } else if (PlayerDeck[x] < player1deck[x]) {
                console.log("player 1 wins");
                getOpponent(socket).emit("Win"); // player 1
                socket.emit("Lose"); // player 2
            }
        }
    }

    
});
