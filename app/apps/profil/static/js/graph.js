function buildGraphScore(scores, canvas, context) {
    /*var max = Math.max.apply(null, scores);
    var min = Math.min.apply(null, scores);
    var range = max - min;
    var margin = 10;
    var width = canvas.width - 2 * margin;
    var height = canvas.height - 2 * margin;
    context.beginPath();*/
    context.fillStyle = 'rgb(0, 0, 255)';
    context.fillRect(100, 5, canvas.width - 105, canvas.height - 10);
/*    context.moveTo(margin, margin + height);
    for (var i = 0; i < scores.length; i++) {
        var x = margin + i * width / scores.length;
        var y = margin + height - (scores[i] - min) * height / range;
        context.lineTo(x, y);
    }
    context.stroke();*/
}

async function display_graph(){

    async function getUserName() {
		const response = await fetch('/authe/api/me/');
		const data = await response.json();
		return data.username;
	}
    const canvas = document.getElementById('PongClassic');
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(200, 0, 0)';
    var user = await getUserName();
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
        const response = await fetch('/games/all_game/');
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
    context.fillRect(10, canvas.height - (games_pong_casu_solo_win / games_pong_casu_solo) * canvas.height, 30, canvas.height);
    context.fillRect(50, canvas.height - ((games_pong_casu_solo - games_pong_casu_solo_win) / games_pong_casu_solo) * canvas.height, 30, canvas.height);

    //build the graph
    buildGraphScore(games_space_score_all, canvas, context);
    console.log(games_space_score_all);

    
}

export { display_graph };
