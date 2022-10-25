const url = window.location.origin
let socket = io.connect(url);



socket.on("game.begin", (deck, isOpponent) => {
  
  document.getElementById("messages").innerHTML = "Opponent Joined";
});







