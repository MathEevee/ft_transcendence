document.addEventListener('DOMContentLoaded', () => {
	liveChat();
});

const friendlist = [];

function fetchFriendList() {
	friendlist = fetch('/authe/api/users/')
		.then(response => response.json())
		.then(data => {
			for (let i = 0; i < data.length; i++) {
				friendlist.push(data[i].username);
				console.log("friendlist[i]:", friendlist[i]);
				console.log("i:", i);
			}
			return (friendlist);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	return (friendlist);
}

fetchFriendList();


function liveChat() {
	const ChatButton = document.getElementById('chat');
	const liveChat = document.getElementById('box');
	const minWin = document.getElementById('closeChat');
	const search = document.getElementById('addFriends');
	const elemcontainer = document.getElementById('FriendList');
	const selectFriend = document.getElementById('selectFriend');
	// const linkFriend = document.getElementById('infoFriend');
	
	for (let i = 0; i < friendlist.length; i++) {
		console.log(friendlist[i]);
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

function addFriends(event, elemcontainer) {
	if (event.key === 'Enter') {
		event.preventDefault();
		var inputValue = document.getElementById('addFriends').value;
		tablist.push(inputValue);
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
