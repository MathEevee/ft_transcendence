import { liveChat } from "/static/js/chatbox.js";
import { display_graph } from "/static/js/graph.js";

let pageDestructorFn = null;

export function setPageDestructor(fn) {
    pageDestructorFn = fn;
}

const allPage = {
    "/games/pong/local/": () => import("/static/js/pong.js").then(module => module.loadPong()),
    "/games/pong/online/": () => import("/static/js/pong.js").then(module => module.loadPong()),
    "/games/pong/online/tournament/": () => import("/static/js/pong.js").then(module => module.loadPong()),
    "/games/pong/solo/": () => import("/static/js/pong.js").then(module => module.loadPong()),
    "/games/pong/multiplayer/": () => import("/static/js/pongMulti/pongMulti.js").then(module => module .loadPongMulti()),
    "/games/spaceinvaders/": () => import("/static/js/spaceInvadeur.js").then(module => module.loadSpaceInvadersGame()),
    "/games/spaceinvaders/online/tournament/": () => import("/static/js/spaceInvadeur.js").then(module => module.loadSpaceInvadersGame()),
    "/games/pong/tournament/": () => import("/static/js/tournament.js").then(module => module.loadTournament()),
    "/games/spaceinvaders/tournament/": () => import("/static/js/tournament.js").then(module => module.loadTournament()),
    "/games/": () => import("/static/js/games.js").then(module => module.loadBtn()),
};

function loadPage(path) {
    if (allPage[path])
        allPage[path]().catch(err => console.error(`Error loading page script: ${err}`));
    else if (allPage[path + '/'])
        allPage[path + '/']().catch(err => console.error(`Error loading page script: ${err}`));
    else if (path.split("/")[1] == 'profil')
        display_graph();
    if (window.location.pathname.startsWith('/authe/') && window.location.pathname != "/authe/settings/") {
        var chatBtn = document.getElementById('chat')
        if (chatBtn)
            chatBtn.style.display = 'none';
    }
}

async function changePage(path, disableHistory) {
    if (pageDestructorFn) {
        pageDestructorFn();
        pageDestructorFn = null
    }
    const response = await fetch(path);
    if (response.ok) {
        const content = await response.text();
        if (!disableHistory)
            history.pushState({}, '', response.url);
        document.body.innerHTML = content;
        if (!window.location.pathname.startsWith("/authe/") || window.location.pathname == "/authe/settings/")
            liveChat();
        loadPage(path);
    }
}

async function fetchAndReplaceContent(href) {
    try {
        await changePage(href);
    } catch (err) {
        console.error(`Error fetching content: ${err}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage(window.location.pathname);

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return; // pas un lien

        const href = link.getAttribute('href');
        if (!href) return; // pas de href

        if (href.includes('/authe/oauth42/'))
            return;
        if (href === '/admin') {
            window.location.href = href; // Rechargement complet
            return;
        }
        if (href.startsWith('/')) {
            event.preventDefault();
            fetchAndReplaceContent(href);
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

export { loadPage, changePage, fetchAndReplaceContent };