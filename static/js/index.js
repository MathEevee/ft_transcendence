import { loadSpaceInvadersGame } from "/static/js/spaceInvadeur.js" 
console.log("space fc", loadSpaceInvadersGame)

const allPage = {
    // "/games/pong/local": loadPong,
    // "/games/pong/online": loadPongMulti,
    // "/": loadWelcome,
    "/games/spaceinvaders/" : loadSpaceInvadersGame,
    // "/games/": loadGames,
    // "/games/pong/": loadPongMenu,
}

// import { draw } from "/static/spacedraw.js";
// import { update } from "/static/spaceupdate.js";

function loadPage(path){
    console.log('Loading page:', path);
    console.log('Loading function:', allPage[path]);
    if (allPage[path])
        allPage[path]();
};


function loadWelcome(){};

function loadGames(){};

function loadPongMenu(){};

document.addEventListener('DOMContentLoaded', () => {
    console.log("console : ",window.location.pathname);
    loadPage(window.location.pathname);
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('/' )){
            var fetchAndReplaceContent = async() => {
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
            fetchAndReplaceContent();
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
