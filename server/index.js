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
let player1deck = deck.splice(0, 5);
let player2deck = deck.splice(0, 5);


let isOpponent = false;





io.on("connection", function(socket) {
    joinGame(socket);



if (getOpponent(socket)) {
    socket.emit("game.begin", !isOpponent, player2deck); // second player
    getOpponent(socket).emit("game.begin", isOpponent, player1deck); //first player
}

    socket.on("switchTurn", () => {
        if (getOpponent(socket)) {
            socket.emit("switchedTurn", isOpponent); // first player
            getOpponent(socket).emit("switchedTurn", !isOpponent); //second player 
        }
    });

    socket.on("compare.deck", (playersDeck, isPlayer1, card) => {
        if (isPlayer1 == true) {
            socket.emit("win");
        } else { // this else is for IF in line 104
            
        }
    });








socket.on("disconnect", () => {
    if (getOpponent(socket)) {
        getOpponent(socket).emit("opponent.left");
    }
});
});
  