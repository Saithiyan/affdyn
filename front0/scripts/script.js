// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    try {
        ui.init();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
});