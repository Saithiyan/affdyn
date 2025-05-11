const express = require('express');
const router = express.Router();
const Config = require('../models/config');
const Button = require('../models/button');

// Route /ping
router.get('/ping', (req, res) => {
    res.status(200).json({message: 'pong!', date: new Date()});
});

// Route /reset (DEVELOPMENT ONLY)
// router.post('/reset', async (req, res) => {
//     try {
//         await Config.deleteMany({});
//         await Button.deleteMany({});
//         res.status(200).json({ message: 'Database reset successful' });
//     } catch (err) {
//         console.error('Reset error:', err);
//         res.status(500).json({ message: err.message });
//     }
// });
router.post('/reset', async (req, res) => {
    try {
        // Nettoyer la base de données
        await Config.deleteMany({});
        await Button.deleteMany({});

        // Créer les configurations par défaut
        const defaultConfig = await new Config({
            id: 1,
            name: 'Configuration par défaut'
        }).save();

        const secondConfig = await new Config({
            id: 2,
            name: 'Configuration supplémentaire'
        }).save();

        // Créer des boutons pour la configuration par défaut
        const defaultButtons = [
            {
                id: 1,
                configid: 1,
                name: 'Create File Hello.txt',
                script: '../scripts/create_file.py',
                style: {
                    fontcolor: '#FFFFFF',
                    bgcolor: '#2196F3',
                    height: 150,
                    width: 200
                }
            },
            {
                id: 2,
                configid: 1,
                name: 'Delete File Hello.txt',
                script: '../scripts/delete_file.ps1',
                style: {
                    fontcolor: '#FFFFFF',
                    bgcolor: '#4CAF50',
                    height: 200,
                    width: 300
                }
            }
        ];

        // Créer des boutons pour la configuration supplémentaire
        const additionalButtons = [
            {
                id: 3,
                configid: 2,
                name: 'Exécuter tâche A',
                script: './scripts/taskA.sh',
                style: {
                    fontcolor: '#FFFFFF',
                    bgcolor: '#FF5722',
                    height: 50,
                    width: 50
                }
            },
            {
                id: 4,
                configid: 2,
                name: 'Exécuter tâche B',
                script: './scripts/taskB.sh',
                style: {
                    fontcolor: '#FFFFFF',
                    bgcolor: '#9C27B0',
                    height: 50,
                    width: 50
                }
            }
        ];

        // Sauvegarder tous les boutons
        await Button.insertMany([...defaultButtons, ...additionalButtons]);

        res.status(200).json({ 
            message: 'Database initialized with default data',
            configs: [defaultConfig, secondConfig],
            buttons: [...defaultButtons, ...additionalButtons]
        });
    } catch (err) {
        console.error('Reset error:', err);
        res.status(500).json({ message: err.message });
    }
});

