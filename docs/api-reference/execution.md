# API Exécution

Cette section décrit l'API d'exécution des commandes associées aux boutons.

## Exécuter un bouton

Exécute la commande associée à un bouton spécifique.

```
POST /api/v1/execute/:buttonId
```

### Paramètres de chemin

| Paramètre | Type   | Description                |
|-----------|--------|----------------------------|
| buttonId  | string | ID unique du bouton       |

### Corps de la requête

Aucun corps de requête n'est nécessaire.

### Réponse en cas de succès

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

### Réponse en cas d'exécution longue

Pour les commandes qui prennent plus de temps à s'exécuter :

```json
{
    "success": true,
    "data": {
        "execution_id": "exec123",
        "button_id": "button123",
        "status": "running",
        "started_at": "2025-05-10T21:00:00.000Z"
    }
}
```

## Vérifier le statut d'une exécution

Récupère le statut d'une exécution en cours ou terminée.

```
GET /api/v1/execute/:executionId/status
```

### Paramètres de chemin

| Paramètre    | Type   | Description                     |
|-------------|--------|---------------------------------|
| executionId | string | ID unique de l'exécution       |

### Réponse

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

## États possibles d'une exécution

| État      | Description                                           |
|-----------|-------------------------------------------------------|
| pending   | L'exécution est en attente de démarrage              |
| running   | La commande est en cours d'exécution                 |
| completed | L'exécution s'est terminée avec succès              |
| failed    | L'exécution a échoué                                |
| timeout   | L'exécution a dépassé le temps maximum autorisé     |

## Codes d'erreur spécifiques

| Code | Message                           | Description                                        |
|------|-----------------------------------|----------------------------------------------------|
| 404  | Bouton non trouvé                | L'ID de bouton spécifié n'existe pas             |
| 404  | Exécution non trouvée            | L'ID d'exécution spécifié n'existe pas          |
| 400  | Commande invalide                | La commande associée au bouton est invalide      |
| 500  | Erreur d'exécution               | Une erreur s'est produite pendant l'exécution    |
| 408  | Timeout                          | L'exécution a dépassé le temps limite            |

## Limites et considérations

1. **Timeout**
   - Chaque exécution a une limite de temps de 5 minutes
   - Au-delà, l'exécution est automatiquement arrêtée

2. **Concurrence**
   - Maximum 5 exécutions simultanées par utilisateur
   - Les exécutions supplémentaires sont mises en file d'attente

3. **Sécurité**
   - Certaines commandes système sont restreintes
   - Les commandes sont exécutées dans un environnement isolé

4. **Taille de sortie**
   - La sortie est limitée à 1MB
   - Au-delà, elle est tronquée

## Bonnes pratiques

1. **Vérification du statut**
   - Pour les commandes longues, utilisez l'endpoint de statut
   - Implémentez un mécanisme de polling avec backoff exponentiel

2. **Gestion des erreurs**
   - Vérifiez toujours le champ "success" dans la réponse
   - Gérez les différents codes d'erreur de manière appropriée

3. **Validation**
   - Testez vos commandes avant de les associer à des boutons
   - Validez les sorties attendues
