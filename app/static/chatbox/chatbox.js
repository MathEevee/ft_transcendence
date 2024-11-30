document.addEventListener('DOMContentLoaded', () => {
    liveChat();
});

var tablist = ["alice", "bob", "salut"];

function liveChat() {
    const ChatButton = document.getElementById('chat');
    const liveChat = document.getElementById('box');
    const minWin = document.getElementById('closeChat');
    const search = document.getElementById('addFriends');
    const elemcontainer = document.getElementById('FriendList');
    
    
    for (let i = 0; i < tablist.length; i++) {
        var newFriend = document.createElement("button");
        newFriend.textContent = tablist[i];
        newFriend.classList.add("friend");
        elemcontainer.appendChild(newFriend);
        
        newFriend.addEventListener('click', function(event) {
            loadBar(event);
        });
    }
    
    search.value = "";
    
    function openChat() {
        ChatButton.style.display = "none";
        liveChat.style.display = "block";
        elemcontainer.scrollTop = elemcontainer.scrollHeight;
    }
    
    function closeChat() {
        liveChat.style.display = "none";
        ChatButton.style.display = "flex";
    }
    
    ChatButton.addEventListener('click', openChat);
    minWin.addEventListener('click', closeChat);
    
    search.addEventListener('keydown', function(event) { 
        addFriends(event); 
    });
}

function loadBar(event) {
    var barElement = document.getElementById('bar');
    barElement.textContent = 'Private with : ';
    var friendName = event.target.textContent;
    barElement.textContent += friendName;
    console.log(friendName);
}

function addFriends(event) {
    var elemcontainer = document.getElementById('FriendList');
    if (event.key === 'Enter') {
        event.preventDefault();
        var inputValue = document.getElementById('addFriends').value;
        tablist.push(inputValue);
        document.getElementById('addFriends').value = '';

        var newFriend = document.createElement("button");
        newFriend.classList.add("friend");
        newFriend.textContent = inputValue;
        elemcontainer.appendChild(newFriend);

        newFriend.addEventListener('click', function(event) {
            loadBar(event);
        });

        elemcontainer.scrollTop = elemcontainer.scrollHeight;
    }
}
