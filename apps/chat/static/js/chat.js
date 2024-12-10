// load friends
document.addEventListener('DOMContentLoaded', function() {
    fetch('/chat/load_friends/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('friends-container').innerHTML = data.html;
        });
});

// send message
document.getElementById('send-btn').addEventListener('click', function() {
    const recipientId = document.getElementById('recipient-id').value;
    const content = document.getElementById('message-input').value;

    fetch(`/chat/send_message/${recipientId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `content=${encodeURIComponent(content)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Message sent') {
            const chatbox = document.getElementById('chatbox-messages');
            chatbox.innerHTML += `<p><strong>You:</strong> ${content}</p>`;
            document.getElementById('message-input').value = '';
        } else {
            alert(data.error);
        }
    });
});
