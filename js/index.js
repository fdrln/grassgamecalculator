let playerAmount;
let playerNames = [];
let playerNameInput;
let winAmount;
let roundCount = 0;
let playerNumberTurn = 0;
let hasBanker;
let hasSoldOut;
let hasDoubleCrossed;
let hasWipedOut;
let currentMoneyScore;
let newMoneyScore;
let protectedMoney;
let openMoney;

const banker = 0.2;
const soldOut = 250000;
const doubleCrossed = 50000;
const wipedOut = 100000;

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
  playerInputs.forEach((input) => {
    playerNames.push(input.value);
    console.log("Player names:", playerNames);
  });
  playerNamesString = JSON.stringify(playerNames);
  localStorage.setItem("playerNames", playerNamesString);
}

function startGameSession() {
  saveWinAmount();
  savePlayerNames();
  window.location = "views/GameSession.html";
  getPlayerNames();
}

function saveWinAmount() {
  winAmount = document.getElementById("winAmount").value;
  localStorage.setItem("winAmount", winAmount);
}

function saveAllRoundInputs() {
  protectedMoney = document.getElementById("protectedMoney").value;
  openMoney = document.getElementById("openMoney").value;
  hasBanker = document.getElementById("banker").checked;
  hasSoldOut = document.getElementById("soldOut").checked;
  hasDoubleCrossed = document.getElementById("doubleCrossed").checked;
  hasWipedOut = document.getElementById("wipedOut").checked;
}

function getPlayerNames() {
  playerNamesString = localStorage.getItem("playerNames");
  playerNames = JSON.parse(playerNamesString);
  document.getElementById("currentPlayer").innerHTML = playerNames[0];
  console.log("playernames: ", playerNames);
}

function getWinAmount() {
  winAmount = localStorage.getItem("winAmount");
  console.log(winAmount);
}

function nextPlayer() {
  if (playerNumberTurn < playerNames.length - 1) {
    playerNumberTurn++;
    document.getElementById("currentPlayer").innerHTML =
      playerNames[playerNumberTurn];
  } else {
    playerNumberTurn = 0;
    document.getElementById("currentPlayer").innerHTML =
      playerNames[playerNumberTurn];
  }
}
