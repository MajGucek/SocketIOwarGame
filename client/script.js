const url = window.location.origin
let socket = io.connect(url);
const draw = document.getElementById("draw");
let amPlayer1;
let myTurn;
let Deck;
let x = 0;

socket.on("game.begin", (isPlayer1, deck) => {
  // is opponent exprected to be false if refreshed first
  Deck = deck;
  document.getElementById("joined").innerHTML = "Opponent Joined";
  amPlayer1 = isPlayer1;
  myTurn = isPlayer1;



  switchTurns();





});


draw.onclick = () => {
  socket.emit("move", isPlayer1, Deck, x);
  $("#draw").attr("disabled", true);
  x++;
}

socket.on("switchTurn", () => {
  myTurn = !myTurn;
  switchTurns();
});





function switchTurns() {
if (myTurn == true) {
  renderMyTurn();
} else {
  renderOpponentTurn();
}
}


function renderMyTurn() {
  $("#messages").text("Your Turn");
  $("#draw").removeAttr("disabled");
}

function renderOpponentTurn() {
  $("#messages").text("Your opponents turn");
  $("#draw").attr("disabled", true);
}

socket.on("clientdisconnect", (id) => {
  console.log(`${id} disconnected!`);
  $("#draw").attr("disabled", true);
  $("#messages").text("Your opponent left");
  window.location.reload(); 
});






