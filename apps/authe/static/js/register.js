document.addEventListener('DOMContentLoaded', () => {
    var buttonContainer = document.getElementById('avatar-selection');
    
    var elems = buttonContainer.getElementsByClassName('Avatar');
    
    
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener('click', function(event) {
            for (var j = 0; j < elems.length; j++)
                elems[j].classList.remove('active');
            event.target.classList.add('active');
            console.log(event);
        });
    }

});