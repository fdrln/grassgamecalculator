let playerAmount;

function createPlayerNameInputs() {
  playerNames.innerHTML = "";
  playerAmount = document.getElementById("playerSelect").value;

  for (i = 0; i < playerAmount; i++) {
    var playerNameInput = document.createElement("input");
    playerNameInput.type = "text";
    playerNameInput.classList.add("player-name");
    playerNameInput.placeholder = `Spieler ${i + 1} Name`;
    playerNameInput.id = `spieler${i + 1}`;
    playerNames.appendChild(playerNameInput);
  }
}
