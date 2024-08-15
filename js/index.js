let playerAmount;
let playerNames = [];
let playerNameInput;
let winAmount;
let roundCount = 1;
let playerNumberTurn = 0;
let hasBanker;
let hasSoldOut;
let hasDoubleCrossed;
let hasWipedOut;
let currentMoneyScore;
let newMoneyScore;
let protectedMoney;
let openMoney;
let roundResult;
let gridData;

const soldOut = 25000;
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
  });
  playerNamesString = JSON.stringify(playerNames);
  localStorage.setItem("playerNames", playerNamesString);
}

function startGameSession() {
  setRoundCount();
  setWinAmount();
  savePlayerNames();
  window.location = "views/GameSession.html";
}

function resetValues() {
  localStorage.clear();
}

function saveAllRoundInputs() {
  protectedMoney = document.getElementById("protectedMoney").value;
  openMoney = document.getElementById("openMoney").value;
  hasBanker = document.getElementById("banker").checked;
  hasSoldOut = document.getElementById("soldOut").checked;
  hasDoubleCrossed = document.getElementById("doubleCrossed").checked;
  hasWipedOut = document.getElementById("wipedOut").checked;
  highestPeddle = document.getElementById("highestPeddle").value;
}

function calculateSumForPlayerRound() {
  saveAllRoundInputs();
  if (hasDoubleCrossed) {
    openMoney = parseInt(openMoney) - doubleCrossed;
  }
  if (hasSoldOut) {
    openMoney = parseInt(openMoney) - soldOut;
  }
  if (hasWipedOut) {
    openMoney = parseInt(openMoney) - wipedOut;
  }
  roundResult =
    parseInt(openMoney) + parseInt(protectedMoney) - parseInt(highestPeddle);
}

function saveCurrentPlayerRound() {
  calculateSumForPlayerRound();
  const currentPlayerIndex = playerNumberTurn;
  const currentPlayerName = playerNames[currentPlayerIndex];
  const currentPlayerOpenMoney = document.getElementById("openMoney").value;
  const currentPlayerProtectedMoney =
    document.getElementById("protectedMoney").value;
  const currentPlayerHasBanker = document.getElementById("banker").checked;
  const currentPlayerRoundResult = roundResult;

  const currentPlayerData = {
    name: currentPlayerName,
    round: roundCount,
    openMoney: currentPlayerOpenMoney,
    protectedMoney: currentPlayerProtectedMoney,
    highestPeddle: parseFloat(document.getElementById("highestPeddle").value),
    hasBanker: currentPlayerHasBanker,
    roundResult: currentPlayerRoundResult,
  };

  const allPlayersData =
    JSON.parse(localStorage.getItem("allPlayersData")) || [];
  allPlayersData.push(currentPlayerData);
  localStorage.setItem("allPlayersData", JSON.stringify(allPlayersData));
}

function updateRoundCount() {
  document.getElementById("roundCount").innerHTML = "Runde: " + roundCount;
  saveState();
}

function nextPlayer() {
  getPlayerNames(function () {
    saveCurrentPlayerRound();
  });

  if (playerNumberTurn < playerNames.length - 1) {
    playerNumberTurn++;
    document.getElementById("currentPlayer").innerHTML =
      playerNames[playerNumberTurn];
  } else {
    roundCount++;
    playerNumberTurn = 0;
    document.getElementById("currentPlayer").innerHTML =
      playerNames[playerNumberTurn];
    updateRoundCount();
    setRoundCount();
    updateBankerBonus(
      JSON.parse(localStorage.getItem("allPlayersData")),
      roundCount - 1
    );
    updateGameDataGrid();
    setGridData();
  }
  clearFields();
  saveState();
}

function updateBankerBonus(allGameData, currentRound) {
  const bankerPlayer = allGameData.find(
    (player) => player.round === currentRound && player.hasBanker
  );
  if (bankerPlayer) {
    const bankerBonus = allGameData.reduce((total, player) => {
      if (player.round === currentRound && !player.hasBanker) {
        const originalOpenMoney = parseFloat(player.openMoney);
        const bonus = parseFloat(player.openMoney) * 0.2;
        player.roundResult =
          parseFloat(player.protectedMoney) + (originalOpenMoney - bonus);
        player.openMoney = originalOpenMoney - bonus;
        player.subtractedFromOpenMoney = bonus;
        return total + bonus;
      }
      return total;
    }, 0);
    if (bankerBonus > 0) {
      bankerPlayer.roundResult += bankerBonus;
    }
    localStorage.setItem("allPlayersData", JSON.stringify(allGameData));
  }
}
function updateGameDataGrid() {
  const allPlayersData = JSON.parse(localStorage.getItem("allPlayersData"));
  const gameDataGridBody = document.getElementById("gameDataGridBody");
  const playerNames = Array.from(
    new Set(allPlayersData.map((player) => player.name))
  );

  // Clear the existing table body
  gameDataGridBody.innerHTML = "";

  // Create the table header with player names
  const headerRow = document.createElement("tr");
  const roundHeaderCell = document.createElement("th");
  roundHeaderCell.textContent = "Runde";
  headerRow.appendChild(roundHeaderCell);
  playerNames.forEach((playerName) => {
    const playerHeaderCell = document.createElement("th");
    playerHeaderCell.textContent = playerName;
    headerRow.appendChild(playerHeaderCell);
  });
  gameDataGridBody.appendChild(headerRow);

  // Loop through each round and add a row to the table
  const rounds = Array.from(
    new Set(allPlayersData.map((player) => player.round))
  );
  rounds.forEach((round) => {
    const row = document.createElement("tr");
    const roundCell = document.createElement("td");
    roundCell.textContent = round;
    row.appendChild(roundCell);
    playerNames.forEach((playerName) => {
      const playerCell = document.createElement("td");
      const playerData = allPlayersData.find(
        (player) => player.name === playerName && player.round === round
      );
      if (playerData) {
        playerCell.textContent = playerData.roundResult;
      } else {
        playerCell.textContent = "";
      }
      row.appendChild(playerCell);
    });
    gameDataGridBody.appendChild(row);
  });
  const playerTotals = {};
  allPlayersData.forEach((playerData) => {
    const playerName = playerData.name;
    if (!playerTotals[playerName]) {
      playerTotals[playerName] = 0;
    }
    playerTotals[playerName] += parseInt(playerData.roundResult);
  });

  // Display total round result for each player under the grid
  const totalRow = document.createElement("tr");
  const totalHeaderCell = document.createElement("th");
  totalHeaderCell.textContent = "Total";
  totalRow.appendChild(totalHeaderCell);
  playerNames.forEach((playerName) => {
    const totalCell = document.createElement("td");
    totalCell.textContent = playerTotals[playerName];
    totalRow.appendChild(totalCell);
  });
  gameDataGridBody.appendChild(totalRow);
}

