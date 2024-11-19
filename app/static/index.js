const allPage = {
    "/games/pong/local/": loadPong,
    "/": loadWelcome,
    "/games/": loadGames,
    "/games/pong/": loadPongMenu,
    // "/games/spaceinvaders/" : loadSpaceinvaders,
}

function loadPage(path){
    console.log('Loading page:', path);
    if (allPage[path])
        allPage[path]();
};


function loadWelcome(){};

function loadGames(){};

function loadPongMenu(){};

document.addEventListener('DOMContentLoaded', () => {
    loadPage(window.location.pathname);
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('/' )){
            fetchAndReplaceContent = async() => {
                const response = await fetch(event.target.getAttribute('href'));
                const content = await response.text();
                history.pushState({}, '', response.url);
                document.body.innerHTML = content;
                loadPage(event.target.getAttribute('href'));
                return (content);
            }
            event.preventDefault();
            fetchAndReplaceContent();
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
