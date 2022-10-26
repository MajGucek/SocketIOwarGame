const url = window.location.origin
let socket = io.connect(url);
const draw = document.getElementById("draw");
let amPlayer1;
let myTurn;
let Deck;


socket.on("game.begin", (isPlayer1, deck) => {
  // is opponent exprected to be false if refreshed first
  Deck = deck;
  document.getElementById("joined").innerHTML = "Opponent Joined";
  amPlayer1 = isPlayer1;
  myTurn = isPlayer1;



  switchTurns();

  console.log(Deck);



});


draw.onclick = () => {
  socket.emit("move", amPlayer1, Deck);
  $("#draw").attr("disabled", true);
}

socket.on("switchTurn", () => {
  myTurn = !myTurn;
  switchTurns();
});
socket.on("winORlose", (iWin, heWins, x) => {
  if (iWin == false && heWins == true) {
    console.log("You win", x);
  } else if (iWin == true && heWins == false) {
    console.log("You lose", x);
  }
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






