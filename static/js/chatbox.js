import {changePage} from './index.js';

if (!window.location.pathname.startsWith('/authe/'))
    var g_socket = new WebSocket('ws://localhost:8000/ws/chat/');

var allconversations = [];
let link;

function sendMessage() {
	const privatewith = document.getElementById('selectFriend');
	const lock = document.getElementById('lock');
	if (privatewith.style.display === 'none' || lock.style.display === 'none')
		return;
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

async function fetchFriendList() {
	const elemcontainer = document.getElementById('FriendList');
	const user = await fetch('/authe/api/me/')
		.then(response => response.json())
	const relationships = await fetch(`/chat/relationships/${user.id}/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
		},
	})
	.then(response => response.json())
	.then(data => {
		for (let i = 0; i < data.length; i++)
		{
			if (data[i].relations === "friend")
			{
				fetch(`/authe/api/users/${data[i].target}/`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
					},
				})
				.then(response => response.json())
				.then(data => {
					var newFriend = document.createElement("button");
					newFriend.dataset.friend = data.username;
					newFriend.textContent = data.username;
					if (data.is_online === true)
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
				})
			}
		}
	})
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

async function printallConversations(of) {
	
	const chat = document.getElementById('chatMessages');
	chat.textContent = '';
	if (allconversations[of] === undefined)
		allconversations[of] = [];
	for (let i = 0; i < allconversations[of].length; i++) {
		if (allconversations[of][i].message.includes('<button>'))
		{
			let teamname = ["Patron", "Polygone", "Gravier", "Rempart", "Philentropes", "Poussière", "Poussin", "Poulet", "Noix", "Balle", "Parchemin", "Chaudron", "Café", "Cafard", "Protéïne"];
			let teamadjective = ["Furieux", "Livide", "Avide", "Granuleux", "Marant", "Etourdie", "Furtif", "Mystèrieux", "Intriguant", "Fou", "Dingue", "Cinglé", "Barré", "Bizarre", "Etrange", "Curieux", "Ridicule", "Insolite", "Inhabituel", "Original", "Excentrique", "Extraordinaire", "Fantaisiste", "Farfelu", "Inouï", "Inouïe", "Insensé", "Invraisemblable", "Incongru", "Incroyable", "Inimaginable", "Décomplexé", "Délirant", "Déjanté", "Dément", "musclé", "puissant", "robuste", "solide", "costaud", "résistant", "vif", "alerte", "agile", "rapide", "Boulémique"];

			function randomTeamName()
			{
				return (teamname[Math.floor(Math.random() * teamname.length)] + " " + teamadjective[Math.floor(Math.random() * teamadjective.length)]);
			}

			async function getUserName() {
				const response = await fetch('/authe/api/me/');
				const data = await response.json();
				return data.username;
			}
			
			// console.log('message includes tournamentname ?', allconversations[of][i - 1]);
			let tournamentId = allconversations[of][i - 1].message.split(' ');
			tournamentId = tournamentId[tournamentId.length - 1];
			tournamentId = tournamentId === 'Pong';
			let username = await getUserName();
			let teamName = randomTeamName();
			const newMessage = document.createElement('a');
			newMessage.classList.add('message');
			newMessage.classList.add('btn');
			newMessage.classList.add('btn-primary');
			newMessage.textContent = 'JOIN';
			chat.appendChild(newMessage);
			chat.scrollTop = chat.scrollHeight;

			newMessage.addEventListener('click', function(event) {
				fetch('/authe/api/tournaments/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
					},
					body: JSON.stringify(
						{
							tournament_id: tournamentId,
							username: username,
							team_name: teamName,
						}
					),
				} ).then(response => response.json())
				.then(response => {
					if (response.error)
						console.warn(`Error adding player to tournament: ${response.error}`);
					else
					{
						if (window.location.pathname.split('/')[3] === 'tournament')
						{
							const row = document.createElement('tr');
							const cell = document.createElement('td');
							const text = document.createTextNode(username);
							const teamcell = document.createElement('td');
							const team = document.createTextNode(teamName);
			
							cell.appendChild(text);
							teamcell.appendChild(team);
							row.appendChild(cell);
							row.appendChild(teamcell);
							tabplayers.appendChild(row);
	
							joinButton.disabled = true;
							joinButton.style.backgroundColor = 'grey';
						}

						console.log(players);

					}
				})
				.catch(err => {
					if (window.location.pathname.split('/')[3] === 'tournament')
						joinButton.disabled = true;
					console.error(`Error adding player to tournament: ${err}`);
				});

				if (tournamentId)
					changePage('/games/pong/tournament/', true);
				else
					changePage('/games/spaceinvaders/tournament/', true);
			});
			continue;
		}
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

async function block_friend(event) {
	const user = await fetch('/authe/api/me/')
	.then(response => response.json())
	const relation = await fetch(`/chat/relationships/${user.id}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
		},
		body: JSON.stringify({
			'username': document.getElementById('selectFriend').textContent,
			'status': 'blocked',
		}),
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		if (data.relations === "blocked")
		{
			const elemcontainer = document.getElementById('FriendList');
			elemcontainer.childNodes.forEach((element) => {
				if (element.textContent === document.getElementById('selectFriend').textContent)
				{
					elemcontainer.removeChild(element);
				}
			});
			document.getElementById('selectFriend').textContent = '';
			delprevconversation();
			create_locked_btn('');
		}
	})
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
	const blocked = document.getElementById('lock');

	setTimeout(fetchFriendList, 100);

	g_socket.onmessage = async function(event) {
		const data = JSON.parse(event.data);
		if (data.status !== undefined) {
			let status = document.querySelector(`#chatbox .friend[data-friend="${data.user}"`);
			status.style.color = data.status === true ? "lime" : "red";
			status.style.fontWeight = data.status === true ? "bold" : "normal";
			return;
		}
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

		if (data.invitation)
		{			
			if (allconversations[data.from] === undefined)
				allconversations[data.from] = [];
			allconversations[data.from].push({
				'from': data.from,
				'message': '<button>join</button>',
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
		printallConversations("other");
		elemcontainer.scrollTop = elemcontainer.scrollHeight;
	}
	
	function closeChat() {
		liveChat.style.display = "none";
		ChatButton.style.display = "flex";
		const privatewith = document.getElementById('selectFriend');
		const lock = document.getElementById('lock');
		privatewith.style.display = 'none';
		lock.style.display = 'none';
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

	blocked.addEventListener('click', function(event) {
		block_friend(event);
	});

	// receiveMessage();
}

function create_locked_btn(friendName)
{
	const btn_locked = document.getElementById('lock');
	if (friendName)
		btn_locked.style.display = 'block';
	else
		btn_locked.style.display = 'none';

}


function loadBar(event) {
	if (event.type === 'click') {  // Fix: change to check for 'click' event type
		// event.preventDefault();
		link = document.createElement("a");
		const privatewith = document.getElementById('selectFriend');
		const lock = document.getElementById('lock');
		privatewith.style.display = 'block';
		lock.style.display = 'block';

		var friendName = event.target.textContent;

		// Correct the link, add http:// to make it a valid URL
		link.href = "/profil/" + friendName + "/";
		link.textContent = friendName;
		if (link)
			create_locked_btn(friendName);

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

// function pageFriend(event) {
// 		var url = event.target.href;
// 		window.location.href = url;  // Voir avec les urls et les views car ca marche pas
// }

// function alreadyfriend(inputValue) {
// 	for (let i = 0; i < friendlist.length; i++) {
// 		if (friendlist[i] === inputValue) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

// function notindatabase(inputValue) {
// 	for (let i = 0; i < friendlist.length; i++) {
// 		if (friendlist[i] === inputValue) {
// 			return false;
// 		}
// 	}
// 	return true;
// }

async function addFriends(event, elemcontainer) {
	if (event.key === 'Enter') {
		event.preventDefault();
		
		var inputValue = document.getElementById('addFriends').value;
		
		const user = await fetch('/authe/api/me/')
		.then(response => response.json())
		const relation = await fetch(`/chat/relationships/${user.id}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
			},
			body: JSON.stringify({
				'username': inputValue,
				'status': 'friend',
			}),
		})
		.then(response => response.json(), )
		.then(data => {
		if (data.relations === "friend")
		{
				fetch(`/authe/api/users/${data.target}/`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
					},
				})
				.then(response => response.json())
				.then(data => {
					var newFriend = document.createElement("button");
					newFriend.dataset.friend = inputValue;
					newFriend.classList.add("friend");
					newFriend.textContent = inputValue;
					if (data.is_online === true)
					{
						newFriend.style.color = "lime";
						newFriend.style.fontWeight = "bold";
					}
					else
					{
						newFriend.style.color = "red";
						newFriend.style.fontWeight = "normal";
					}
					elemcontainer.appendChild(newFriend);
					if (elemcontainer == null)
						return;
					newFriend.addEventListener('click', function(event) {
						loadBar(event, inputValue);
					});
						
					document.getElementById('addFriends').value = '';

					document.getElementById('addFriends').placeholder = "Add a friend";
					
					elemcontainer.scrollTop = elemcontainer.scrollHeight;
				});
		
		}
		else
		{
			document.getElementById('addFriends').value = '';
			if (data.message == 'Already friend')
				document.getElementById('addFriends').placeholder = "Already friend";
			else if (data.message == 'You cannot be friends with yourself.')
				document.getElementById('addFriends').placeholder = "it's you";
			else
				document.getElementById('addFriends').placeholder = "User not found";
		}
	})
}}


document.addEventListener('DOMContentLoaded', () => {
	liveChat();
	
	document.body.addEventListener('keyup', function(event) {
		if (event.key === 'Enter' && document.getElementById('selectFriend').textContent !== '') {
			sendMessage();
		}
	});
});

export {link , liveChat, allconversations}