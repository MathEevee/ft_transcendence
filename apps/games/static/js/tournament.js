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

async function displayPlayerTournament()
{
	const response = await fetch('/authe/api/tournaments/');
	const data = await response.json();
	const tabplayers = document.getElementById('games-table');
	const players = new Set();

	if (data.length > 0)
	{
		data.forEach((tournament) => {
			if (tournament.game === window.location.pathname.split('/')[2])
			{
				tournament.players.forEach((player) => {
					if (players.has(player) === false)
					{
						players.add(player);
						const row = document.createElement('tr');
						const cell = document.createElement('td');
						const text = document.createTextNode(player);
						const teamcell = document.createElement('td');
						const team = document.createTextNode(randomTeamName());

						cell.appendChild(text);
						teamcell.appendChild(team);
						row.appendChild(cell);
						row.appendChild(teamcell);
						tabplayers.appendChild(row);
					}
				});
			}
		});
	}
}

export async function setupPlayerList()
{
	const joinButton = document.getElementById('add-player');
	const tabplayers = document.getElementById('games-table');
	const startButton = document.getElementById('start-tournament');
	const players = new Set();
	displayPlayerTournament();

	let username = await getUserName();

	//put the player in the tournament db
	joinButton.addEventListener('click', () => {
		if (players.has(username) === false)
		{
			players.add(username);
			const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
			console.log(csrftoken);
			fetch('/authe/api/tournaments/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken,
				},
				body: JSON.stringify(
					{
						"id": Math.floor(Math.random() * 1000),
						"game": window.location.pathname.split('/')[2],
						"players": Array.from(players),
						"status": "waiting",
						"created_at": new Date().toISOString(),
					}
				),
			}).then(() => {
				const row = document.createElement('tr');
				const cell = document.createElement('td');
				const text = document.createTextNode(username);
				const teamcell = document.createElement('td');
				const team = document.createTextNode(randomTeamName());

				cell.appendChild(text);
				teamcell.appendChild(team);
				row.appendChild(cell);
				row.appendChild(teamcell);
				tabplayers.appendChild(row);
			}
			).catch(err => console.error(`Error adding player to tournament: ${err}`));
		}
	});

	startButton.addEventListener('click', () => {
		//todo send request to add in db the match history
	});
}
