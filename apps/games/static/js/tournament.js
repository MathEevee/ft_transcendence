export function setupPlayerList(username) {
    const joinButton = document.getElementById('add-player');

    const playersListContainer = document.createElement('div');
    playersListContainer.id = 'players-list-container';

    const playersListHeading = document.createElement('h2');
    playersListHeading.textContent = 'Players in the Tournament:';

    const playersList = document.createElement('ul');
    playersList.id = 'players-list';

    playersListContainer.appendChild(playersListHeading);
    playersListContainer.appendChild(playersList);

    const gamesButtons = document.getElementById('games-buttons');
    gamesButtons.appendChild(joinButton);
    gamesButtons.parentNode.appendChild(playersListContainer);

    handleJoinButtonClick(username, playersList);
}

function handleJoinButtonClick(username, playersList) {
    const joinButton = document.getElementById('add-player');
    const players = new Set();

    joinButton.addEventListener('click', () => {
        const playerName = username;

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
