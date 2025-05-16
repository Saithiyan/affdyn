const ui = {
    // Éléments DOM
    configsList: document.getElementById('configs-list'),
    buttonsList: document.getElementById('buttons-list'),
    notificationContainer: document.getElementById('notification-container'),

    showNotification(message, type = 'success', duration = 3000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.textContent = message;
        this.notificationContainer.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 400);
        }, duration);
    },

    // État de l'application
    activeConfigId: null,
    toggleState: 'off',

    // Initialisation
    async init() {
        // Configurer l'événement de changement de configuration
        this.configsList.addEventListener('change', (e) => {
            const configId = parseInt(e.target.value);
            if (configId) {
                this.handleConfigChange({ id: configId });
            }
        });

        // Charger les configurations
        try {
            const configs = await api.getConfigs();
            if (configs.length > 0) {
                this.displayConfigs(configs);
                this.configsList.value = configs[0].id;
                await this.handleConfigChange({ id: configs[0].id });
            }
        } catch (error) {
            console.error('Erreur lors du chargement des configurations:', error);
        }
    },

    // Créer une option de configuration
    createConfigOption(config) {
        const option = document.createElement('option');
        option.value = config.id;
        option.textContent = config.name;
        return option;
    },

    // Créer un bouton
    createButton(button) {
        const buttonElement = document.createElement('button');
        buttonElement.className = 'dynamic-button';
        buttonElement.textContent = button.name;
        buttonElement.dataset.id = button.id;
        buttonElement.dataset.isToggle = button.isToggle || false;

        // Définir la couleur initiale du bouton
        if (button.isToggle) {
            buttonElement.style.backgroundColor = this.toggleState === 'on' ? '#4CAF50' : '#FF0000';
            buttonElement.style.color = '#FFFFFF';
            buttonElement.textContent = this.toggleState === 'on' ? 'ON' : 'OFF';
        } else {
            buttonElement.style.backgroundColor = '#FFFFFF';
            buttonElement.style.color = '#000000';
        }

        // Appliquer les dimensions du bouton avec les minimums requis
        if (button.style && button.style.width) {
            const width = Math.max(100, button.style.width);
            buttonElement.style.width = `${width}px`;
        }
        if (button.style && button.style.height) {
            const height = Math.max(50, button.style.height);
            buttonElement.style.height = `${height}px`;
        }

        buttonElement.onclick = async () => {
            try {
                if (button.isToggle) {
                    // Gérer le bouton toggle ON/OFF
                    this.toggleState = this.toggleState === 'on' ? 'off' : 'on';
                    buttonElement.style.backgroundColor = this.toggleState === 'on' ? '#4CAF50' : '#FF0000';
                    buttonElement.textContent = this.toggleState === 'on' ? 'ON' : 'OFF';
                    
                    if (this.toggleState === 'off') {
                        // Réinitialiser tous les autres boutons en blanc
                        const allButtons = this.buttonsList.querySelectorAll('.dynamic-button:not([data-is-toggle="true"])');
                        allButtons.forEach(btn => btn.style.backgroundColor = '#FFFFFF');
                    }
                } else {
                    // Pour les autres boutons, vérifier si le toggle est ON
                    if (this.toggleState === 'off') {
                        this.showNotification('Le bouton ON/OFF doit être activé pour exécuter ce bouton', 'error');
                        return;
                    }
                    // Un seul bouton actif (jaune) à la fois
                    const allButtons = this.buttonsList.querySelectorAll('.dynamic-button:not([data-is-toggle="true"])');
                    allButtons.forEach(btn => btn.style.backgroundColor = '#FFFFFF');
                    buttonElement.style.backgroundColor = '#FFEB3B';
                }

                const response = await api.executeButton(button.id, button.configid);
                if (response && response.message) {
                    this.showNotification(response.message, 'success');
                }
                console.log('Réponse du script:', response);
            } catch (error) {
                console.error('Erreur lors de l\'exécution du script:', error);
                this.showNotification('Erreur lors de l\'exécution du script', 'error');
            }
        };

        return buttonElement;
    },

    // Afficher les configurations
    displayConfigs(configs) {
        // Sauvegarder les configurations
        this.configs = configs;

        // Vider la liste
        this.configsList.innerHTML = '';

        // Ajouter l'option par défaut
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionner une configuration';
        this.configsList.appendChild(defaultOption);

        // Ajouter les configurations
        configs.forEach(config => {
            const option = this.createConfigOption(config);
            this.configsList.appendChild(option);
        });
    },

    // Afficher les boutons
    displayButtons(buttons) {
        this.buttonsList.innerHTML = '';
        const sortedButtons = buttons.sort((a, b) => a.id - b.id);
        sortedButtons.forEach(button => {
            const buttonElement = this.createButton(button);
            this.buttonsList.appendChild(buttonElement);
        });
    },

    // Gérer le changement de configuration
    async handleConfigChange(config) {
        if (!config) {
            this.buttonsList.innerHTML = '';
            this.activeConfigId = null;
            return;
        }

        this.activeConfigId = config.id;
        try {
            const buttons = await api.getButtonsByConfig(config.id);
            this.displayButtons(buttons);
        } catch (error) {
            console.error('Erreur lors du chargement des boutons:', error);
            alert('Erreur lors du chargement des boutons');
        }
    },

    // Gérer le clic sur un bouton
    async handleButtonClick(button) {
        try {
            await api.executeButton(button.id, this.activeConfigId);
            console.log('Button executed:', button.name);
        } catch (error) {
            console.error('Error executing button:', error);
        }
    },

    editConfig(config) {
        this.showConfigModal(config);
    },

    editButton(button) {
        this.showButtonModal(button);
    },

    async deleteButton(buttonId) {
        if (confirm('Voulez-vous vraiment supprimer ce bouton ?')) {
            await api.deleteButton(buttonId);
            this.refreshButtons();
        }
    },

    showButtonModal(button = null) {
        this.editingButtonId = button ? button.id : null;
        const form = this.buttonForm;

        // Mettre à jour le titre
        document.getElementById('button-modal-title').textContent = 
            button ? 'Modifier le Bouton' : 'Nouveau Bouton';

        // Remplir le formulaire si on modifie un bouton existant
        form.elements['name'].value = button ? button.name : '';
        form.elements['bgcolor'].value = button ? button.style?.bgcolor || '#e0e5ec' : '#e0e5ec';
        form.elements['fontcolor'].value = button ? button.style?.fontcolor || '#333333' : '#333333';
        form.elements['width'].value = button ? button.style?.width || '80' : '80';
        form.elements['height'].value = button ? button.style?.height || '80' : '80';

        // Afficher la modale
        this.buttonModal.classList.add('show');
    },

    showConfigModal(config = null) {
        const form = this.configForm;
        
        // Mettre à jour le titre
        document.getElementById('config-modal-title').textContent = 
            config ? 'Modifier la Configuration' : 'Nouvelle Configuration';

        // Remplir le formulaire si on modifie une configuration existante
        form.elements['name'].value = config ? config.name : '';

        // Afficher la modale
        this.configModal.classList.add('show');
    },

    closeModals() {
        this.configModal.classList.remove('show');
        this.buttonModal.classList.remove('show');
        this.editingButtonId = null;
    },

    async handleConfigSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const configData = {
            name: formData.get('name')
        };

        try {
            if (this.editingConfigId) {
                // Mise à jour d'une configuration existante
                configData.id = this.editingConfigId;
                await api.updateConfig(configData);
            } else {
                // Création d'une nouvelle configuration
                const configs = await api.getConfigs();
                const maxId = configs.reduce((max, config) => Math.max(max, config.id), 0);
                configData.id = maxId + 1;
                await api.createConfig(configData);
            }

            this.closeModals();
            const updatedConfigs = await api.getConfigs();
            this.displayConfigs(updatedConfigs);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la configuration:', error);
            alert('Erreur lors de la sauvegarde de la configuration. Vérifiez la console pour plus de détails.');
        }
    },

    async handleButtonSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const buttonData = {
            name: formData.get('name'),
            configid: this.activeConfigId, // Changé de configId à configid pour correspondre au backend
            style: {
                bgcolor: formData.get('bgcolor'),
                fontcolor: formData.get('fontcolor'),
                width: Math.max(100, parseInt(formData.get('width'))),
                height: Math.max(50, parseInt(formData.get('height')))
            }
        };

        try {
            if (this.editingButtonId) {
                buttonData.id = this.editingButtonId;
                await api.updateButton(buttonData);
            } else {
                // Générer un ID unique pour le nouveau bouton
                const buttons = await api.getButtonsByConfig(this.activeConfigId);
                const maxId = buttons.reduce((max, button) => Math.max(max, button.id), 0);
                buttonData.id = maxId + 1;
                await api.createButton(buttonData);
            }
            this.closeModals();
            this.refreshButtons();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du bouton:', error);
            alert('Erreur lors de la sauvegarde du bouton. Vérifiez la console pour plus de détails.');
        }
    },

    async addConfig() {
        const name = prompt('Nom de la nouvelle configuration:');
        if (name) {
            const newConfig = { name };
            await api.createConfig(newConfig);
            const configs = await api.getConfigs();
            this.displayConfigs(configs);
        }
    },

    async refreshButtons() {
        if (this.activeConfigId) {
            const buttons = await api.getButtonsByConfig(this.activeConfigId);
            this.displayButtons(buttons);
        }
    }
};
