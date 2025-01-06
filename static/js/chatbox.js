

document.addEventListener('DOMContentLoaded', () => {
	liveChat();

	document.body.addEventListener('keyup', function(event) {
		if (event.key === 'Enter' && document.getElementById('selectFriend').textContent !== '') {
			sendMessage();
		}
	});
});

function getlogin() {
	fetch('/authe/api/users/')
		.then(response => response.json())
		.then(data => {
			return data[0].username;

		})
		.catch((error) => {
			console.error('Error:', error);
		});
}


function addMessageTobdd(message) {
	fetch('/authe/api/messages/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message: message,
			recipient: document.getElementById('selectFriend').textContent,
			sender: getlogin(),
		}),
	})
		.then(response => {
			if (!response.ok) {
				console.error('Error:', response);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

// function sendMessageToTarget(message, recipient) {
// 	fetch('/authe/api/send-message/', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			message: message,
// 			recipient: recipient,
// 		}),
// 	})
// 		.then(response => {
// 			if (!response.ok) {
// 				console.error('Error:', response);
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error:', error);
// 		});
// }

// function receiveMessage() {
// 	fetch('/authe/api/messages/')
// 		.then(response => response.json())
// 		.then(data => {
// 			const chat = document.getElementById('chatMessages');
// 			for (let i = 0; i < data.length; i++) {
// 				const newMessage = document.createElement('div');
// 				newMessage.classList.add('message');
// 				newMessage.textContent = data[i].sender + ": " + data[i].message;
// 				chat.appendChild(newMessage);
// 			}
// 			chat.scrollTop = chat.scrollHeight;
// 		})
// 		.catch((error) => {
// 			console.error('Error:', error);
// 		});
// }

function sendMessage() {
	const chat = document.getElementById('chatMessages');
	const newMessage = document.createElement('div');
	newMessage.classList.add('message');
	const message = document.getElementById('inputMessages').value;
	if (message === '') {
		return;
	}

	addMessageTobdd(message);
	newMessage.textContent = "You: " + message;
	// sendMessageToTarget(message, document.getElementById('selectFriend').textContent);

	chat.appendChild(newMessage);
	chat.scrollTop = chat.scrollHeight;
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



function liveChat() {
	const ChatButton = document.getElementById('chat');
	const liveChat = document.getElementById('box');
	const minWin = document.getElementById('closeChat');
	const search = document.getElementById('addFriends');
	const elemcontainer = document.getElementById('FriendList');
	const selectFriend = document.getElementById('selectFriend');
	// const linkFriend = document.getElementById('infoFriend');
	fetchFriendList();

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
		var link = document.createElement("a");

		var friendName = event.target.textContent;

		// Correct the link, add http:// to make it a valid URL
		link.href = "/account/" + friendName + "/";
		link.textContent = friendName;

		// Find the 'selectFriend' element and append the link
		var selectFriendElement = document.getElementById('selectFriend'); // Assuming you're using the ID
		if (selectFriendElement) {
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
