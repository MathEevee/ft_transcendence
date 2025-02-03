function buildGraphScore(scores, canvas, context, scoreMoyen, totalGame) {
    /*var max = Math.max.apply(null, scores);
    var min = Math.min.apply(null, scores);
    var range = max - min;
    var margin = 10;
    var width = canvas.width - 2 * margin;
    var height = canvas.height - 2 * margin;
    context.beginPath();*/
    context.fillStyle = 'rgb(0, 0, 255)';
    context.fillRect(300, 10, canvas.width - 310, canvas.height - 20);
    let width = 320;
    let height = canvas.height - 14;
    var i = scores.length - 10;
    if (i < 0)
        i = 0;
    for (var j = 0; j < scores.length; i++, j++) {
        context.beginPath();
        context.arc(width + (j * 28), height - (scores[i] * 14), 2, 0, 2 * Math.PI);
        context.stroke();
    }


    context.beginPath();
    var i = scores.length - 10;
    if (i < 0)
        i = 0;
    for (var j = 0; j < scores.length - 1; i++, j++) {
        context.moveTo(width + (j * 28), height - (scores[i] * 14));
        context.lineTo(width + ((j + 1) * 28), height - (scores[i + 1] * 14));
    }
    context.lineWidth = 1;
    context.stroke();

    var moyenne = scoreMoyen / totalGame;
    context.fillStyle = 'rgb(255, 200, 255, 0.5)';
    let start = 10;
    let end = start + (canvas.height - 20);
    start += 4;
    end -= 4;
    let size = end - start;
    let moyenneSize = size * (moyenne / 5);
    context.fillRect(300, start + (size - moyenneSize), canvas.width - 310, size - (start + (size - moyenneSize) - start) );
}

