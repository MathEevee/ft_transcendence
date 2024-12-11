// load friends
document.addEventListener('DOMContentLoaded', function() {
    fetch('/chat/load_friends/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('friends-container').innerHTML = data.html;
        });
});

// send message
document.getElementById('send-message').addEventListener('click', function () {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        messageInput.value = ''; // Réinitialise le champ d'entrée
    } else {
        console.error("WebSocket is not connected");
    }
});
