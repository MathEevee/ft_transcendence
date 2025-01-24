import { allconversations } from "/static/js/chatbox.js";

function loadTournament()
{

const startButton = document.getElementById('start-tournament');
const inviteinput = document.getElementById('invite-player');
const socket = new WebSocket(`ws://localhost:8000/ws/chat/`);

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
		{
			if (data[i].type_pong === tournamentId)
			{
				players = data[i].player_entries;
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

async function setupPlayerList()
{
	const joinButton = document.getElementById('add-player');
	const tabplayers = document.getElementById('games-table');
	const startButton = document.getElementById('start-tournament');
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
				}
			})
			.catch(err => {
				joinButton.disabled = true;
				console.error(`Error adding player to tournament: ${err}`);
			});
	});
	
	startButton.addEventListener('click', () => {

		// console.log(players.length);
		for (let i = 0; i < players.length; i++)
		{
			console.log(players[i].player.username);
			allconversations[players[i].player.username] = [];
			allconversations[players[i].player.username].push({
				'from': 'Tournament',
				'message': 'The tournament is starting',
			});
			socket.send(JSON.stringify({
				'to': players[i].player.username,
				'message': 'The tournament is starting',
			}));
		}
		//todo send request to start the tournament
		//todo send request to add in db the match history
		startTournoi();
	});
}

setupPlayerList();

}

export { loadTournament };