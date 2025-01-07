function loadBtn() {
    document.addEventListener('click', () => {
        changeToTournament();
    });
}

function changeToTournament() {
    // bouton Pong
    const elemcontainerpong = document.getElementById('btn-tournament-pong');
    const checkpong = elemcontainerpong?.querySelector('input[type="checkbox"]');
    if (checkpong == null) {
		return;
	}

    if (checkpong.checked) {
        const pongbtn = elemcontainerpong.querySelector('a');
        pongbtn.setAttribute("href", "/games/pong/tournament/");
        pongbtn.textContent = "Play Pong Tournament";
    } else {
        const pongbtn = elemcontainerpong.querySelector('a');
        pongbtn.setAttribute("href", "/games/pong/");
        pongbtn.textContent = "Play Pong";
    }

    // bouton Space
    const elemcontainerspace = document.getElementById('btn-tournament-space');
    const checkspace = elemcontainerspace?.querySelector('input[type="checkbox"]');
    if (checkspace == null) {
		return;
	}

    if (checkspace.checked) {
        const spacebtn = elemcontainerspace.querySelector('a');
        spacebtn.setAttribute("href", "/games/spaceinvaders/tournament/");
        spacebtn.textContent = "Play Space Battle Tournament";
    } else {
        const spacebtn = elemcontainerspace.querySelector('a');
        spacebtn.setAttribute("href", "/games/spaceinvaders/");
        spacebtn.textContent = "Play Space Battle";
    }
}

export { loadBtn };
