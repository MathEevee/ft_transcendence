document.addEventListener('DOMContentLoaded', () => {
    liveChat();
});

/* <div class="ChatButton" id = "chat" type="button">chatbox</div>
<div class="liveChat" id = "box">
    <div class="minWin" id = "closeChat">-</div> */

function liveChat(){
    const ChatButton = document.getElementById('chat');
    const liveChat = document.getElementById('box');
    const minWin = document.getElementById('closeChat');


    function openChat(){
        ChatButton.style.display = "none";
        liveChat.style.display = "block";
        console.log("salut");
    }

    function closeChat(){
        liveChat.style.display = "none";
        ChatButton.style.display = "flex";
    }
    
    ChatButton.addEventListener('click', openChat)
    minWin.addEventListener('click', closeChat)
};

