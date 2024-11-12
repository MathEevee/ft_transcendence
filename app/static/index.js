const allPage = {
    "/pong/": loadPong
    
}



function loadPage(path){
    if (path === '/pong/')
        loadPong();
};

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        // event.
        if (event.target.tagName === 'A' && event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('/' )){
            // fetch(event.target.href);
            fetchAndReplaceContent = async() => {
                const response = await fetch(event.target.getAttribute('href'));
                // console.log(response);
                const content = await response.text();
                // console.log(content);
                history.pushState({}, '', response.url);
                document.body.innerHTML = content;
                loadPage(event.target.getAttribute('href'));
                console.log(event.target.getAttribute('href'));
                return (content);
            }
            event.preventDefault();
            fetchAndReplaceContent();
            return;
        }
    });
    // document.addEventListener('popstate', (event) => {
        // ICI FAIRE EN SORTE DE LOAD LA PAGE PRECEDENTE
    // })
});