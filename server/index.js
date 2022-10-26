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




const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let CopyDeck = deck;
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
shuffle(CopyDeck);


let player1deck = CopyDeck.splice(0, 5);
let player2deck = CopyDeck.splice(0, 5);


let isPlayer1 = true;

let isPlayer1turn = false;

let player1wins = false;
let player2wins = false;
let player1turn = 0;
let player2turn = 0;
let x = 0;

io.on("connection", function(socket) {
    joinGame(socket);
    x = 0;



if (getOpponent(socket)) {
    socket.emit("game.begin", !isPlayer1, player2deck); // second player
    getOpponent(socket).emit("game.begin", isPlayer1, player1deck); //first player
}

    
    socket.on("move", (isPlayer1, deck) => {
        if (isPlayer1 == true) {
           if (deck[x] > player2deck[x]) {
                player1wins = true;
                player2wins = false;
           } else {
               player1wins = false;
               player2wins = true;
           }
        } else if (isPlayer1 == false) {
            if (deck[x] > player1deck[x]) {
                player1wins = false;
                player2wins = true;
            } else {
                player1wins = true;
                player2wins = false;
            }
        }


        if (getOpponent(socket)) {
            socket.emit("switchTurn"); //second player
            socket.emit("winORlose", player2wins, player1wins, x);
            console.log(player1wins, player2wins);
            
            getOpponent(socket).emit("switchTurn"); // first player
            getOpponent(socket).emit("winORlose", player1wins, player2wins, x);
        }
        x++;
    });
    









});
  