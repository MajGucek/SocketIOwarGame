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
let player1 = deck.splice(0, 5);
let player2 = deck.splice(0, 5);


let isOpponent = false;





io.on("connection", function(socket) {
    joinGame(socket);



if (getOpponent(socket)) {
    socket.emit("game.begin", player2, !isOpponent); // second player
    getOpponent(socket).emit("game.begin", player1, isOpponent); //first player
}

socket.on("make.move", (data) => {
    if (!getOpponent(socket)) {
        return;
    }

    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
});

socket.on("disconnect", () => {
    if (getOpponent(socket)) {
        getOpponent(socket).emit("opponent.left");
    }
});
});
  