async function getUsers() {
    try {
        const response = await fetch('/api/users/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        console.log(users); // Affiche les données récupérées
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
}

// Appelle la fonction pour récupérer les données
getUsers();
