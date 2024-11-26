document.addEventListener('DOMContentLoaded', () => {
    liveChat();
});

var tablist = ["alice","bob","salut"]

function liveChat(){
    const ChatButton = document.getElementById('chat');
    const liveChat = document.getElementById('box');
    const minWin = document.getElementById('closeChat');
    const search = document.getElementById('addFriends');
    
    function openChat(){
        ChatButton.style.display = "none";
        liveChat.style.display = "block";
        //load all friends
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
    if (event.key === 'Enter') {
        event.preventDefault();
        //add check is in database
        var inputValue = document.getElementById('addFriends').value;
        tablist.push(inputValue);
        console.log(tablist);
        document.getElementById('addFriends').value = '';
        var newFriend = document.createElement("p"); //change to button to open chat with this user
        newFriend.classList.add("friend"); //add to the database
        newFriend.textContent = inputValue;
        document.getElementById('FriendList').appendChild(newFriend);
    }
}