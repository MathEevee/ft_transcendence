let chatSocket;

// Afficher la chatbox
document.querySelector('#chatbox-btn').onclick = function () {
    const chatbox = document.getElementById('chatbox');
    if (chatbox.style.display === 'none' || chatbox.style.display === '') {
        chatbox.style.display = 'block';

        // Initialise la connexion WebSocket si elle n'existe pas encore
        if (!chatSocket || chatSocket.readyState === WebSocket.CLOSED) {
            const groupName = 'group0'; // À remplacer par une variable dynamique
            chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + groupName + '/');

            chatSocket.onopen = function () {
                console.log("WebSocket connection established");
            };

            chatSocket.onmessage = function (e) {
                const data = JSON.parse(e.data);
                const messages = document.getElementById('messages');
                messages.innerHTML += `<p><strong>${data.sender}</strong>: ${data.message}</p>`;
            };

            chatSocket.onclose = function () {
                console.log("WebSocket connection closed");
            };

            chatSocket.onerror = function (error) {
                console.error("WebSocket error: ", error);
            };
        }

    } else {
        chatbox.style.display = 'none';

        // Ferme la connexion WebSocket si elle est ouverte
        if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
            chatSocket.close();
        }
    }
};