// CONFIGURATION :
// Route /
router.get('/', async (req, res) => {
    try {
        const configId = req.query.config;
        if (configId) {
            // Si un ID de configuration est fourni, retourner les boutons de cette configuration
            const buttons = await Button.find({ configid: parseInt(configId) }).sort({ id: 1 });
            res.status(200).json(Array.isArray(buttons) ? buttons : []);
        } else {
            // Sinon, retourner toutes les configurations
            const configs = await Config.find().sort({ id: 1 });
            res.status(200).json(Array.isArray(configs) ? configs : []);
        }
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route /configadd
router.post('/configadd', async (req, res) => {
    try {
        // Vérifier si l'ID existe déjà
        const existingConfig = await Config.findOne({ id: req.body.id });
        if (existingConfig) {
            return res.status(400).json({ 
                message: `Une configuration avec l'ID ${req.body.id} existe déjà` 
            });
        }

        // Créer la nouvelle configuration
        const config = new Config(req.body);
        const savedConfig = await config.save();
        
        res.status(200).json({
            // ...savedConfig.toJSON(),
            message: `Configuration ajoutée avec l'ID ${savedConfig.id}`,
            date: new Date()
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Route /configedit?num=1
router.put('/configedit', (req, res) => {

    Config.findOneAndUpdate(
        { id: req.body.id }, // Recherche la configuration avec l'id correspondant
        req.body, // Mise à jour des données de la configuration
        { new: true } // Cette option permet de retourner le document après la mise à jour
    )
        .then((updatedConfig) => { // S'exécute quand la Promise est résolue
            console.log(updatedConfig); // Affiche la configuration mise à jour
            if (!updatedConfig) {    // Si la configuration n'est pas trouvée
                return res.status(404).json({ message: 'Configuration not found' }); // Retourne une erreur
            }
            res.status(200).json({ // Retourne la configuration mise à jour
                // ...updatedConfig.toJSON(), // Déploie toutes les propriétés de updatedConfig
                message: `configuration modifiée`, // Ajoute ces nouvelles propriétés
                date: new Date()
            });
        })
        .catch(err => { // S'exécute si une erreur survient
            console.log(err);
        res.status(500).json({ message: err.message }); // Retourne une erreur avec le message d'erreur
    });
});

// Route /configdel?config=1
router.delete('/configdel', (req, res) => {
    Config.findOneAndDelete({ id: req.body.id })
        .then((config)=>{
            if (!config) {
                return res.status(404).json({ message: 'Configuration not found' });
            }
            res.status(200).json({
                // ...config.toJSON(),
                message: `configuration supprimée`,
                date: new Date()
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err.message });
        });
});




// BOUTONS :
// Route /btns/config/:configid - Récupère les boutons d'une configuration
router.get('/btns/config/:configid', async (req, res) => {
    try {
        const configId = parseInt(req.params.configid);
        const buttons = await Button.find({ configid: configId }).sort({ id: 1 });
        res.status(200).json(Array.isArray(buttons) ? buttons : []);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route /btns
router.get('/btns', async (req, res) => {
    try {
        const buttons = await Button.find().sort({ configid: 1, id: 1 });
        res.status(200).json(Array.isArray(buttons) ? buttons : []);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route /btn
router.post('/btn', async (req, res) => {
    try {
        // Trouver le bouton avec l'id ET le configid
        const button = await Button.findOne({ 
            id: req.body.id,
            configid: req.body.configid
        });
        if (!button) {
            return res.status(404).json({ message: 'Bouton non trouvé' });
        }

        // Vérifier que le chemin du script existe
        if (!button.script) {
            return res.status(400).json({ message: 'Aucun script défini pour ce bouton' });
        }

        try {
            const { spawn } = require('child_process');
            const path = require('path');
            const scriptPath = path.resolve(__dirname, button.script);
            
            // Déterminer le type de script en fonction de l'extension
            const ext = path.extname(scriptPath).toLowerCase();
            let scriptProcess;

            if (ext === '.py') {
                scriptProcess = spawn('python', [scriptPath]);
            } else if (ext === '.sh') {
                scriptProcess = spawn('sh', [scriptPath]);
            } else if (ext === '.ps1') {
                // Exécuter PowerShell avec les bons paramètres
                scriptProcess = spawn('powershell.exe', [
                    '-NoProfile',
                    '-NonInteractive',
                    '-ExecutionPolicy', 'Bypass',
                    '-File', scriptPath
                ]);
            } else if (ext === '.bat' || ext === '.cmd') {
                scriptProcess = spawn('cmd', ['/c', scriptPath]);
            } else {
                throw new Error('Type de script non supporté');
            }

            // Capturer la sortie
            let output = '';
            let errorOutput = '';

            scriptProcess.stdout.on('data', (data) => {
                const text = data.toString();
                console.log('Script output:', text);
                output += text;
            });

            // Capturer les erreurs
            scriptProcess.stderr.on('data', (data) => {
                const text = data.toString();
                console.error('Script error:', text);
                errorOutput += text;
            });

            // Attendre la fin de l'exécution
            await new Promise((resolve, reject) => {
                scriptProcess.on('close', (code) => {
                    console.log('Script exit code:', code);
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Script terminé avec le code ${code}\nSortie: ${output}\nErreur: ${errorOutput}`));
                    }
                });

                scriptProcess.on('error', (err) => {
                    console.error('Script process error:', err);
                    reject(err);
                });
            });

            res.status(200).json({
                message: `Script ${button.script} exécuté avec succès`,
                output: output,
                error: errorOutput,
                date: new Date()
            });
        } catch (scriptError) {
            console.error('Erreur lors de l\'exécution du script:', scriptError);
            res.status(500).json({ 
                message: 'Erreur lors de l\'exécution du script',
                error: scriptError.message 
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Route /btnadd
router.post('/btnadd', async (req, res) => {
    try {
        // Vérifier si l'ID du bouton existe déjà pour cette configuration
        const existingButton = await Button.findOne({ 
            id: req.body.id,
            configid: req.body.configid
        });

        if (existingButton) {
            return res.status(400).json({ 
                message: `Un bouton avec l'ID ${req.body.id} existe déjà pour cette configuration` 
            });
        }

        // Chercher la configuration
        const config = await Config.findOne({ id: req.body.configid });
        if (!config) {
            return res.status(404).json({ message: 'Configuration non trouvée' });
        }

        // Créer le bouton
        const button = new Button({
            ...req.body,
            configObjectId: config._id
        });

        // Sauvegarder le bouton
        const savedButton = await button.save();
        
        res.status(200).json({
            // ...savedButton.toJSON(),
            message: `Bouton ajouté avec l'ID ${savedButton.id} pour la configuration ${savedButton.configid}`,
            date: new Date()
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Route /btnedit
router.put('/btnedit', (req, res) => {
    Button.findOneAndUpdate( // Recherche le bouton avec l'ID numérique
        { id: req.body.id }, 
        req.body, // Mise à jour des données du bouton
        { new: true } // Retourne le bouton après la mise à jour
    )
        .then((updatedButton) => { // S'exécute quand la Promise est résolue
            console.log(updatedButton); 
            if (!updatedButton) { // Si le bouton n'est pas trouvé
                return res.status(404).json({ message: 'Bouton non trouvé' });
            }
            res.status(200).json({ // Retourne le bouton modifié
                // ...updatedButton.toJSON(), // Déploie toutes les propriétés de updatedButton
                message: 'Bouton modifié', // Ajoute ces nouvelles propriétés
                date: new Date()    // Ajoute la date de la mise à jour
            });
        })
        .catch(err => { // S'exécute si une erreur survient
            console.log(err);
            res.status(500).json({ message: err.message }); // Retourne une erreur avec le message d'erreur
        });
});

// Route /btndel
router.delete('/btndel', (req, res) => {
    // Recherche le bouton avec l'ID ET le configid
    Button.findOneAndDelete({ 
        id: req.body.id,
        configid: req.body.configid
    })
        .then((button) => { // S'exécute quand la Promise est résolue
            if (!button) { // Si le bouton n'est pas trouvé
                return res.status(404).json({ message: 'Bouton non trouvé' });
            }
            res.status(200).json({ // Retourne le bouton supprimé
                // ...button.toJSON(), // Déploie toutes les propriétés de button
                message: 'Bouton supprimé', // Ajoute ces nouvelles propriétés
                date: new Date()    // Ajoute la date de la suppression
            });
        })
        .catch(err => { // S'exécute si une erreur survient
            console.log(err);
            res.status(500).json({ message: err.message }); // Retourne une erreur avec le message d'erreur
        });
});



module.exports = router; 





/* 
 * Page d'acceuil :
 * Configuration page bouton :
 * - Un menu déroulant qui affiche les différents configurations enregistrées que l'on peut selectionner
 * Récupération des données de la configuration selectionnée (bouton, script, parametres d'affichage du bouton (police,couleur du bg, etc..))
 * - Un bouton "crée une configuration" pour ajouter une configuration
 * - Un bouton "Enregistrer" dans le formulaire qui permet de sauvegarder la configuration selectionnée dans la bdd
 * - Un bouton "Supprimer" qui permet de supprimer la configuration selectionnée de la bdd
 * Boutons :
 * - Le Bouton lui même qui exécute un script en backend
 * - Un bouton "Ajouter un bouton" qui permet d'ajouter un bouton dans la configuration selectionnée
 * - Un bouton "Modifier le bouton" qui permet de modifier un bouton de la configuration selectionnée
 * - Un bouton "Supprimer le bouton" qui permet de supprimer un bouton de la configuration selectionnée
 * 
 * 
 * ROUTES :
 * Route /  Méthode get :
 * Il faut une route / qui est la page d'accueil, qui récupere les différents boutons de la configuration 1 par defaut ou de la configuration selectionnée
 * en vérifiant si la route contient : ?config=1 ou ?config=2 ou ?config=3 , ?config=0 c'est par défaut à vérifier avec un opérateur OR
 * 
 * Configuration page bouton :
 * Route /configadd  Méthode post :
 * Pour ajouter une configuration
 * 
 * Route /configdel?num=1  Méthode delete :
 * Pour supprimer une configuration
 * 
 * Boutons :
 * Route /btn?btnid=1  Méthode post/get  ou route /?config=1&btnid=1 
 * Pour executer le script correspondant au bouton selectionné
 * 
 * Route /btnadd?btnid=1  Méthode post
 * Pour ajouter un bouton, avec ses paramétres et le script correspondant dans la configuration selectionnée
 * 
 * Route /btnedit?btnid=1  Méthode put
 * Pour modifier un bouton, avec ses paramétres et le script correspondant dans la configuration selectionnée
 * 
 * Route /btndel?btnid=1  Méthode delete
 * Pour supprimer le boutton selectionné
 * 
 * 
 * 
 * BDD:
 * object : config
 * {
 *      id : number
 *      name : string
 * }
 * 
 * object : button
 * {
 *      id : number
 *      configid : number
 *      name : string
 *      style : array {
 *          fontcolor : string
 *          bgcolor : string
 *          height : number
 *          width : number
 *      }
 *      script : string
 * }
 */