async function getGame(id) {
    try {
        const response = await fetch(`/games/player/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
            },
        });

        // Vérifier si la réponse est correcte (status 200)
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const text = await response.text();  // Récupérer la réponse sous forme de texte brut

        // Tenter de parser le texte en JSON, si c'est du JSON valide
        const data = JSON.parse(text);
        return data;  // Retourne les données pour les utiliser plus tard
    } catch (error) {
        console.error('Erreur:', error);  // Gestion des erreurs
        return null;  // Retourne null en cas d'erreur
    }
}

function parse_data(data) {
    var date = data.split('T')[0];
    date += '\n';
    date += data.split('T')[1].split('.')[0];
    return date;
}

function create_score(data) {
    var score = '';
    console.log(data.players[0].score)

    score += data.players[0].score;
    score += ' - ';
    score += data.players[1].score;
    return score;
}

function print_data_game(data, game) {
    const tableBody = document.querySelector('#PongIAHistory tbody');
    // On parcourt chaque jeu et on crée une ligne pour chaque
    const row = document.createElement('tr');

    // Crée la cellule pour le début du jeu
    const typeCell = document.createElement('td');
    if (data.players[0].is_IA === true || data.players[1].is_IA === true)
        typeCell.textContent = 'VS IA';
    else
        typeCell.textContent = 'Online';  // Valeur par défaut si pas de donnée
    row.appendChild(typeCell);

    // Crée la cellule pour le début du jeu
    const startCell = document.createElement('td');
    var started = parse_data(game.game.started_at);
    startCell.textContent = started;  // Valeur par défaut si pas de donnée
    row.appendChild(startCell);

    // Crée la cellule pour la fin du jeu
    const endCell = document.createElement('td');
    var ended = parse_data(game.game.ended_at);
    endCell.textContent = ended;  // Valeur par défaut si pas de donnée
    row.appendChild(endCell);

    // Crée la cellule pour l'adversaire
    const opponentCell = document.createElement('td');
    opponentCell.textContent = data.opponent || "VS Axel's AI, it's not a player but it's a bot";  // Valeur par défaut si pas de donnée
    row.appendChild(opponentCell);
        
    // Crée la cellule pour le score
    const scoreCell = document.createElement('td');

    scoreCell.textContent = create_score(data) || 'N/A';  // Valeur par défaut si pas de donnée
    if (data.players[0].score === 5) {
        scoreCell.style.boxShadow = '0px 0px 10px green, 0px 0px 25px lime';
    } else {
        scoreCell.style.boxShadow = '0px 0px 10px red, 0px 0px 25px darkred';
    }
    row.appendChild(scoreCell);
        
    // Ajoute la ligne au corps du tableau
    tableBody.appendChild(row);
}

async function print_game(game) {
    
    // Appeler la fonction getGame et utiliser son résultat
    getGame(game.game.id).then(data => {
        console.log(data);  // Affiche le résultat une fois la promesse résolue
        print_data_game(data, game);
    });
}

async function display_graph(){
    const canvas = document.getElementById('PongIA');
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(200, 0, 0)';
    var user = window.location.pathname.split("/")[2];
    var total_games;
    var win;


    var games_space = 0;
    var games_space_win = 0;
    var games_space_score = 0;
    var games_space_score_all = [];

    var games_pong_casu_solo = 0;
    var games_pong_casu_solo_win = 0;
    var games_pong_casu_solo_score = 0;

    var games_pong_casu_multi = 0;
    var games_pong_casu_multi_win = 0;
    var games_pong_casu_multi_score = 0;

    var games_pong_tournament = 0;
    var games_pong_tournament_win = 0;
    var games_pong_tournament_score = 0;

    // ('Pong 1v1', 'Pong 1v1'),
    // ('Pong team', 'Pong team'),
    // ('Space 1v1', 'Space 1v1'),

    async function getStats() {
        const response = await fetch(`/games/all_game/${user}`);
        const data = await response.json();
        return data;
    }
    var stats = await getStats();
    // total_games = stats.history.length;
    for (var i = 0; i < stats.history.length; i++) {
        if (stats.history[i].game.type === 'Space 1v1') {
            games_space++;
            games_space_score += stats.history[i].score;
            if (stats.history[i].score > 0) {
                games_space_win++;
            }
        }
        if (stats.history[i].game.type === 'Pong 1v1 IA' && stats.history[i].game.tournament === false) {
            games_pong_casu_solo++;
            await print_game(stats.history[i]);
            games_pong_casu_solo_score += stats.history[i].score;
            games_space_score_all.push(stats.history[i].score);
            if (stats.history[i].score === 5) {
                games_pong_casu_solo_win++;
            }
        }
        if (stats.history[i].game.type === 'Pong 1v1' && stats.history[i].game.tournament === false) {
            games_pong_casu_solo++;
            await print_game(stats.history[i]);
            games_pong_casu_solo_score += stats.history[i].score;
            games_space_score_all.push(stats.history[i].score);
            if (stats.history[i].score === 5) {
                games_pong_casu_solo_win++;
            }
        if (stats.history[i].game.type === 'Pong 1v1' && stats.history[i].game.tournament === true) {
            games_pong_tournament++;
            games_pong_tournament_score += stats.history[i].score;
            if (stats.history[i].score === 5) {
                games_pong_tournament_win++;
            }
        }
        if (stats.history[i].game.type === 'Pong team') {
            games_pong_casu_multi++;
            games_pong_casu_multi_score += stats.history[i].score;
            if (stats.history[i].score === 5) {
                games_pong_casu_multi_win++;
            }
        }
    }
    }

    context.fillRect(60, canvas.height - (games_pong_casu_solo_win / games_pong_casu_solo) * canvas.height, 60, canvas.height);
    context.fillRect(160, canvas.height - ((games_pong_casu_solo - games_pong_casu_solo_win) / games_pong_casu_solo) * canvas.height, 60, canvas.height);

    //build the graph
    buildGraphScore(games_space_score_all, canvas, context, games_pong_casu_solo_score, games_pong_casu_solo);

    
}


export { display_graph };
