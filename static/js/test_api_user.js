document.getElementById('loadDataButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/authe/api/users/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('here = ', data); // Affiche les données dans la console
    } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
    }
});