function clearFields() {
  document.getElementById("protectedMoney").value = "";
  document.getElementById("openMoney").value = "";
  document.getElementById("banker").checked = false;
  document.getElementById("soldOut").checked = false;
  document.getElementById("doubleCrossed").checked = false;
  document.getElementById("wipedOut").checked = false;
  document.getElementById("highestPeddle").value = "0";
}

var popUp = document.getElementById("popUp");
var gameStandingsButton = document.getElementById("gameStatus");
var span = document.getElementById("closeButton");
gameStandingsButton.onclick = function () {
  popUp.style.display = "block";
};
span.onclick = function () {
  popUp.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == popUp) {
    popUp.style.display = "none";
  }
};
//GETTERS AND SETTERS

function setGridData() {
  gridData = document.getElementById("gameDataGrid").innerHTML;
  localStorage.setItem("gridData", gridData);
}
function setRoundCount() {
  roundCountString = JSON.stringify(roundCount);
  localStorage.setItem("roundCount", roundCountString);
}

function setPlayerNumberTurn() {
  playerNumberTurnString = JSON.stringify(playerNumberTurn);
  localStorage.setItem("playerNumberTurn", playerNumberTurnString);
}

function setWinAmount() {
  winAmount = document.getElementById("winAmount").value;
  winAmountString = JSON.stringify(winAmount);
  localStorage.setItem("winAmount", winAmountString);
}

function getWinAmount() {
  winAmountString = localStorage.getItem("winAmount");
  winAmount = JSON.parse(winAmountString);
}

function getPlayerNames(callback) {
  console.log("Getting player names...");
  playerNamesString = localStorage.getItem("playerNames");
  playerNames = JSON.parse(playerNamesString);
  document.getElementById("currentPlayer").innerHTML = playerNames[0];
  console.log("playernames: ", playerNames);
  callback();
}

function getGridData() {
  gridData = localStorage.getItem("gridData");
  if (gridData) {
    document.getElementById("gameDataGrid").innerHTML = gridData;
  }
}

function getRoundCount() {
  roundCountString = localStorage.getItem("roundCount");
  roundCount = JSON.parse(roundCountString);
}

function getPlayerNumberTurn() {
  playerNumberTurnString = localStorage.getItem("playerNumberTurn");
  playerNumberTurn = JSON.parse(playerNumberTurnString);
}

function testStuff() {
  console.log("updateround: ", roundCount);
}

// Save state function
function saveState() {
  const state = {
    playerNames: playerNames,
    roundCount: roundCount,
    playerNumberTurn: playerNumberTurn,
    winAmount: winAmount,
    gridData: gridData,
    currentMoneyScore: currentMoneyScore,
    newMoneyScore: newMoneyScore,
    protectedMoney: protectedMoney,
    openMoney: openMoney,
    roundResult: roundResult,
    hasBanker: hasBanker,
    hasSoldOut: hasSoldOut,
    hasDoubleCrossed: hasDoubleCrossed,
    hasWipedOut: hasWipedOut,
  };

  localStorage.setItem("state", JSON.stringify(state));
}

function loadState() {
  const storedState = localStorage.getItem("state");
  if (storedState) {
    const state = JSON.parse(storedState);
    playerNames = state.playerNames;
    roundCount = state.roundCount;
    playerNumberTurn = state.playerNumberTurn;
    winAmount = state.winAmount;
    gridData = state.gridData;
    currentMoneyScore = state.currentMoneyScore;
    newMoneyScore = state.newMoneyScore;
    protectedMoney = state.protectedMoney;
    openMoney = state.openMoney;
    roundResult = state.roundResult;
    hasBanker = state.hasBanker;
    hasSoldOut = state.hasSoldOut;
    hasDoubleCrossed = state.hasDoubleCrossed;
    hasWipedOut = state.hasWipedOut;

    // Update UI with loaded state
    document.getElementById("currentPlayer").innerHTML =
      playerNames[playerNumberTurn];
    document.getElementById("roundCount").innerHTML = "Runde: " + roundCount;
    // Update other UI elements as needed
  } else {
    updateRoundCount();
    getPlayerNames();
    getPlayerNumberTurn();
    getRoundCount();
    document.getElementById("currentPlayer").innerText =
      playerNames[playerNumberTurn];
    document.getElementById("roundCount").innerHTML = "Runde: " + roundCount;
  }
}

window.onload = function () {
  loadState();
};
