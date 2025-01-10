export function setupPlayerList(username) {
    const joinButton = document.getElementById('add-player');
    const playersList = document.getElementById('players-list');
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
