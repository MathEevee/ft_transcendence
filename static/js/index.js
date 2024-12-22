import { loadSpaceInvadersGame } from "/static/js/spaceInvadeur.js" 
import { loadPong } from "/static/js/pong.js"
import { loadPongMulti } from "/static/js/pongMulti/pongMulti.js"
import { PongTournament } from "/static/js/pongMulti/PongTournament.js"
import { loadBtn } from "/static/js/tournament.js"

const allPage = {
    "/games/pong/local/": loadPong,
    "/games/pong/solo/": loadPong,
    "/games/pong/online/": loadPongMulti,
    "/games/spaceinvaders/" : loadSpaceInvadersGame,
    "/games/pong/tournament/" : PongTournament,
    "/games/" : loadBtn,
    // "/games/": loadGames,
    // "/games/pong/": loadPongMenu,
}

// import { draw } from "/static/spacedraw.js";
// import { update } from "/static/spaceupdate.js";

function loadPage(path){
    // console.log('Loading page:', path);
    // console.log('Loading function:', allPage[path]);
    if (allPage[path])
        allPage[path]();
    else if (allPage[path + '/'])
        allPage[path + '/']();
};

function loadGames(){};

function loadPongMenu(){};

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
    //add a condition to check if is log, with var can't open auth42
    // console.log("console : ",window.location.pathname);
    // loadPage(window.location.pathname);
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('/' )){
            fetchAndReplaceContent = async() => {
                const response = await fetch(event.target.getAttribute('href'),{mode: 'no-cors'});
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
