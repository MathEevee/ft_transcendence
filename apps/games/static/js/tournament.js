document.addEventListener('DOMContentLoaded', () => {
    loadBtn();
});

function loadBtn()
{
    loadBtnPong();
    loadBtnSpace();
    document.addEventListener('click', () => {
        changeToTournament();
    });
}

function changeToTournament() {
    const elemcontainerpong = document.getElementById('btn-tournament-pong');
    var checkpong = elemcontainerpong.querySelector('input[type="checkbox"]');
    const elemcontainerspace = document.getElementById('btn-tournament-space');
    var checkspace = elemcontainerspace.querySelector('input[type="checkbox"]');

    if (checkpong.checked) {
        var pongbtn = elemcontainerpong.querySelector('a');
        pongbtn.setAttribute("href", "/games/pong/tournament/");
        pongbtn.textContent = "Play Pong Tournament";
    } else {
        var pongbtn = elemcontainerpong.querySelector('a');
        pongbtn.setAttribute("href", "/games/pong/");
        pongbtn.textContent = "Play Pong";
    }

    if (checkspace.checked) {
        var spacebtn = elemcontainerspace.querySelector('a');
        spacebtn.setAttribute("href", "/games/spaceinvaders/tournament/");
        spacebtn.textContent = "Play Space Battle Tournament";
    } else {
        var spacebtn = elemcontainerspace.querySelector('a');
        spacebtn.setAttribute("href", "/games/spaceinvaders/");
        spacebtn.textContent = "Play Space Battle";
    }
}



function loadBtnPong() {
    var label = document.createElement("label");
    label.textContent = "Mode Tournament : ";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    var pongbtn = document.createElement("a");
    pongbtn.textContent = "Play Pong";
    pongbtn.classList.add("btn-tournament");
    pongbtn.classList.add("btn");
    pongbtn.setAttribute("href", "/games/pong/");

    const elemcontainer = document.getElementById('btn-tournament-pong');
    elemcontainer.appendChild(pongbtn);
    elemcontainer.appendChild(label);
    elemcontainer.appendChild(checkbox);
}

function loadBtnSpace() {
    var label = document.createElement("label");
    label.textContent = "Mode Tournament : ";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    var spaceBtn = document.createElement("a");
    spaceBtn.textContent = "Play Space Battle";
    spaceBtn.classList.add("btn-tournament");
    spaceBtn.classList.add("btn");
    spaceBtn.setAttribute("href", "/games/spaceinvaders/");

    const elemcontainer = document.getElementById('btn-tournament-space');
    elemcontainer.appendChild(spaceBtn);
    elemcontainer.appendChild(label);
    elemcontainer.appendChild(checkbox);
}

export { loadBtn };
