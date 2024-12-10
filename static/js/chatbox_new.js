const chatSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/chat/group_name/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    document.querySelector('#messages').innerHTML += `<p>${data.message}</p>`;
};

document.querySelector('#send-btn').onclick = function() {
    const messageInput = document.querySelector('#message-input');
    chatSocket.send(JSON.stringify({'message': messageInput.value}));
    messageInput.value = '';
};
