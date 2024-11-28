

document.addEventListener('DOMContentLoaded', () => {
    liveChat();
});

var tablist = ["alice","bob","salut"]

function liveChat(){
    const ChatButton = document.getElementById('chat');
    const liveChat = document.getElementById('box');
    const minWin = document.getElementById('closeChat');
    const search = document.getElementById('addFriends');
    // const loadFriend = document.getElementById('friend');


    for (let i = 0; tablist[i]; i++)
    {
        var newFriend = document.createElement("button"); //change to button to open chat with this user
        newFriend.textContent = tablist[i];
        newFriend.classList.add("friend");
        document.getElementById('FriendList').appendChild(newFriend);
    }
    
    search.value = "";
    
    function openChat(){
        var elemcontainer = document.getElementById('FriendList');
        ChatButton.style.display = "none";
        liveChat.style.display = "block";
        elemcontainer.scrollTop = elemcontainer.scrollHeight;
        var chat = document.createElement("text");
        chat.textContent = "Bienvenue dans votre chat";
    }
    
    function closeChat(){
        liveChat.style.display = "none";
        ChatButton.style.display = "flex";
    }

    ChatButton.addEventListener('click', openChat)
    minWin.addEventListener('click', closeChat)
    // loadFriend.addEventListener('click', loadBar)
    search.addEventListener('keydown', function(event) {addFriends(event)})
};

function loadBar(event){
    var elem = document.getElementById('friend')
    console.log(elem);
    
}


function addFriends(event){
    var elemcontainer = document.getElementById('FriendList');
    if (event.key === 'Enter') {
        event.preventDefault();
        //add check is in database
        var inputValue = document.getElementById('addFriends').value;
        tablist.push(inputValue);
        document.getElementById('addFriends').value = '';
        var newFriend = document.createElement("button"); //change to button to open chat with this user
        newFriend.classList.add("friend"); //add to the database
        newFriend.textContent = inputValue;
        elemcontainer.appendChild(newFriend);
        // newFriend.scrollHeight = newFriend.height;
        elemcontainer.scrollTop = elemcontainer.scrollHeight
    }
}