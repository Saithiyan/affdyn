# Architecture du projet Affichage Dynamique

Ce document détaille l’architecture technique réelle du projet, la structure des dossiers et fichiers, le rôle de chaque composant, le cycle de vie d’un bouton, l’exécution des scripts et la gestion des états.

---

## Vue d’ensemble

Le projet est organisé autour de :
- **Backend** (Node.js/Express + Mongoose) : gestion des configurations, boutons, exécution de scripts PowerShell, sécurité, logs, persistance MongoDB.
- **Frontend** (React) : interface utilisateur web pour piloter les boutons/configurations et visualiser l’état.
- **Orchestration Docker** : déploiement local ou conteneurisé.

---

## Structure des dossiers principaux (réelle)

```
pj-srvapi-affichageDynamique/
├── api/
│   ├── models/
│   │   ├── button.js
│   │   └── config.js
│   ├── scripts/
│   │   ├── aff-dyn-script/...
│   │   └── ScriptDeTest/...
│   └── v1/
│       └── index.js
├── app.js
├── docker-compose.yml (+ variantes backend/frontend)
├── Dockerfile.backend / Dockerfile.frontend
├── front/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── public/
├── docs/
│   └── ... (documentation)
├── package.json / package-lock.json
└── README.md
```

---

## Description détaillée des parties du code

### Backend (`api/`)
- **models/button.js** : Schéma Mongoose du bouton. Un bouton appartient à une configuration (`configid`), possède un nom, un style (couleurs, dimensions), un champ `script` (objet avec `scriptOn/scriptOff` pour les toggles, ou `path`/`main` pour les autres), et des propriétés de toggle (`isToggle`, `state`).
- **models/config.js** : Schéma Mongoose d’une configuration (id, nom).
- **scripts/** : Scripts PowerShell exécutés lors de l’activation d’un bouton (organisés par service ou usage).
- **v1/index.js** : Routeur principal Express pour l’API :
  - Gère les endpoints `/reset`, `/configadd`, `/configedit`, `/configdel`, `/btn`, `/btnadd`, `/btnedit`, `/btndel`, etc.
  - Initialise la base avec une configuration par défaut et 14 boutons (voir mémoire).
  - Exécute les scripts associés aux boutons (gestion ON/OFF, gestion d’états, etc).
  - Gère la logique métier de création, édition, suppression de configurations et boutons.
  - Utilise les modèles Mongoose pour la persistance.
- **app.js** (racine) : Point d’entrée du serveur Express, initialisation API, connexion MongoDB, middlewares globaux.

### Frontend (`front/`)
- **src/components/** : Composants React réutilisables (navigation, boutons dynamiques, etc).
- **src/pages/** : Pages principales (gestion des boutons, configurations, création/édition…).
- **src/services/api.js** : Gestion des appels à l’API backend.
- **src/styles/** : Styles globaux et spécifiques.
- **public/** : Fichiers statiques (index.html…).

### Docker & Orchestration
- **docker-compose.yml** : Définit les services backend et frontend, ports exposés, volumes, variables d’environnement.
- **Dockerfile.backend / Dockerfile.frontend** : Instructions pour builder les images Docker personnalisées pour chaque partie.

---

## Cycle de vie d’un bouton

1. **Création** :
   - Via l’API ou l’interface React, un bouton est créé et rattaché à une configuration.
   - Il reçoit un nom, un style, un script (ou scripts pour toggle), et un état initial (`on`/`off`).
2. **Affichage** :
   - Le frontend récupère la liste des boutons d’une configuration via l’API et les affiche avec leur état (couleur, etc).
3. **Exécution** :
   - Lorsque l’utilisateur clique sur un bouton, le frontend appelle l’API `/btn` ou `/execute`.
   - Le backend vérifie l’état (ex : ON/OFF), exécute le script PowerShell associé, gère les erreurs et retourne le résultat.
   - Pour un bouton toggle, l’état est mis à jour (`on`/`off`) et les autres boutons sont désactivés si besoin.
4. **Mise à jour d’état** :
   - Le backend met à jour l’état du bouton et, pour OFF, réinitialise les autres boutons.
   - Le frontend rafraîchit l’affichage.
5. **Suppression/édition** :
   - Via l’API ou l’interface, un bouton peut être modifié ou supprimé.

---

## Exécution d’un script

- Les scripts sont des fichiers PowerShell stockés dans `api/scripts/`.
- Lorsqu’un bouton est activé, le backend exécute le script via un appel système sécurisé.
- Les sorties (succès, erreurs) sont capturées et renvoyées à l’interface.
- Les scripts peuvent envoyer des commandes UDP à des équipements externes.

---

## Gestion des états (mémoire utilisateur)

- **Bouton ON/OFF** :
  - Possède deux scripts (`scriptOn`, `scriptOff`), un état, et influence l’activation des autres boutons.
  - Vert = ON, Rouge = OFF.
- **Autres boutons** :
  - Jaune = en cours d’exécution, Blanc = inactif.
  - Quand OFF est exécuté, tous les autres boutons sont remis à blanc.
  - Les boutons ne peuvent être activés que si ON est actif.

---

## Schéma de fonctionnement global

1. **L’utilisateur** utilise l’interface React pour piloter les boutons/configurations.
2. **Le frontend** appelle l’API backend pour récupérer, créer, éditer ou supprimer des configurations/boutons, et pour exécuter des scripts.
3. **Le backend** gère la logique métier, la persistance (MongoDB), et exécute les scripts PowerShell.
4. **Les scripts** peuvent envoyer des commandes (ex : UDP) à des équipements externes.
5. **Les états/logs** sont stockés et peuvent être consultés via l’interface.

---

## Pour aller plus loin
- [Guide d’installation](../getting-started/installation.md)
- [Déploiement Docker](../deployment/docker.md)
- [Référence API](../api-reference/README.md)
- [Guide de configuration](../getting-started/configuration.md)

> Pour toute question, consultez la FAQ ou ouvrez une issue sur le dépôt GitHub.
