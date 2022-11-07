const url = window.location.origin
let socket = io.connect(url);
const draw = document.getElementById("draw");
const currentCard = document.getElementById("CurrentCard");
const PossibleWarCard = document.getElementById("WarCard");
let amPlayer1;
let myTurn;
let Deck;
let OpponentsCard;


socket.on("game.begin", (isPlayer1, deck) => {
  // is opponent exprected to be false if refreshed first
  Deck = deck;
  document.getElementById("joined").innerHTML = "Opponent Joined";
  amPlayer1 = isPlayer1;
  myTurn = isPlayer1;

  currentCard.innerHTML = Deck[0].name;
  PossibleWarCard.innerHTML = Deck[4].name;

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

socket.on("OpponentsCardYouWonToo", (Card) => {
  OpponentsCard = Card;
});
socket.on("OpponentsCardYouLostToo", (Card) => {
  OpponentsCard = Card;
})


socket.on("Win", (UpdatedDeck) => {
  console.log("You Win!");
  console.log(Deck[0].name, "Was higher than", OpponentsCard.name);
  // renderWin();
  Deck = UpdatedDeck;
  console.log("Updated deck", Deck);

  currentCard.innerHTML = Deck[0].name;
  PossibleWarCard.innerHTML = Deck[4].name;
})

socket.on("Lose", (UpdatedDeck) => {
  console.log("You Lose!");
  console.log(Deck[0].name, "Was lower than", OpponentsCard.name);
  // renderLose();
  Deck = UpdatedDeck;
  console.log("Updated deck", Deck);
  
  currentCard.innerHTML = Deck[0].name;
  PossibleWarCard.innerHTML = Deck[4].name;
})

socket.on("YouWinWar", (UpdatedDeck) => {
  console.log("You Win the War!");
  console.log(Deck[4].name, "was higher than opponents card");
  // renderWarWin();
  Deck = UpdatedDeck;
  console.log("Updated deck", Deck);

  currentCard.innerHTML = Deck[0].name;
  PossibleWarCard.innerHTML = Deck[4].name;
})

socket.on("YouLoseWar", (UpdatedDeck) => {
  console.log("You lose the War!");
  console.log(Deck[4].name, "was lower than opponents card");
  // renderWarlose();
  Deck = UpdatedDeck;
  console.log("Updated deck", Deck);

  currentCard.innerHTML = Deck[0].name;
  PossibleWarCard.innerHTML = Deck[4].name;
})




function renderWin() {
  
}


function renderGameOver() {
  $("#draw").attr("disabled", true);
  $("#messages").text("Game Over!");
}



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






