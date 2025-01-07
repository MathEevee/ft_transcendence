import { loadSpaceInvadersGame } from "/static/js/spaceInvadeur.js" 
import { loadPong } from "/static/js/pong.js"
import { loadPongMulti } from "/static/js/pongMulti/pongMulti.js"
import { PongTournament } from "/static/js/pongMulti/PongTournament.js"
import { loadBtn } from "/static/js/games.js"

const allPage = {
    "/games/pong/local/": loadPong,
    "/games/pong/solo/": loadPong,
    "/games/pong/online/": loadPongMulti,
    "/games/spaceinvaders/" : loadSpaceInvadersGame,
    "/games/pong/tournament/" : PongTournament,
    "/games/" : loadBtn,
}

function loadPage(path){
    if (allPage[path])
        allPage[path]();
    else if (allPage[path + '/'])
        allPage[path + '/']();
};

async function fetchAndReplaceContent(event)
{
	const response = await fetch(event.target.getAttribute('href'));
	const content = await response.text();
	history.pushState({}, '', response.url);
	document.body.innerHTML = content;
	console.log(response)
	if (response.ok) {
		liveChat();
		loadPage(event.target.getAttribute('href'));
	}
	return (content);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage(window.location.pathname);
    document.addEventListener('click', (event) => {
        const href = event.target.getAttribute('href');
        if (href && href.includes('/authe/oauth42/'))
            return;
        if ((event.target.tagName === 'A' || event.target.tagName === 'I') && event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('/' )){
            fetchAndReplaceContent = async() => {
                const response = await fetch(event.target.getAttribute('href'),{mode: 'no-cors'});
                const content = await response.text();
                history.pushState({}, '', response.url);
                document.body.innerHTML = content;
                if (response.ok) {
                    liveChat();
                    loadPage(event.target.getAttribute('href'));
                }
                return (content);
            }
            fetchAndReplaceContent(event);
            event.preventDefault();
            return;
        }
    });
    window.addEventListener('popstate', async (event) => {
        event.preventDefault();
        const response = await fetch(window.location.pathname);
        const content = await response.text();
        document.body.innerHTML = content;
        loadPage(window.location.pathname);
    });
});
