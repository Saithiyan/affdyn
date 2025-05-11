# Documentation de Référence de l'API

## Introduction

L'API Affichage Dynamique est une API RESTful qui permet de gérer des configurations d'affichage et des boutons interactifs. Elle utilise JSON pour les formats de requête et de réponse.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentification

L'API ne nécessite pas d'authentification pour le moment, mais il est recommandé d'en implémenter une pour la production.

## Format des réponses

Toutes les réponses sont au format JSON avec la structure suivante :

### Succès
```json
{
    "success": true,
    "data": {
        // Les données de la réponse
    }
}
```

### Erreur
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Description de l'erreur"
    }
}
```

## Endpoints disponibles

### Configurations
- [GET /configs](./configurations.md#liste-des-configurations)
- [POST /configs](./configurations.md#créer-une-configuration)
- [GET /configs/:id](./configurations.md#détails-dune-configuration)
- [PUT /configs/:id](./configurations.md#modifier-une-configuration)
- [DELETE /configs/:id](./configurations.md#supprimer-une-configuration)

### Boutons
- [GET /buttons](./buttons.md#liste-des-boutons)
- [POST /buttons](./buttons.md#créer-un-bouton)
- [GET /buttons/:id](./buttons.md#détails-dun-bouton)
- [PUT /buttons/:id](./buttons.md#modifier-un-bouton)
- [DELETE /buttons/:id](./buttons.md#supprimer-un-bouton)

### Exécution
- [POST /execute/:buttonId](./execution.md#exécuter-un-bouton)

## Pagination

Pour les endpoints qui retournent des listes, la pagination est supportée via les paramètres de requête :

- `page`: Numéro de la page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 10, max: 100)

Exemple :
```
GET /api/v1/buttons?page=2&limit=20
```

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400  | Requête invalide |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |

Pour plus de détails sur les codes d'erreur spécifiques, consultez la [documentation sur la gestion des erreurs](../guides/error-handling.md).
