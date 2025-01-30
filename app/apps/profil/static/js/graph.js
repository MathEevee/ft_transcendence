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
    console.log(start, end);
    start += 4;
    end -= 4;
    console.log(start, end);
    let size = end - start;
    let moyenneSize = size * (moyenne / 5);
    context.fillRect(300, start + (size - moyenneSize), canvas.width - 310, size - (start + (size - moyenneSize) - start) );
}

async function display_graph(){
    const canvas = document.getElementById('PongClassic');
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(200, 0, 0)';
    var user = window.location.pathname.split("/")[2];
    console.log(user);
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
    console.log(stats);
    // total_games = stats.history.length;
    for (var i = 0; i < stats.history.length; i++) {
        console.log(stats.history[i].game);
        if (stats.history[i].game.type === 'Space 1v1') {
            games_space++;
            games_space_score += stats.history[i].score;
            if (stats.history[i].score > 0) {
                games_space_win++;
            }
        }
        if (stats.history[i].game.type === 'Pong 1v1' && stats.history[i].game.tournament === false) {
            games_pong_casu_solo++;
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
    console.log((games_pong_casu_solo_win / games_pong_casu_solo) * canvas.height)

    context.fillRect(60, canvas.height - (games_pong_casu_solo_win / games_pong_casu_solo) * canvas.height, 60, canvas.height);
    context.fillRect(160, canvas.height - ((games_pong_casu_solo - games_pong_casu_solo_win) / games_pong_casu_solo) * canvas.height, 60, canvas.height);

    //build the graph
    buildGraphScore(games_space_score_all, canvas, context, games_pong_casu_solo_score, games_pong_casu_solo);
    console.log(games_space_score_all);

    
}

export { display_graph };
