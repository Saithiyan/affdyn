# Premiers pas avec l'API

Ce guide vous aidera à faire vos premiers pas avec l'API Affichage Dynamique en créant une configuration simple et en ajoutant des boutons interactifs.

## 1. Vérifier l'installation

Assurez-vous que l'API est en cours d'exécution :

```bash
curl http://localhost:3000/api/v1/health
```

## 2. Créer une configuration

### Requête

```bash
curl -X POST http://localhost:3000/api/v1/configs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ma-premiere-config",
    "description": "Ma première configuration"
  }'
```

### Réponse attendue

```json
{
    "success": true,
    "data": {
        "id": "config123",
        "name": "ma-premiere-config",
        "description": "Ma première configuration",
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:00:00.000Z"
    }
}
```

## 3. Ajouter un bouton

### Requête

```bash
curl -X POST http://localhost:3000/api/v1/buttons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hello World",
    "config_id": "config123",
    "command": "echo Hello World",
    "style": {
        "bgcolor": "#e0e5ec",
        "color": "#333333",
        "width": "150px",
        "height": "50px"
    }
  }'
```

### Réponse attendue

```json
{
    "success": true,
    "data": {
        "id": "button123",
        "name": "Hello World",
        "config_id": "config123",
        "command": "echo Hello World",
        "style": {
            "bgcolor": "#e0e5ec",
            "color": "#333333",
            "width": "150px",
            "height": "50px"
        },
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:00:00.000Z"
    }
}
```

## 4. Tester le bouton

### Requête

```bash
curl -X POST http://localhost:3000/api/v1/execute/button123
```

### Réponse attendue

```json
{
    "success": true,
    "data": {
        "execution_id": "exec123",
        "button_id": "button123",
        "status": "completed",
        "output": "Hello World",
        "started_at": "2025-05-10T21:00:00.000Z",
        "completed_at": "2025-05-10T21:00:01.000Z"
    }
}
```

## 5. Interface utilisateur

1. Ouvrez votre navigateur et accédez à http://localhost:8080
2. Vous devriez voir votre configuration "ma-premiere-config"
3. Cliquez sur le bouton "Hello World" pour l'exécuter

## Exemples pratiques

### 1. Configuration avec plusieurs boutons

```javascript
// 1. Créer la configuration
const config = await fetch('http://localhost:3000/api/v1/configs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "demo-config",
        description: "Configuration de démonstration"
    })
});

// 2. Ajouter des boutons
const buttons = [
    {
        name: "Date",
        command: "date",
        style: { bgcolor: "#4ECDC4" }
    },
    {
        name: "Heure",
        command: "time",
        style: { bgcolor: "#FF6B6B" }
    },
    {
        name: "Système",
        command: "systeminfo",
        style: { bgcolor: "#45B7D1" }
    }
];

for (const button of buttons) {
    await fetch('http://localhost:3000/api/v1/buttons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...button,
            config_id: config.data.id
        })
    });
}
```

### 2. Surveillance des exécutions longues

```javascript
async function executeAndMonitor(buttonId) {
    // 1. Lancer l'exécution
    const execution = await fetch(`http://localhost:3000/api/v1/execute/${buttonId}`, {
        method: 'POST'
    });
    
    const { execution_id } = execution.data;
    
    // 2. Surveiller le statut
    while (true) {
        const status = await fetch(`http://localhost:3000/api/v1/execute/${execution_id}/status`);
        
        if (status.data.status === 'completed' || status.data.status === 'failed') {
            return status.data;
        }
        
        // Attendre 1 seconde avant la prochaine vérification
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
```

## Prochaines étapes

1. Explorez la [documentation complète de l'API](../api-reference/README.md)
2. Apprenez à [gérer les erreurs](../guides/error-handling.md)
3. Découvrez les [bonnes pratiques](../guides/best-practices.md)
4. Consultez les [options de déploiement](../deployment/README.md)
