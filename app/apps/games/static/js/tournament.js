import { changePage } from "/static/js/index.js";
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

function checkdiff(player, tabplayers)
{
	for (let i = 0; i < tabplayers.rows.length; i++)
	{
		if (player.username === tabplayers.rows[i].cells[0].innerText && player.team_name === tabplayers.rows[i].cells[1].innerText)
			return true;
	}
	return false;
}

async function playeradded(tabplayers)
{
	const response = await fetch('/authe/api/tournaments/');
	const data = await response.json();
	if (data.length === 0)
		return false;
	if (data[0].type_pong === tournamentId)
	{
		if (data[0].player_entries.length !== tabplayers.rows.length - 1)
			return false;
		for (let i = 0; i < data[0].player_entries.length; i++)
		{
			if (checkdiff(data[0].player_entries[i].player, tabplayers))
				return false;
		}
	}
	return true;
}

async function clearPlayerList()
{
	const tabplayers = document.getElementById('games-table');
	for (let i = tabplayers.rows.length - 1; i > 0; i--)
	{
		tabplayers.deleteRow(i);
		players.clear();
	}
}

async function displayPlayerTournament()
{
	if (window.location.pathname !== '/games/pong/tournament/' && window.location.pathname !== '/games/spaceinvaders/tournament/')
		return;
	await clearPlayerList();
	const response = await fetch('/authe/api/tournaments/');
	const data = await response.json();
	const tabplayers = document.getElementById('games-table');

	for (let i = 0; i < data.length; i++)
	{
		if (data[i].type_pong === tournamentId)
		{
			for (let j = 0; j < data[i].player_entries.length; j++)
				players.add(data[i].player_entries[j]);

			let playerss = Array.from(players);
			for (let j = 0; j < playerss.length; j++)
			{
				const row = document.createElement('tr');
				const cell = document.createElement('td');
				const text = document.createTextNode(playerss[j].player.username);
				const teamcell = document.createElement('td');
				const team = document.createTextNode(playerss[j].team_name);

				cell.appendChild(text);
				teamcell.appendChild(team);
				row.appendChild(cell);
				row.appendChild(teamcell);
				tabplayers.appendChild(row);

				if (playerss[j].is_host)
				{
					cell.style.color = 'yellow';
					teamcell.style.color = 'yellow';
					if (playerss[j].player.username === await getUserName())
						startButton.style.display = 'block';
				}
				if (playerss[j].player.username === await getUserName())
				{
					inviteButton.style.display = 'block';
					inviteButton.disabled = false;
				}
			}
		}
	}
}

function startmatchmaking()
{
	if (window.location.pathname !== '/games/pong/tournament/' && window.location.pathname !== '/games/spaceinvaders/tournament/')
		return;
	const playersList = Array.from(players);
	console.log(playersList);
	const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
	fetch('/authe/api/tournaments/matchmaking/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
		body: JSON.stringify(
			{
				players: playersList,
				tournament_id: tournamentId,
			}
		),
	}).then(response => response.json())
	.then(response => {
		if (response.error)
			console.warn(`Error starting matchmaking: ${response.error}`);
		else
		{
			console.log('Matchmaking started');
		}
	})
	.catch(err => {
		console.error(`Error starting matchmaking: ${err}`);
	});
}

async function filltournament(playersList)
{
	let nbplayers = playersList.length;

	const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
	await fetch('/authe/api/tournaments/fill/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
		body: JSON.stringify(
			{
				tournament_id: tournamentId,
				nb_players: nbplayers,
			}
		),
	}).then(response => response.json()).then(response => {
		if (response.error)
			console.warn(`Error filling tournament: ${response.error}`);
	})
	.catch(err => {
		console.error(`Error filling tournament: ${err}`);
	});
	await startmatchmaking();
}

async function startTournoi()
{
	const playersList = Array.from(players);

	console.log("playersList", playersList);
	if (playersList.length < 8)
		await filltournament(playersList);
	else
	{
		setTimeout(async () => {
			await startmatchmaking();
		}, 500);
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

	await displayPlayerTournament();

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
	
					if (tabplayers.rows.length === 1)
					{
						cell.style.color = 'yellow';
						teamcell.style.color = 'yellow';
						startButton.style.display = 'block';
					}
					cell.appendChild(text);
					teamcell.appendChild(team);
					row.appendChild(cell);
					row.appendChild(teamcell);
					tabplayers.appendChild(row);

					joinButton.disabled = true;
					joinButton.style.backgroundColor = 'grey';

					inviteButton.style.display = 'block';
					inviteButton.disabled = false;

					console.log(players);
				}
			})
			.catch(err => {
				joinButton.disabled = true;
				console.error(`Error adding player to tournament: ${err}`);
			});
	});
	
	startButton.addEventListener('click', () => {

		if (!allconversations["other"])
			allconversations["other"] = [];
		allconversations["other"].push({
			'from': 'Tournament',
			'message': 'The ' + (tournamentId ? 'Pong' : 'Space Battle') + ' tournament is starting',
		});
		for (let i = 0; i < players.length; i++)
		{
			socket.send(JSON.stringify({
				'to': players[i].player.username,
				'message': 'The ' + (tournamentId ? 'Pong' : 'Space Battle') + ' tournament is starting',
			}));
		}
		startTournoi();
		setTimeout(() => {
		changePage('/games/'+(tournamentId ? 'pong' : 'spaceinvaders')+ '/online/tournament/', false);
		}, 1000);
		//todo send request to start the tournament
		//todo send request to add in db the match history
	});

	inviteButton.addEventListener('keypress', async (e) => {
		if (e.key === 'Enter')
		{
			let playername = inviteButton.value;
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