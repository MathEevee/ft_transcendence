const allPage = {
    "/pong/": loadPong,
}



function loadPage(path){
    if (path === '/pong/')
        loadPong();
};

document.addEventListener('DOMContentLoaded', () => {
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
    window.addEventListener('popstate', (event) => {
        fetchAndReplaceContent = async() => {
            history.popState({}, '', response.url);
            const response = await fetch(window.location.pathname);
            const content = await response.text();
            document.body.innerHTML = content;
            loadPage(event.target.getAttribute('href'));
            return (content);
        }
        event.preventDefault();
        fetchAndReplaceContent();
        return;
    });
    

});