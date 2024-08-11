let playerAmount;
let playerNames = [];
let playerNameInput;
let winAmount;

function createPlayerNameInputs() {
  playerNameInputs.innerHTML = "";
  playerAmount = document.getElementById("playerSelect").value;

  for (i = 0; i < playerAmount; i++) {
    playerNameInput = document.createElement("input");
    playerNameInput.type = "text";
    playerNameInput.classList.add("player-name");
    playerNameInput.placeholder = `Spieler ${i + 1} Name`;
    playerNameInput.id = `player${i + 1}`;
    playerNameInputs.appendChild(playerNameInput);
  }
}

function savePlayerNames() {
  const playerInputs = document.querySelectorAll(".player-name");
  playerNames = [];
  playerInputs.forEach((input) => {
    playerNames.push(input.value);
    console.log("Player names:", playerNames);
  });
}

function startGameSession() {
  saveWinAmount();
  savePlayerNames();
  window.location = "views/GameSession.html";
}

function saveWinAmount() {
  winAmount = document.getElementById("winAmount").value;
  console.log("Win Amount:", winAmount);
}
