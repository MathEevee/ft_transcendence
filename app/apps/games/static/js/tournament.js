import { allconversations } from "/static/js/chatbox.js";

function loadTournament()
{

const startButton = document.getElementById('start-tournament');
const inviteButton = document.getElementById('player-name');
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsURL = `${wsProtocol}//${window.location.host}/ws/chat/`;
const socket = new WebSocket(wsURL);

let teamname = ["Patron", "Polygone", "Gravier", "Rempart", "Philentropes", "Poussière", "Poussin", "Poulet", "Noix", "Balle", "Parchemin", "Chaudron", "Café", "Cafard", "Protéïne"];
let teamadjective = ["Furieux", "Livide", "Avide", "Granuleux", "Marant", "Etourdie", "Furtif", "Mystèrieux", "Intriguant", "Fou", "Dingue", "Cinglé", "Barré", "Bizarre", "Etrange", "Curieux", "Ridicule", "Insolite", "Inhabituel", "Original", "Excentrique", "Extraordinaire", "Fantaisiste", "Farfelu", "Inouï", "Inouïe", "Insensé", "Invraisemblable", "Incongru", "Incroyable", "Inimaginable", "Décomplexé", "Délirant", "Déjanté", "Dément", "musclé", "puissant", "robuste", "solide", "costaud", "résistant", "vif", "alerte", "agile", "rapide", "Boulémique"];

function randomTeamName()
{
	return (teamname[Math.floor(Math.random() * teamname.length)] + " " + teamadjective[Math.floor(Math.random() * teamadjective.length)]);
}

const teamName = randomTeamName();
const tournamentId = window.location.pathname.split('/')[2] === 'pong';
let players = new Set();

async function getUserName() {
	const response = await fetch('/authe/api/me/');
	const data = await response.json();
	return data.username;
}

async function displayPlayerTournament()
{
	const response = await fetch('/authe/api/tournaments/');
	const data = await response.json();
	const tabplayers = document.getElementById('games-table');

	for (let i = 0; i < data.length; i++)
	{
		if (data[i].type_pong === tournamentId)
		{
			for (let j = 0; j < data[i].player_entries.length; j++)
				players.add(data[i].player_entries[j]);

			players = Array.from(players);
			for (let j = 0; j < players.length; j++)
			{
				const row = document.createElement('tr');
				const cell = document.createElement('td');
				const text = document.createTextNode(players[j].player.username);
				const teamcell = document.createElement('td');
				const team = document.createTextNode(players[j].team_name);

				cell.appendChild(text);
				teamcell.appendChild(team);
				row.appendChild(cell);
				row.appendChild(teamcell);
				tabplayers.appendChild(row);

				if (players[j].is_host)
				{
					cell.style.color = 'yellow';
					teamcell.style.color = 'yellow';
					if (players[j].player.username === await getUserName())
						startButton.style.display = 'block';
				}
			}
		}
	}
}

function startTournoi()
{
	const playersList = Array.from(players);
	if (playersList.length < 8)
	{
		console.log('Not enough players');
		return;
	}
	const matchList = [];
	const winnerList = [];
	const finalList = [];
	let finalWinner;

	for (let i = 0; i < playersList.length; i++)
	{
		for (let j = i + 1; j < playersList.length; j++)
		{
			matchList.push({
				'player1': playersList[i].player.username,
				'player2': playersList[j].player.username,
				'winner': null,
			});
		}
	}
}

async function checkPlayer(playername)
{
	if (playername === await getUserName())
		return false;
	const response = await fetch('/authe/api/users/');
	const data = await response.json();
	for (let i = 0; i < data.length; i++)
	{
		if (data[i].username === playername)
		{
			players.forEach(player => {
				if (player.player.username === playername)
					return false;
			});
			return true;
		}
	}
	return false;
}

async function setupPlayerList()
{
	const joinButton = document.getElementById('add-player');
	const tabplayers = document.getElementById('games-table');
	const startButton = document.getElementById('start-tournament');

	startButton.style.display = 'none';
	displayPlayerTournament();

	let username = await getUserName();
	setTimeout(() => {
		players.forEach(player => {
			if (player.player.username === username)
			{
				joinButton.disabled = true;
				joinButton.style.backgroundColor = 'grey';
				joinButton.style.color = 'black';
			}
		} );
	}, 10);

	//put the player in the tournament db
	joinButton.addEventListener('click', () => {
			console.log(tournamentId);
			const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
			fetch('/authe/api/tournaments/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken,
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

					console.log(players);

				}
			})
			.catch(err => {
				joinButton.disabled = true;
				console.error(`Error adding player to tournament: ${err}`);
			});
	});
	
	startButton.addEventListener('click', () => {

		// console.log(players.length);
		if (!allconversations["other"])
			allconversations["other"] = [];
		allconversations["other"].push({
			'from': 'Tournament',
			'message': 'The tournament is starting',
		});
		for (let i = 0; i < players.length; i++)
		{
			socket.send(JSON.stringify({
				'to': players[i].player.username,
				'message': 'The tournament is starting',
			}));
		}
		//todo send request to start the tournament
		//todo send request to add in db the match history
		startTournoi();
	});

	inviteButton.addEventListener('keypress', async (e) => {
		if (e.key === 'Enter')
		{
			let playername = inviteButton.value;
			console.log((playername));
			if (await checkPlayer(playername))
			{
				inviteButton.value = '';

				if (!allconversations[playername])
					allconversations[playername] = [];
				allconversations[playername].push({
					'from': 'You',
					'message': 'Invite ' + playername + ' to join the tournament',
				});
				socket.send(JSON.stringify({
					'to': playername,
					'message': 'Invating you to join the tournament to : ' + (tournamentId ? 'Pong' : 'Space Battle'),
					'is_invite': true,
					'tournament': true,
				}));
			}
			else
				console.log('Player not found');
		}
	});
}

setupPlayerList();

}

export { loadTournament };