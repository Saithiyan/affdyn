# API Boutons

## Liste des boutons

Récupère la liste des boutons disponibles.

```
GET /api/v1/buttons
```

### Paramètres de requête

| Paramètre    | Type    | Description                                    |
|-------------|---------|------------------------------------------------|
| page        | integer | Numéro de la page (défaut: 1)                  |
| limit       | integer | Nombre d'éléments par page (défaut: 10)        |
| config_id   | string  | Filtrer par ID de configuration                |
| search      | string  | Terme de recherche pour filtrer les résultats  |

### Réponse

```json
{
    "success": true,
    "data": {
        "buttons": [
            {
                "id": "button123",
                "name": "Bouton 1",
                "config_id": "config123",
                "command": "echo 'Hello World'",
                "style": {
                    "bgcolor": "#e0e5ec",
                    "color": "#333333",
                    "width": "100px",
                    "height": "50px"
                },
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

## Créer un bouton

Crée un nouveau bouton.

```
POST /api/v1/buttons
```

### Corps de la requête

```json
{
    "name": "Nouveau Bouton",
    "config_id": "config123",
    "command": "echo 'Hello World'",
    "style": {
        "bgcolor": "#e0e5ec",
        "color": "#333333",
        "width": "100px",
        "height": "50px"
    }
}
```

### Champs requis

| Champ     | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| name      | string | Nom du bouton                             |
| config_id | string | ID de la configuration parente            |
| command   | string | Commande à exécuter                       |

### Champs optionnels

| Champ     | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| style     | object | Styles visuels du bouton                  |

#### Propriétés de style

| Propriété | Type   | Défaut    | Description                    |
|-----------|--------|-----------|--------------------------------|
| bgcolor   | string | "#e0e5ec" | Couleur de fond               |
| color     | string | "#333333" | Couleur du texte              |
| width     | string | "100px"   | Largeur du bouton             |
| height    | string | "50px"    | Hauteur du bouton             |

### Réponse

```json
{
    "success": true,
    "data": {
        "id": "button123",
        "name": "Nouveau Bouton",
        "config_id": "config123",
        "command": "echo 'Hello World'",
        "style": {
            "bgcolor": "#e0e5ec",
            "color": "#333333",
            "width": "100px",
            "height": "50px"
        },
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:00:00.000Z"
    }
}
```

## Détails d'un bouton

Récupère les détails d'un bouton spécifique.

```
GET /api/v1/buttons/:id
```

### Paramètres de chemin

| Paramètre | Type   | Description                |
|-----------|--------|----------------------------|
| id        | string | ID unique du bouton       |

### Réponse

```json
{
    "success": true,
    "data": {
        "id": "button123",
        "name": "Bouton 1",
        "config_id": "config123",
        "command": "echo 'Hello World'",
        "style": {
            "bgcolor": "#e0e5ec",
            "color": "#333333",
            "width": "100px",
            "height": "50px"
        },
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:00:00.000Z"
    }
}
```

## Modifier un bouton

Modifie un bouton existant.

```
PUT /api/v1/buttons/:id
```

### Paramètres de chemin

| Paramètre | Type   | Description                |
|-----------|--------|----------------------------|
| id        | string | ID unique du bouton       |

### Corps de la requête

```json
{
    "name": "Bouton Modifié",
    "command": "echo 'New Command'",
    "style": {
        "bgcolor": "#ffffff",
        "color": "#000000"
    }
}
```

### Champs optionnels

Tous les champs sont optionnels lors de la modification.

### Réponse

```json
{
    "success": true,
    "data": {
        "id": "button123",
        "name": "Bouton Modifié",
        "config_id": "config123",
        "command": "echo 'New Command'",
        "style": {
            "bgcolor": "#ffffff",
            "color": "#000000",
            "width": "100px",
            "height": "50px"
        },
        "created_at": "2025-05-10T21:00:00.000Z",
        "updated_at": "2025-05-10T21:05:00.000Z"
    }
}
```

## Supprimer un bouton

Supprime un bouton existant.

```
DELETE /api/v1/buttons/:id
```

### Paramètres de chemin

| Paramètre | Type   | Description                |
|-----------|--------|----------------------------|
| id        | string | ID unique du bouton       |

### Réponse

```json
{
    "success": true,
    "data": {
        "message": "Bouton supprimé avec succès"
    }
}
```

## Codes d'erreur spécifiques

| Code | Message                    | Description                                    |
|------|----------------------------|------------------------------------------------|
| 404  | Bouton non trouvé         | L'ID de bouton spécifié n'existe pas         |
| 400  | Nom de bouton invalide    | Le nom fourni ne respecte pas les critères    |
| 400  | Commande invalide         | La commande fournie est invalide             |
| 404  | Configuration non trouvée | L'ID de configuration spécifié n'existe pas  |
