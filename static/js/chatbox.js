var g_socket = new WebSocket('ws://localhost:8000/ws/chat/');
var allconversations = [];
let link;

function sendMessage() {
	const message = document.getElementById('inputMessages').value;
	const chat = document.getElementById('chatMessages');
	const newMessage = document.createElement('div');
	newMessage.classList.add('message');
	if (message === '') {
		return;
	}
	if (g_socket)
	{
		newMessage.textContent = 'You: ' + message;
		chat.appendChild(newMessage);
		chat.scrollTop = chat.scrollHeight;
		if (allconversations[document.getElementById('selectFriend').textContent] === undefined)
		{
			allconversations[document.getElementById('selectFriend').textContent] = [];
		}
		allconversations[document.getElementById('selectFriend').textContent].push({
			'from': 'You',
			'message': message,
		});
		g_socket.send(JSON.stringify({
            'to': document.getElementById('selectFriend').textContent,
            'message': message,
        }));
    }
	document.getElementById('inputMessages').value = '';
}

var friendlist = [];

function fetchFriendList() {
	fetch('/authe/api/users/')
		.then(response => response.json())
		.then(data => {
			const elemcontainer = document.getElementById('FriendList');

			for (let i = 0; i < data.length; i++) {
				friendlist[i] = data[i].username;
			}

			for (let i = 0; i < friendlist.length; i++) {
				var newFriend = document.createElement("button");
				newFriend.textContent = friendlist[i];
				
				if (data[i].is_online)
				{
					newFriend.style.color = "lime";
					newFriend.style.fontWeight = "bold";
				}
				else
				{
					newFriend.style.color = "red";
					newFriend.style.fontWeight = "normal";
				}
				newFriend.classList.add("friend");
				if (elemcontainer == null)
					return;
				elemcontainer.appendChild(newFriend);
				newFriend.addEventListener('click', function(event) {
					loadBar(event);
				});
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function retrieveConversations(data) {
	if (allconversations[data.from] === undefined)
	{
		allconversations[data.from] = [];
	}
	allconversations[data.from].push({
		'from': data.from,
		'message': data.message,
	});
}

function printallConversations(of) {
	
	const chat = document.getElementById('chatMessages');
	chat.textContent = '';
	if (allconversations[of] === undefined)
	{
		allconversations[of] = [];
	}
	for (let i = 0; i < allconversations[of].length; i++) {
		const newMessage = document.createElement('div');
		newMessage.classList.add('message');
		newMessage.textContent = allconversations[of][i].from + ': ' + allconversations[of][i].message;
		chat.appendChild(newMessage);
	}
	chat.scrollTop = chat.scrollHeight;
}

function delprevconversation() {
	const chat = document.getElementById('chatMessages');
	while (chat.firstChild) {
		chat.removeChild(chat.firstChild);
	}
}

function liveChat() {

	if (window.location.pathname.substring(0, 7) === "/authe/")
		return;

	const ChatButton = document.getElementById('chat');
	const liveChat = document.getElementById('box');
	const minWin = document.getElementById('closeChat');
	const search = document.getElementById('addFriends');
	const elemcontainer = document.getElementById('FriendList');
	const selectFriend = document.getElementById('selectFriend');

	setTimeout(fetchFriendList, 100);

	g_socket.onmessage = function(event) {
		const data = JSON.parse(event.data);
		if (data.from === undefined || data.message === undefined)
			return;
		retrieveConversations(data);
		console.log('WebSocket message received:', data);
		if (data.message.includes('not connected'))
		{
			let name = data.message.split(' ')[0];
			elemcontainer.childNodes.forEach((element) => {
				if (element.textContent === name)
				{
					element.style.color = "red";
					element.style.fontWeight = "normal";
				}
			});

			const chat = document.getElementById('chatMessages');
			const newMessage = document.createElement('div');
			newMessage.classList.add('message');
			newMessage.textContent = data.from + ': ' + data.message;
			chat.appendChild(newMessage);
			chat.scrollTop = chat.scrollHeight;

		}
		else if (document.getElementById('selectFriend').textContent === data.from)
		{
        	const chat = document.getElementById('chatMessages');
			const newMessage = document.createElement('div');
			newMessage.classList.add('message');
			newMessage.textContent = data.from + ': ' + data.message;
			chat.appendChild(newMessage);
			chat.scrollTop = chat.scrollHeight;

			elemcontainer.childNodes.forEach((element) => {
				if (element.textContent === data.from)
				{
					element.style.color = "lime";
					element.style.fontWeight = "bold";
				}
			});
		}
    };

    g_socket.onclose = function(event) {
        console.log('WebSocket connection closed');
    };

	g_socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

	g_socket.onopen = function() {
		console.log('WebSocket connection opened');
	}

	if (search)
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
	selectFriend.addEventListener('click', loadBar);
	// linkFriend.addEventListener('click', function(event) { 
	//     pageFriend(event); 
	// });
	
	search.addEventListener('keydown', function(event) {
		addFriends(event, elemcontainer);
	});

	// receiveMessage();
}

function loadBar(event) {
	if (event.type === 'click') {  // Fix: change to check for 'click' event type
		// event.preventDefault();
		link = document.createElement("a");

		var friendName = event.target.textContent;

		// Correct the link, add http:// to make it a valid URL
		link.href = "/profil/" + friendName + "/";
		link.textContent = friendName;

		// Find the 'selectFriend' element and append the link
		var selectFriendElement = document.getElementById('selectFriend'); // Assuming you're using the ID
		if (selectFriendElement) {
			delprevconversation();
			printallConversations(friendName);
			selectFriendElement.textContent = ''; // Clear previous content
			selectFriendElement.appendChild(link); // Append the new link
		} else {
			console.error('selectFriend element does not exist in the DOM');
		}
	}
}

function pageFriend(event) {
		var url = event.target.href;
		window.location.href = url;  // Voir avec les urls et les views car ca marche pas
}

function alreadyfriend(inputValue) {
	for (let i = 0; i < friendlist.length; i++) {
		if (friendlist[i] === inputValue) {
			return true;
		}
	}
	return false;
}

function notindatabase(inputValue) {
	for (let i = 0; i < friendlist.length; i++) {
		if (friendlist[i] === inputValue) {
			return false;
		}
	}
	return true;
}

function addFriends(event, elemcontainer) {
	if (event.key === 'Enter') {
		event.preventDefault();
		var inputValue = document.getElementById('addFriends').value;
		if (alreadyfriend(inputValue)) {
			document.getElementById('addFriends').value = '';
			document.getElementById('addFriends').placeholder = "Already a friend";
			return;
		}
		if (notindatabase(inputValue)) {
			document.getElementById('addFriends').value = '';
			document.getElementById('addFriends').placeholder = "User not found";
			return;
		}
		friendlist.push(inputValue);
		document.getElementById('addFriends').value = '';

		var newFriend = document.createElement("button");
		newFriend.classList.add("friend");
		//check if the inputname exist in the database
		
		newFriend.textContent = inputValue;
		elemcontainer.appendChild(newFriend);
		document.getElementById('addFriends').placeholder = "Add a friend";

		newFriend.addEventListener('click', function(event) {
			loadBar(event);
		});

		elemcontainer.scrollTop = elemcontainer.scrollHeight;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	liveChat();

	document.body.addEventListener('keyup', function(event) {
		if (event.key === 'Enter' && document.getElementById('selectFriend').textContent !== '') {
			sendMessage();
		}
	});
});

export {link , liveChat, allconversations}