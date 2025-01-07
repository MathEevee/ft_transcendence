document.addEventListener('DOMContentLoaded', () => {
	setupPlayerList();
});

function setupPlayerList() {
    const joinButton = document.getElementById('add-player');

    const playersListContainer = document.createElement('div');
    playersListContainer.id = 'players-list-container';

    const playersListHeading = document.createElement('h2');
    playersListHeading.textContent = 'Players in the Tournament:';

    const playersList = document.createElement('ul');
    playersList.id = 'players-list';

    playersListContainer.appendChild(playersListHeading);
    playersListContainer.appendChild(playersList);

    gamesButtons.appendChild(joinButton);
    gamesButtons.parentNode.appendChild(playersListContainer);

    handleJoinButtonClick();
}

function handleJoinButtonClick() {
    const joinButton = document.getElementById('add-player');
    const playersList = document.getElementById('players-list');
    const players = new Set();

    joinButton.addEventListener('click', () => {
        const playerName = prompt("Enter your name:");

        if (playerName && !players.has(playerName)) {
            players.add(playerName);
            const playerItem = document.createElement('li');
            playerItem.textContent = playerName;
            playersList.appendChild(playerItem);
        } else if (players.has(playerName)) {
            alert(`${playerName} is already in the tournament!`);
        }
    });
}
