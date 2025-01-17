// import { loadAccount } from "/static/js/account.js";
import { liveChat } from "/static/js/chatbox.js";

const allPage = {
    "/games/pong/local/": () => import("/static/js/pong.js").then(module => module.loadPong()),
    "/games/pong/solo/": () => import("/static/js/pong.js").then(module => module.loadPong()),
    "/games/pong/online/": () => import("/static/js/pongMulti/pongMulti.js").then(module => module.loadPongMulti()),
    "/games/spaceinvaders/": () => import("/static/js/spaceInvadeur.js").then(module => module.loadSpaceInvadersGame()),
    "/games/pong/tournament/": async () => {
        const { PongTournament } = await import("/static/js/pongMulti/PongTournament.js");
        const { loadTournament } = await import("/static/js/tournament.js");
        PongTournament();
        loadTournament();
    },
    "/games/spaceinvaders/tournament/": () => import("/static/js/tournament.js").then(module => module.loadTournament()),
    "/games/": () => import("/static/js/games.js").then(module => module.loadBtn()),
};

function loadPage(path) {
    // if (path.includes('account/'))
    //     loadAccount();
    if (allPage[path]) {
        allPage[path]().catch(err => console.error(`Error loading page script: ${err}`));
    } else if (allPage[path + '/']) {
        allPage[path + '/']().catch(err => console.error(`Error loading page script: ${err}`));
    }
    if (path.substring(0, 7) === "/authe/")
        document.getElementById('chat').style.display = 'none';
}

async function changePage(path, disableHistory) {
    const response = await fetch(path);
    if (response.ok) {
        const content = await response.text();
        if (!disableHistory)
            history.pushState({}, '', response.url);
        document.body.innerHTML = content;
        liveChat();
        loadPage(path);
    }
}

async function fetchAndReplaceContent(event) {
    try {
        await changePage(event.target.getAttribute('href'));
    } catch (err) {
        console.error(`Error fetching content: ${err}`);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadPage(window.location.pathname);

    document.addEventListener('click', (event) => {
        const href = event.target.getAttribute('href');
        if (href && href.includes('/authe/oauth42/'))
            return;
        if ((event.target.tagName === 'A' || event.target.tagName === 'I') && href && href.startsWith('/' )){
            event.preventDefault();
            fetchAndReplaceContent(event);
        }
    });

    window.addEventListener('popstate', async () => {
        const response = await fetch(window.location.pathname);
        if (response.ok) {
            const content = await response.text();
            document.body.innerHTML = content;
            loadPage(window.location.pathname);
        }
    });
});

export { changePage }