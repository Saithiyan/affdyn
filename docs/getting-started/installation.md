# Guide d'installation

Ce guide vous aidera à installer et configurer l'API Affichage Dynamique sur votre système.

## Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- Docker (optionnel, pour le déploiement conteneurisé)

## Installation avec Docker (Recommandé)

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-repo/affichage-dynamique.git
   cd affichage-dynamique
   ```

2. **Construire et démarrer les conteneurs**
   ```bash
   docker compose up -d
   ```

   L'application sera disponible sur :
   - Frontend : http://localhost:8080
   - API : http://localhost:3000

## Installation manuelle

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-repo/affichage-dynamique.git
   cd affichage-dynamique
   ```

2. **Installer les dépendances du backend**
   ```bash
   cd backend
   npm install
   ```

3. **Installer les dépendances du frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Éditez le fichier `.env` avec vos paramètres.

5. **Démarrer le backend**
   ```bash
   cd ../backend
   npm run dev
   ```

6. **Démarrer le frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```

## Structure des fichiers

```
affichage-dynamique/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── styles/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Vérification de l'installation

1. **Vérifier l'API**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   Vous devriez recevoir :
   ```json
   {
       "success": true,
       "data": {
           "status": "healthy",
           "version": "1.0.0"
       }
   }
   ```

2. **Vérifier le frontend**
   - Ouvrez http://localhost:8080 dans votre navigateur
   - Vous devriez voir l'interface utilisateur

## Configuration

Pour plus de détails sur la configuration, consultez le [guide de configuration](./configuration.md).

## Dépannage

### Problèmes courants

1. **L'API ne démarre pas**
   - Vérifiez que le port 3000 n'est pas déjà utilisé
   - Vérifiez les variables d'environnement

2. **Le frontend ne se connecte pas à l'API**
   - Vérifiez que l'API est bien en cours d'exécution
   - Vérifiez la configuration CORS dans le backend

3. **Erreurs Docker**
   - Vérifiez que Docker est bien installé et en cours d'exécution
   - Essayez de reconstruire les images : `docker compose build --no-cache`

### Logs

- **Logs backend** : `docker compose logs -f backend`
- **Logs frontend** : `docker compose logs -f frontend`

## Support

Si vous rencontrez des problèmes :

1. Consultez la [documentation complète](../README.md)
2. Vérifiez les [problèmes connus](../guides/troubleshooting.md)
3. Ouvrez une issue sur le dépôt du projet
