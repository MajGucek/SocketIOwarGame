const url = window.location.origin
let socket = io.connect(url);

const draw = document.getElementById("draw");
const currentCard = document.getElementById("CurrentCard");
const Messages = document.getElementById("messages");
const joined = document.getElementById("joined");
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
const inner = document.getElementById("flip-card-inner");
let cardImage = document.getElementById("card-image");
const Win = document.getElementById("win");
const Lose = document.getElementById("lose");
const OpCard = document.getElementById("OpCard");

let InputedText;
let amPlayer1;
let myTurn;
let Deck;
let OpponentsCard;
let OpponentsWarCard;
let WinShakeInterval;
let LoseShakeInterval;


// default state
Messages.innerHTML = "";
submitButton.disabled = true;
draw.disabled = true;
SubmitPassword.disabled = true;
//

socket.on("password", (password) => {
  pass.innerHTML = `Deli kodo nasprotniku: ${password}`;
  SubmitPassword.remove();
  PasswordField.remove();
});

socket.on("PasswordReq", () => {
  pass.innerHTML = `Vtipkaj kodo`;   
  SubmitPassword.disabled = false;
});

SubmitPassword.onclick = () => {
  console.log(PasswordField.value);
  socket.emit("PasswordRes", PasswordField.value);
}



submitButton.onclick = () => {
  socket.emit("Name", TextField.value);
  submitButton.remove();
  TextField.remove();
}

socket.on("OpponentsName", (OpponentsName) => {
  opponentName.innerHTML = `Igraš proti: ${OpponentsName}`;
});


socket.on("OpponentFound", () => {
  joined.innerHTML = "Nasprotnik najden";
});

draw.onclick = () => {
  socket.emit("move", amPlayer1, Deck);
  inner.style.transform = "rotateY(-180deg)";
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
  cardImage.alt = Deck[0].name;
  cardImage.setAttribute("src", "./images/" + getImage(Deck[0].name, Deck[0].value));
  //cardImage.src = "./images/" + getImage(Deck[0].name, Deck[0].value);
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
  pass.remove();

  Messages.innerHTML = "Igra se začne!";
  draw.innerHTML = Deck[0].name;
  switchTurns();
  console.log(Deck);
  displayUpdatedCards();
  joined.remove();
});






socket.on("Win", (UpdatedDeck) => {
  console.log("You Win!");
  console.log(Deck[0].name, "Was higher than", OpponentsCard.name);
  OpCard.innerHTML = Deck[0].name + " Je bil močnjejši kot " + OpponentsCard.name;
  renderWin();

  updateDeck(UpdatedDeck);

  displayUpdatedCards();
  //PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})

socket.on("Lose", (UpdatedDeck) => {
  console.log("You Lose!");
  console.log(Deck[0].name, "Was lower than", OpponentsCard.name);
  OpCard.innerHTML = Deck[0].name + " Je bil slabši kot " + OpponentsCard.name;
  renderLose();

  updateDeck(UpdatedDeck);
  
  displayUpdatedCards(Deck[0].name, Deck.value);
  //PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})

socket.on("YouWinWar", (UpdatedDeck) => {
  console.log("You Win the War!");
  OpCard.innerHTML = Deck[4].name + " Je bil močnjejši kot " + OpponentsWarCard.name;
  // renderWarWin();
  updateDeck(UpdatedDeck);

  displayUpdatedCards();
  //PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})

socket.on("YouLoseWar", (UpdatedDeck) => {
  console.log("You lose the War!");
  OpCard.innerHTML = Deck[4].name + " Je bil slabši kot " + OpponentsCard.name;
  // renderWarlose();
  updateDeck(UpdatedDeck);

  displayUpdatedCards();
  //PossibleWarCard.innerHTML = `Possible War Card: ${Deck[4].name}`;
})







socket.on("GameOverWon", () => {
  renderGameWin();
})
socket.on("GameOverLost", () => {
  renderGameLose();
})


function renderGameWin() {
  $("#messages").text("Zmagaš Igro!");
  $("#draw").attr("disabled", true);
  $("#CurrentCard").text("");
  $("#WarCard").text("");
}
function renderGameLose() {
  $("#messages").text("Izubiš igro!");
  $("#draw").attr("disabled", true);
  $("#CurrentCard").text("");
  $("#WarCard").text("");
}

function renderWin() {
  Win.style.opacity = "100%";

  setTimeout(() => {
    Win.style.opacity = "0%";
  }, 2500);
}
function renderLose() {
  Lose.style.opacity = "100%"

  setTimeout(() => {
    Lose.style.opacity = "0%";
  }, 2500);
}


function switchTurns() {
if (myTurn == true) {
  renderMyTurn();
} else {
  renderOpponentTurn();
}
}


function renderMyTurn() {
  $("#messages").text("Tvoja poteza");
  $("#draw").removeAttr("disabled");
}

function renderOpponentTurn() {
  $("#messages").text("Nasprotnikova poteza");
  $("#draw").attr("disabled", true);
}

socket.on("clientdisconnect", (id) => {
  console.log(`${id} disconnected!`);
  $("#draw").attr("disabled", true);
});


function getImage(CardName, CardValue) {
  if (CardName.includes('Heart')) {
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



