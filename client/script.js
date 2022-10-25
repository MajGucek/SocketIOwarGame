const url = window.location.origin
let socket = io.connect(url);
const draw = document.getElementById("draw");

let myTurn = false;
let playerDeck;
let x = 0;
let amPlayer1;

socket.on("game.begin", (isOpponent, deck) => {
  // is opponent exprected to be false if refreshed first
  playerDeck = deck;
  document.getElementById("joined").innerHTML = "Opponent Joined";
  amPlayer1 = isOpponent;



  if (isOpponent == false) {
    myTurn = true;
    renderTurn(); 
  } else {
    myTurn = false;
    renderTurn();
  }


  



});
function renderTurn() {
  if (myTurn == false) {
    $("#messages").text("Your opponent's turn");
    $("#draw").attr("disabled", true);
  } else {
    $("#messages").text("Your turn");
    $("#draw").removeAttr("disabled");
  }
}





function onDraw() {
  console.log("draw");
  socket.emit("compare.deck", playerDeck[x], amPlayer1, x);
  myTurn = false;
  renderTurns();
}

socket.on("win", () => {
  console.log("WIN")
})




