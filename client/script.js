const url = window.location.origin
let socket = io.connect(url);

const draw = document.getElementById("draw");
const currentCard = document.getElementById("CurrentCard");

const placeholderTextField = document.getElementById("placeholderTextField");
const TextField = document.getElementById("TextField");
const submitButton = document.getElementById("SubmitButton");
const opponentName = document.getElementById("opponentName");
const FindOpponent = document.getElementById("FindOpponent");




const flipCard = document.getElementsByClassName("flip-card");
const CardText = document.getElementById("text");

let InputedText;

let amPlayer1;
let myTurn;
let Deck;
let OpponentsCard;
let OpponentsWarCard;


FindOpponent.onclick = () => {
  window.location.reload();
}


submitButton.disabled = true;
draw.disabled = true;





submitButton.onclick = () => {
  submitButton.disabled = true;
  socket.emit("Name", TextField.value);
}

socket.on("OpponentsName", (OpponentsName) => {
  opponentName.innerHTML = `You're playing against: ${OpponentsName}`;
});




socket.on("game.begin", (isPlayer1, deck) => {
  // is opponent exprected to be false if refreshed first
  Deck = deck;
  draw.disabled = false;
  submitButton.disabled = false;
  
  document.getElementById("joined").innerHTML = "Opponent Found";
  amPlayer1 = isPlayer1;
  myTurn = isPlayer1;


  draw.innerHTML = Deck[0].name;







  switchTurns();
  console.log(Deck);
});



draw.onclick = () => {
  socket.emit("move", amPlayer1, Deck);
  CardText.style.pointerEvents = "none";


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
});
socket.on("OpponentsWarCardYouWonToo", (Card) => {
  OpponentsWarCard = Card;
});
socket.on("OpponentsWarCardYouLostToo", (Card) => {
  OpponentsWarCard = Card;
});



function displayUpdatedCards() {
  draw.innerHTML = Deck[0].name;
}

function updateDeck(updateddeck) {
  Deck = updateddeck;
  console.log("Updated Deck", Deck);
}

socket.on("Win", (UpdatedDeck) => {
  console.log("You Win!");
  console.log(Deck[0].name, "Was higher than", OpponentsCard.name);
  renderWin();

  updateDeck(UpdatedDeck);

  displayUpdatedCards();
  PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})

socket.on("Lose", (UpdatedDeck) => {
  console.log("You Lose!");
  console.log(Deck[0].name, "Was lower than", OpponentsCard.name);
  renderLose();

  updateDeck(UpdatedDeck);
  
  displayUpdatedCards();
  PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})

socket.on("YouWinWar", (UpdatedDeck) => {
  console.log("You Win the War!");
  console.log(Deck[4].name, "was higher than", OpponentsWarCard.name);
  // renderWarWin();
  updateDeck(UpdatedDeck);

  displayUpdatedCards();
  PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})

socket.on("YouLoseWar", (UpdatedDeck) => {
  console.log("You lose the War!");
  console.log(Deck[4].name, "was lower than", OpponentsWarCard.name);
  // renderWarlose();
  updateDeck(UpdatedDeck);

  displayUpdatedCards();
  PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})



socket.on("GameOverWon", () => {
  renderGameWin();
})
socket.on("GameOverLost", () => {
  renderGameLose();
})


function renderGameWin() {
  $("#messages").text("You Win The Game!");
  $("#draw").attr("disabled", true);
  $("#CurrentCard").text("");
  $("#WarCard").text("");
}
function renderGameLose() {
  $("#messages").text("You Lose The Game!");
  $("#draw").attr("disabled", true);
  $("#CurrentCard").text("");
  $("#WarCard").text("");
}

function renderWin() {
  $("joined").text("You Win the Duel!");
}
function renderLose() {
  $("joined").text("You Lose the Duel!");
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
});






