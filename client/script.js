const url = window.location.origin
let socket = io.connect(url);

const draw = document.getElementById("draw");
const currentCard = document.getElementById("CurrentCard");
const Messages = document.getElementById("messages");
const JoinedStatus = document.getElementById("status");
const placeholderTextField = document.getElementById("placeholderTextField");
const TextField = document.getElementById("TextField");
const submitButton = document.getElementById("SubmitButton");
const opponentName = document.getElementById("opponentName");
const FindOpponent = document.getElementById("FindOpponent");
const pass = document.getElementById("pass");
const SubmitPassword = document.getElementById("SubmitPass");
const PasswordField = document.getElementById("PasswordField");
const Status = document.getElementById("status");
const flipCard = document.getElementsByClassName("flip-card");
const cardImage = document.getElementById("cardImage");



let InputedText;
let amPlayer1;
let myTurn;
let Deck;
let OpponentsCard;
let OpponentsWarCard;


// default state
Messages.innerHTML = "";
submitButton.disabled = true;
draw.disabled = true;
SubmitPassword.disabled = true;
//







socket.on("password", (password) => {
  pass.innerHTML = `Share this to your Opponent: ${password}`;
  SubmitPassword.remove();
  PasswordField.remove();
});

socket.on("PasswordReq", () => {
  pass.innerHTML = `Input your Password`;   
  SubmitPassword.disabled = false;
});

SubmitPassword.onclick = () => {
  console.log(PasswordField.value);
  socket.emit("PasswordRes", PasswordField.value);
}

FindOpponent.onclick = () => {
  window.location.reload();
}


submitButton.onclick = () => {
  socket.emit("Name", TextField.value);
  submitButton.remove();
  TextField.remove();
}

socket.on("OpponentsName", (OpponentsName) => {
  opponentName.innerHTML = `You're playing against: ${OpponentsName}`;
});


socket.on("OpponentFound", () => {
  document.getElementById("joined").innerHTML = "Opponent Found";
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




socket.on("game.begin", (isPlayer1, deck) => {
  amPlayer1 = isPlayer1;
  myTurn = isPlayer1;
  Deck = deck;

  submitButton.disabled = false;
  draw.disabled = false;

  SubmitPassword.remove();  
  PasswordField.remove();
  FindOpponent.remove();
  pass.remove();

  Messages.innerHTML = "Game Begins";
  draw.innerHTML = Deck[0].name;
  switchTurns();
  console.log(Deck);
});






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
  Status.innerHTML = "You Won the Duel!";
}
function renderLose() {
  Status.innerHTML = "You Lost the Duel!";
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
});


function getImage(cardName, CardValue) {
  if (cardName.includes('Heart')) {
    switch (CardValue) {
      case 2: return "2_of_hearts.png"; break;
      case 3: return "3_of_hearts.png"; break;
      case 4: return "4_of_hearts.png"; break;
      case 5: return "5_of_hearts.png"; break;
      case 6: return "6_of_hearts.png"; break;
      case 7: return "7_of_hearts.png"; break;
      case 8: return "8_of_hearts.png"; break;
      case 9: return "9_of_hearts.png"; break;
      case 10: return "10_of_hearts.png"; break;
      case 11: return "jack_of_hearts.png"; break;
      case 12: return "queen_of_hearts.png"; break;
      case 13: return "king_of_hearts.png"; break;
      case 14: return "ace_of_hearts.png"; break;
      default: return "Card not Found!"; break;
    }
  } else if (CardName.includes('Spade')) {
    switch (CardValue) {
      case 2: return "2_of_spades.png"; break;
      case 3: return "3_of_spades.png"; break;
      case 4: return "4_of_spades.png"; break;
      case 5: return "5_of_spades.png"; break;
      case 6: return "6_of_spades.png"; break;
      case 7: return "7_of_spades.png"; break;
      case 8: return "8_of_spades.png"; break;
      case 9: return "9_of_spades.png"; break;
      case 10: return "10_of_spades.png"; break;
      case 11: return "jack_of_spades.png"; break;
      case 12: return "queen_of_spades.png"; break;
      case 13: return "king_of_spades.png"; break;
      case 14: return "ace_of_spades.png"; break;
      default: return "Card not Found!"; break;
    }
  } else if (CardName.includes('Diamond')) {
    switch (CardValue) {
      case 2: return "2_of_diamonds.png"; break;
      case 3: return "3_of_diamonds.png"; break;
      case 4: return "4_of_diamonds.png"; break;
      case 5: return "5_of_diamonds.png"; break;
      case 6: return "6_of_diamonds.png"; break;
      case 7: return "7_of_diamonds.png"; break;
      case 8: return "8_of_diamonds.png"; break;
      case 9: return "9_of_diamonds.png"; break;
      case 10: return "10_of_diamonds.png"; break;
      case 11: return "jack_of_diamonds.png"; break;
      case 12: return "queen_of_diamonds.png"; break;
      case 13: return "king_of_diamonds.png"; break;
      case 14: return "ace_of_diamonds.png"; break;
      default: return "Card not Found!"; break;
    }
  } else if (CardName.includes('Club')) {
    switch (CardValue) {
      case 2: return "2_of_clubs.png"; break;
      case 3: return "3_of_clubs.png"; break;
      case 4: return "4_of_clubs.png"; break;
      case 5: return "5_of_clubs.png"; break;
      case 6: return "6_of_clubs.png"; break;
      case 7: return "7_of_clubs.png"; break;
      case 8: return "8_of_clubs.png"; break;
      case 9: return "9_of_clubs.png"; break;
      case 10: return "10_of_clubs.png"; break;
      case 11: return "jack_of_clubs.png"; break;
      case 12: return "queen_of_clubs.png"; break;
      case 13: return "king_of_clubs.png"; break;
      case 14: return "ace_of_clubs.png"; break;
      default: return "Card not Found!"; break;
    }
  }
}



