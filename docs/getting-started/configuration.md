# Guide de Configuration

Ce guide détaille les différentes options de configuration disponibles pour l'API Affichage Dynamique.

## Variables d'environnement

### Backend

| Variable           | Description                           | Défaut        | Requis |
|-------------------|---------------------------------------|---------------|---------|
| PORT              | Port d'écoute de l'API               | 3000          | Non     |
| NODE_ENV          | Environnement (development/production)| development   | Non     |
| CORS_ORIGIN       | Origine autorisée pour CORS          | *             | Non     |
| MAX_EXEC_TIME     | Temps max d'exécution (ms)           | 300000        | Non     |
| MAX_CONCURRENT    | Exécutions simultanées max           | 5             | Non     |
| LOG_LEVEL         | Niveau de log (debug/info/error)     | info          | Non     |

### Frontend

| Variable           | Description                           | Défaut              | Requis |
|-------------------|---------------------------------------|---------------------|---------|
| VITE_API_URL      | URL de l'API                         | http://localhost:3000| Non    |
| PORT              | Port du serveur frontend             | 8080                | Non    |

## Configuration du serveur

### CORS

Le CORS est configuré dans `backend/src/config/cors.js` :

```javascript
module.exports = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

### Sécurité

Configuré dans `backend/src/config/security.js` :

```javascript
module.exports = {
  // Liste des commandes système autorisées
  allowedCommands: [
    'echo',
    'ls',
    'dir',
    // Ajoutez vos commandes ici
  ],

  // Commandes explicitement interdites
  blockedCommands: [
    'rm',
    'del',
    'format',
    // Ajoutez vos restrictions ici
  ]
};
```

## Logging

### Configuration des logs

Dans `backend/src/config/logging.js` :

```javascript
module.exports = {
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  transports: [
    {
      type: 'console'
    },
    {
      type: 'file',
      filename: 'logs/app.log',
      maxSize: '10m',
      maxFiles: '7d'
    }
  ]
};
```

### Niveaux de log

- **error** : Erreurs critiques
- **warn** : Avertissements importants
- **info** : Informations générales
- **debug** : Détails pour le débogage
- **trace** : Traces détaillées (développement)

## Limites et quotas

### Exécution des commandes

```javascript
module.exports = {
  execution: {
    // Temps maximum d'exécution (5 minutes)
    maxTimeout: 300000,
    
    // Nombre maximum d'exécutions simultanées
    maxConcurrent: 5,
    
    // Taille maximum de la sortie (1MB)
    maxOutputSize: 1024 * 1024,
    
    // Intervalle de polling pour le statut (ms)
    pollInterval: 1000
  }
};
```

### Stockage

```javascript
module.exports = {
  storage: {
    // Taille maximum des logs par bouton
    maxLogSize: '100mb',
    
    // Durée de conservation des logs
    logRetention: '30d',
    
    // Nombre maximum de configurations
    maxConfigs: 100,
    
    // Nombre maximum de boutons par configuration
    maxButtonsPerConfig: 50
  }
};
```

## Configuration avancée

### Personnalisation des styles

Le thème par défaut est défini dans `frontend/src/styles/theme.js` :

```javascript
export default {
  colors: {
    primary: '#e0e5ec',
    secondary: '#333333',
    accent: '#2196F3',
    error: '#FF3366'
  },
  
  buttons: {
    defaultSize: {
      width: '100px',
      height: '50px'
    },
    
    borderRadius: '10px',
    
    shadows: {
      normal: '3px 3px 6px #b8b9be, -3px -3px 6px #ffffff',
      pressed: 'inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff'
    }
  }
};
```

### Middleware personnalisé

Vous pouvez ajouter des middlewares personnalisés dans `backend/src/middleware/` :

```javascript
// Exemple de middleware d'authentification
module.exports = async (req, res, next) => {
  try {
    // Votre logique ici
    next();
  } catch (error) {
    next(error);
  }
};
```

## Validation

### Validation des configurations

```javascript
module.exports = {
  config: {
    name: {
      minLength: 3,
      maxLength: 50,
      pattern: '^[a-zA-Z0-9-_]+$'
    },
    description: {
      maxLength: 200
    }
  }
};
```

### Validation des boutons

```javascript
module.exports = {
  button: {
    name: {
      minLength: 2,
      maxLength: 30,
      pattern: '^[a-zA-Z0-9-_]+$'
    },
    command: {
      maxLength: 500
    }
  }
};
```

## Exemple de fichier .env complet

```env
# Environnement
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGIN=http://localhost:8080

# Exécution
MAX_EXEC_TIME=300000
MAX_CONCURRENT=5

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Sécurité
ALLOWED_COMMANDS=echo,ls,dir
BLOCKED_COMMANDS=rm,del,format

# Stockage
MAX_LOG_SIZE=100mb
LOG_RETENTION=30d
MAX_CONFIGS=100
MAX_BUTTONS_PER_CONFIG=50
```
