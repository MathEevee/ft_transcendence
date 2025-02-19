function buildGraphScore(scores, canvas, context, scoreMoyen, totalGame) {
    let width = 320;
    let height = canvas.height - 14;
    var i = scores.length - 10;
    var moyenne = scoreMoyen / totalGame;
    context.fillStyle = 'rgb(255, 200, 255, 0.5)';
    let start = 10;
    let end = start + (canvas.height - 20);
    start += 4;
    end -= 4;
    let size = end - start;
    let moyenneSize = size * (moyenne / 5);
    context.fillRect(300, start + (size - moyenneSize), canvas.width - 310, size - (start + (size - moyenneSize) - start) );
    if (i < 0)
        i = 0;
    for (var j = 0; j < scores.length; i++, j++) {
        context.beginPath();
        context.fillStyle = 'white';
        context.strokeStyle = 'white';
        context.arc(width + (j * 28), height - (scores[i] * 14), 2, 0, 2 * Math.PI);
        context.stroke();
    }

    context.beginPath();

    //abcisse
    context.fillStyle = 'rgb(0, 0, 0)';
    context.strokeStyle = 'black';
    context.moveTo(300, height);
    context.lineTo(canvas.width - 10, height);
    context.lineWidth = 1;
    context.stroke();
    //match number
    context.fillStyle = 'rgb(255, 255, 255)';
    context.fillText('1', 290 + 28, height + 14);
    context.fillText('2', 290 + 28 * 2, height + 14);
    context.fillText('3', 290 + 28 * 3, height + 14);
    context.fillText('4', 290 + 28 * 4, height + 14);
    context.fillText('5', 290 + 28 * 5, height + 14);
    context.fillText('6', 290 + 28 * 6, height + 14);
    context.fillText('7', 290 + 28 * 7, height + 14);
    context.fillText('8', 290 + 28 * 8, height + 14);
    context.fillText('9', 290 + 28 * 9, height + 14);
    context.fillText('10', 290 + 28 * 10, height + 14);

    //ordonnée
    context.fillStyle = 'rgb(0, 0, 0)';
    context.strokeStyle = 'black';
    context.moveTo(300, 10);
    context.lineTo(300, canvas.height - 10);
    context.lineWidth = 1;
    context.stroke();
    //point
    context.fillStyle = 'rgb(255, 255, 255)';
    context.fillText('0', 290, canvas.height - 10);
    context.fillText('1', 290, canvas.height - 10 - 14);
    context.fillText('2', 290, canvas.height - 10 - 28);
    context.fillText('3', 290, canvas.height - 10 - 42);
    context.fillText('4', 290, canvas.height - 10 - 56);
    context.fillText('5', 290, canvas.height - 10 - 70);



    context.beginPath();
    var i = scores.length - 10;
    if (i < 0)
        i = 0;
    for (var j = 0; j < scores.length - 1; i++, j++){
        context.fillStyle = 'rgb(255, 255, 255)';
        context.strokeStyle = 'rgb(255, 255, 255)';
        context.moveTo(width + (j * 28), height - (scores[i] * 14));
        context.lineTo(width + ((j + 1) * 28), height - (scores[i + 1] * 14));
    }
    context.lineWidth = 1;
    context.stroke();

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
    console.log(data);
    if (data === null)
        return "Error with the enregistrement of the date";
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

function print_data_game_ia(data, game) {
    const tableBody = document.querySelector('#PongIAHistory tbody');
    // On parcourt chaque jeu et on crée une ligne pour chaque
    const row = document.createElement('tr');

    // Crée la cellule pour le début du jeu
    const typeCell = document.createElement('td');
    if (data.players[0].is_IA === true || data.players[1].is_IA === true)
        typeCell.textContent = 'VS IA';

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
        
    tableBody.appendChild(row);
}

async function print_game_ia(game) {
    
    // Appeler la fonction getGame et utiliser son résultat
    getGame(game.game.id).then(data => {
        console.log('here',data);  // Affiche le résultat une fois la promesse résolue
        print_data_game_ia(data, game);
    });
}

function print_data_game_online_duo(data, game) {
    const tableBody = document.querySelector('#PongHistoryOnline tbody');
    // On parcourt chaque jeu et on crée une ligne pour chaque
    const row = document.createElement('tr');
    const typeCell = document.createElement('td');
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
    var opponent = data.players[0].user;
    if (game.user === data.players[0].user)
        opponent = data.players[1].user;
    opponentCell.textContent = opponent;  // Valeur par défaut si pas de donnée
    row.appendChild(opponentCell);
        
    // Crée la cellule pour le score
    const scoreCell = document.createElement('td');

    scoreCell.textContent = create_score(data) || 'N/A';  // Valeur par défaut si pas de donnée
    if (game.score === 5) {
        scoreCell.style.boxShadow = '0px 0px 10px green, 0px 0px 25px lime';
    } else {
        scoreCell.style.boxShadow = '0px 0px 10px red, 0px 0px 25px darkred';
    }
    row.appendChild(scoreCell);
    tableBody.appendChild(row);
}


async function print_game_online_duo(game) {
    
    // Appeler la fonction getGame et utiliser son résultat
    getGame(game.game.id).then(data => {
        console.log(data);  // Affiche le résultat une fois la promesse résolue
        print_data_game_online_duo(data, game);
    });
}

function draw_win_loose(canvas, context, games, win) {

    context.fillStyle = 'rgb(0, 255, 0)';

    context.fillRect(60, canvas.height - (win /games) * canvas.height, 60, canvas.height);
    context.fillStyle = 'rgb(255, 255, 255)';
    context.font = '20px';
    context.fillText(win / games * 100 + '%', 80, canvas.height - (win / games) * canvas.height - 10);

    context.fillStyle = 'rgb(255, 0, 0)';
    context.fillRect(160, canvas.height - ((games - win) / games) * canvas.height, 60, canvas.height);
    context.fillStyle = 'rgb(255, 255, 255)';
    context.font = '20px';
    context.fillText(((games - win) / games) * 100 + '%', 175, ((games - win) / games) + 10);

}


async function display_graph(){
    const canvas = document.getElementById('PongIA');
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(200, 0, 0)';
    var user = window.location.pathname.split("/")[2];
    var total_games;
    var win;

    
    var games_pong_casu_solo = 0;
    var games_pong_casu_solo_win = 0;
    var games_pong_casu_solo_score = 0;
    var games_pong_casu_solo_all = [];

    var games_pong_casu_duo = 0;
    var games_pong_casu_duo_win = 0;
    var games_pong_casu_duo_score = 0;
    var games_pong_casu_duo_all = [];

    async function getStats() {
        const response = await fetch(`/games/all_game/${user}`);
        const data = await response.json();
        return data;
    }
    var stats = await getStats();
    // total_games = stats.history.length;
    for (var i = 0; i < stats.history.length; i++) {
        if (stats.history[i].game.type === 'Pong 1v1 IA' && stats.history[i].game.tournament === false) {
            games_pong_casu_solo++;
            await print_game_ia(stats.history[i]);
            games_pong_casu_solo_score += stats.history[i].score;
            games_pong_casu_solo_all.push(stats.history[i].score);
            if (stats.history[i].score === 5) {
                games_pong_casu_solo_win++;
            }
        }
        if (stats.history[i].game.type === 'Pong 1v1' && stats.history[i].game.tournament === false) {
            games_pong_casu_duo++;
            await print_game_online_duo(stats.history[i]);
            games_pong_casu_duo_score += stats.history[i].score;
            games_pong_casu_duo_all.push(stats.history[i].score);
            if (stats.history[i].score === 5) {
                games_pong_casu_duo_win++;
            }
        }
    }

    draw_win_loose(canvas, context, games_pong_casu_solo, games_pong_casu_solo_win);




    buildGraphScore(games_pong_casu_solo_all, canvas, context, games_pong_casu_solo_score, games_pong_casu_solo);
    
    //build the graph
    const canvasduo = document.getElementById('PongOnline1v1');
    var context = canvasduo.getContext('2d');
    context.fillStyle = 'rgb(200, 0, 0)';
    context.fillRect(60, canvasduo.height - (games_pong_casu_duo_win / games_pong_casu_duo) * canvasduo.height, 60, canvasduo.height);
    context.fillRect(160, canvasduo.height - ((games_pong_casu_duo - games_pong_casu_duo_win) / games_pong_casu_solo) * canvasduo.height, 60, canvasduo.height);
    buildGraphScore(games_pong_casu_duo_all, canvasduo, context, games_pong_casu_duo_score, games_pong_casu_duo);
    draw_win_loose(canvasduo, context, games_pong_casu_duo, games_pong_casu_duo_win);
}
    



export { display_graph };
