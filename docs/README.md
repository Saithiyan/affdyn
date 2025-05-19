# Documentation complète – Affichage Dynamique

Bienvenue dans la documentation officielle du serveur web **Affichage Dynamique**.

Ce portail centralise l’ensemble des guides, définitions, procédures et bonnes pratiques pour installer, configurer, personnaliser et déployer le serveur, que ce soit en local ou dans un conteneur Docker.

## Sommaire rapide

- [Présentation du projet](#présentation-du-projet)
- [Glossaire & Définitions](#glossaire--définitions)
- [Installation & Démarrage rapide](./getting-started/installation.md)
- [Configuration avancée](./getting-started/configuration.md)
- [Déploiement Docker et production](./deployment/docker.md)
- [Référence API](./api-reference/README.md)
- [FAQ & Dépannage](#faq--dépannage)

---

## Présentation du projet

**Affichage Dynamique** est une solution web permettant de créer et gérer des interfaces de boutons dynamiques, pilotant des scripts ou commandes sur un serveur, avec retour d’état et gestion fine des droits et de la sécurité.

- **Technologies principales** : Node.js (backend), Vue.js (frontend), Docker, PowerShell (scripts personnalisés)
- **Fonctionnalités clés** :
  - Gestion multi-configurations et multi-boutons
  - Exécution sécurisée de scripts (PowerShell, bash, etc.)
  - Retour d’état, logs, gestion des erreurs
  - Déploiement facile (local/Docker)

## Glossaire & Définitions

- **Configuration** : Ensemble structuré de boutons et paramètres associés à un contexte d’utilisation (ex : salle, événement).
- **Bouton** : Élément interactif déclenchant un script ou une commande. Peut être personnalisé (nom, couleur, script associé).
- **Script** : Fichier ou commande exécutée côté serveur lors de l’activation d’un bouton.
- **.env** : Fichier de variables d’environnement permettant de personnaliser le comportement du serveur (ports, sécurité, quotas, etc.).
- **Docker** : Technologie de conteneurisation assurant un déploiement reproductible et isolé.

## Guides principaux

- [Installation pas à pas](./getting-started/installation.md) :
  - Installation locale (Node.js, npm)
  - Installation via Docker/Docker Compose
  - Structure des fichiers, premiers tests
- [Configuration avancée](./getting-started/configuration.md) :
  - Variables personnalisables (avec explications détaillées)
  - Sécurité, quotas, logging, stockage
- [Déploiement Docker](./deployment/docker.md) :
  - Création et personnalisation d’une image Docker
  - Utilisation de `docker-compose.yml` pour un déploiement complet
  - Procédure pour builder, lancer, monitorer et maintenir les conteneurs
- [Référence API complète](./api-reference/README.md) :
  - Endpoints, paramètres, exemples de requêtes/réponses
- [Premiers pas, exemples et cas d’usage](./getting-started/first-steps.md)

## Procédure d’installation rapide

1. **Clonage du dépôt**
   ```sh
   git clone https://github.com/votre-repo/affichage-dynamique.git
   cd affichage-dynamique
   ```

2. **Avec Docker (recommandé)**
   ```sh
   docker compose up -d
   # Frontend : http://localhost:8080
   # API      : http://localhost:3000
   ```

3. **Personnalisation**
   - Copiez `.env.example` en `.env` et adaptez les variables (voir [guide configuration](./getting-started/configuration.md)).
   - Pour Docker, modifiez également les variables d’environnement dans `docker-compose.yml` si besoin.

4. **Vérification**
   - API : `curl http://localhost:3000/api/v1/health`
   - Frontend : ouvrir http://localhost:8080

## Variables personnalisables (exemples)

- **Backend** : `NODE_ENV`, `PORT`, `CORS_ORIGIN`, `MAX_EXEC_TIME`, `LOG_LEVEL`, etc.
- **Frontend** : `VITE_API_URL`, `PORT`
- **Sécurité** : `ALLOWED_COMMANDS`, `BLOCKED_COMMANDS`
- **Voir** : [Configuration détaillée](./getting-started/configuration.md)

## Déploiement Docker/Production : résumé

- Voir [guide Docker](./deployment/docker.md) pour :
  - Construire une image personnalisée
  - Déployer avec Docker Compose
  - Adapter les ports, volumes, variables, logs
  - Procédures de maintenance, sauvegarde, restauration

## Liens utiles

- [FAQ & Dépannage](#faq--dépannage)
- [Bonnes pratiques](./guides/best-practices.md)
- [Sécurité](./deployment/security.md)
- [Production](./deployment/production.md)

## FAQ & Dépannage

- Consultez la section Dépannage dans chaque guide d’installation ou de déploiement.
- Pour toute question, ouvrez une issue sur le dépôt ou contactez le support.

---

**Navigation rapide** :
- [Installation](./getting-started/installation.md) | [Configuration](./getting-started/configuration.md) | [Déploiement Docker](./deployment/docker.md) | [API](./api-reference/README.md)

---

> **Besoin d’aide ?** Consultez la documentation détaillée dans chaque sous-dossier ou ouvrez une issue sur GitHub.
