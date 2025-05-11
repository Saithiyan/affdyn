const API_URL = 'http://localhost:3000/api/v1';

const api = {
    baseUrl: API_URL,

    // Récupérer toutes les configurations
    async getConfigs() {
        try {
            const response = await fetch(`${this.baseUrl}/`);
            if (!response.ok) throw new Error('Erreur réseau');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des configurations:', error);
            return [];
        }
    },

    // Récupérer les boutons d'une configuration
    async getButtonsByConfig(configId) {
        try {
            const response = await fetch(`${this.baseUrl}/?config=${configId}`);
            if (!response.ok) throw new Error('Erreur réseau');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des boutons:', error);
            return [];
        }
    },

    // Créer un nouveau bouton
    async createButton(button) {
        try {
            const response = await fetch(`${this.baseUrl}/btnadd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(button)
            });
            if (!response.ok) throw new Error('Erreur réseau');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la création du bouton:', error);
            throw error;
        }
    },

    // Mettre à jour un bouton
    async updateButton(button) {
        try {
            const response = await fetch(`${this.baseUrl}/btnedit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(button)
            });
            if (!response.ok) throw new Error('Erreur réseau');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du bouton:', error);
            throw error;
        }
    },

    // Supprimer un bouton
    async deleteButton(buttonId) {
        try {
            const response = await fetch(`${this.baseUrl}/btndel`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: buttonId, configId: this.activeConfigId })
            });
            if (!response.ok) throw new Error('Erreur réseau');
        } catch (error) {
            console.error('Erreur lors de la suppression du bouton:', error);
            throw error;
        }
    },

    // Créer une nouvelle configuration
    async createConfig(config) {
        try {
            const response = await fetch(`${this.baseUrl}/configadd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
            if (!response.ok) throw new Error('Erreur réseau');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la création de la configuration:', error);
            throw error;
        }
    },

    // Mettre à jour une configuration
    async updateConfig(config) {
        try {
            const response = await fetch(`${this.baseUrl}/configedit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
            if (!response.ok) throw new Error('Erreur réseau');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la configuration:', error);
            throw error;
        }
    },

    // Supprimer une configuration
    async deleteConfig(configId) {
        try {
            const response = await fetch(`${this.baseUrl}/configdel`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: configId })
            });
            if (!response.ok) throw new Error('Erreur réseau');
        } catch (error) {
            console.error('Erreur lors de la suppression de la configuration:', error);
            throw error;
        }
    },

    // Exécuter un bouton
    async executeButton(id, configid) {
        try {
            const response = await fetch(`${this.baseUrl}/btn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, configid }),
            });
            if (!response.ok) throw new Error('Erreur réseau');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de l\'exécution du bouton:', error);
            throw error;
        }
    }
};
