# API Configurations

## Liste des configurations

Récupère la liste des configurations disponibles.

```
GET /api/v1/configs
```

### Paramètres de requête

| Paramètre | Type    | Description                                    |
|-----------|---------|------------------------------------------------|
| page      | integer | Numéro de la page (défaut: 1)                  |
| limit     | integer | Nombre d'éléments par page (défaut: 10)        |
| search    | string  | Terme de recherche pour filtrer les résultats  |

### Réponse

```json
{
    "success": true,
    "data": {
        "configs": [
            {
                "id": "config123",
                "name": "Configuration 1",
                "description": "Description de la configuration",
                "created_at": "2025-05-10T21:00:00.000Z",
                "updated_at": "2025-05-10T21:00:00.000Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 48,
            "items_per_page": 10
        }
    }
}
```

## Créer une configuration

Crée une nouvelle configuration.

```
POST /api/v1/configs
```

### Corps de la requête

```json
{
    "name": "Nouvelle Configuration",
    "description": "Description de la nouvelle configuration"
}
```

### Champs requis

| Champ       | Type   | Description                        |
|-------------|--------|------------------------------------|
| name        | string | Nom de la configuration            |
| description | string | Description de la configuration    |

### Réponse

```json
{
    "success": true,
    "data": {
        "id": "config123",
        "name": "Nouvelle Configuration",
        "description": "Description de la nouvelle configuration",
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:00:00.000Z"
    }
}
```

## Détails d'une configuration

Récupère les détails d'une configuration spécifique.

```
GET /api/v1/configs/:id
```

### Paramètres de chemin

| Paramètre | Type   | Description                     |
|-----------|--------|---------------------------------|
| id        | string | ID unique de la configuration   |

### Réponse

```json
{
    "success": true,
    "data": {
        "id": "config123",
        "name": "Configuration 1",
        "description": "Description de la configuration",
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:00:00.000Z",
        "buttons": [
            {
                "id": "button123",
                "name": "Bouton 1",
                "style": {
                    "bgcolor": "#e0e5ec",
                    "color": "#333333",
                    "width": "100px",
                    "height": "50px"
                }
            }
        ]
    }
}
```

## Modifier une configuration

Modifie une configuration existante.

```
PUT /api/v1/configs/:id
```

### Paramètres de chemin

| Paramètre | Type   | Description                     |
|-----------|--------|---------------------------------|
| id        | string | ID unique de la configuration   |

### Corps de la requête

```json
{
    "name": "Configuration Modifiée",
    "description": "Nouvelle description"
}
```

### Champs optionnels

| Champ       | Type   | Description                        |
|-------------|--------|------------------------------------|
| name        | string | Nouveau nom de la configuration    |
| description | string | Nouvelle description              |

### Réponse

```json
{
    "success": true,
    "data": {
        "id": "config123",
        "name": "Configuration Modifiée",
        "description": "Nouvelle description",
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:05:00.000Z"
    }
}
```

## Supprimer une configuration

Supprime une configuration existante.

```
DELETE /api/v1/configs/:id
```

### Paramètres de chemin

| Paramètre | Type   | Description                     |
|-----------|--------|---------------------------------|
| id        | string | ID unique de la configuration   |

### Réponse

```json
{
    "success": true,
    "data": {
        "message": "Configuration supprimée avec succès"
    }
}
```

## Codes d'erreur spécifiques

| Code | Message                          | Description                                        |
|------|----------------------------------|----------------------------------------------------|
| 404  | Configuration non trouvée        | L'ID de configuration spécifié n'existe pas       |
| 400  | Nom de configuration invalide    | Le nom fourni ne respecte pas les critères        |
| 409  | Nom de configuration déjà utilisé| Une configuration avec ce nom existe déjà         |
