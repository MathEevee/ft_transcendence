var tablist = ["alice","bob","salut"]


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; tablist[i]; i++)
    {
        var newFriend = document.createElement("p"); //change to button to open chat with this user
        newFriend.textContent = tablist[i];
        newFriend.classList.add("friend");
        document.getElementById('FriendList').appendChild(newFriend);
    }
    liveChat();
});


function liveChat(){
    const ChatButton = document.getElementById('chat');
    const liveChat = document.getElementById('box');
    const minWin = document.getElementById('closeChat');
    const search = document.getElementById('addFriends');

    search.value = "";
    
    function openChat(){
        ChatButton.style.display = "none";
        liveChat.style.display = "block";
        //load all messages
    }
    
    function closeChat(){
        liveChat.style.display = "none";
        ChatButton.style.display = "flex";
    }

    ChatButton.addEventListener('click', openChat)
    minWin.addEventListener('click', closeChat)
    search.addEventListener('keydown', function(event) {addFriends(event)})
};


function addFriends(event){
    var elemcontainer = document.getElementById('FriendList');
    if (event.key === 'Enter') {
        event.preventDefault();
        //add check is in database
        var inputValue = document.getElementById('addFriends').value;
        tablist.push(inputValue);
        document.getElementById('addFriends').value = '';
        var newFriend = document.createElement("p"); //change to button to open chat with this user
        newFriend.classList.add("friend"); //add to the database
        newFriend.textContent = inputValue;
        elemcontainer.appendChild(newFriend);
        // newFriend.scrollHeight = newFriend.height;
        elemcontainer.scrollTop = elemcontainer.scrollHeight
    }
}