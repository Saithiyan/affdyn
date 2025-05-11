# Déploiement avec Docker

Ce guide explique comment déployer l'API Affichage Dynamique en utilisant Docker et Docker Compose.

## Architecture Docker

Le projet utilise une architecture à deux conteneurs :

1. **Backend (API Node.js)**
   - Image : Node.js 18
   - Port : 3000
   - Volume pour les logs

2. **Frontend (Application Web)**
   - Image : Node.js 18
   - Port : 8080
   - Build statique servi par Nginx

## Fichiers Docker

### Dockerfile Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"]
```

### Dockerfile Frontend

```dockerfile
# Étape de build
FROM node:18-alpine as builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGIN=http://localhost:8080
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  logs:
```

## Déploiement

### 1. Construction des images

```bash
# Construction des images
docker compose build

# Construction sans cache
docker compose build --no-cache
```

### 2. Démarrage des conteneurs

```bash
# Démarrage en arrière-plan
docker compose up -d

# Démarrage avec logs
docker compose up
```

### 3. Vérification

```bash
# État des conteneurs
docker compose ps

# Logs des conteneurs
docker compose logs -f

# Logs spécifiques
docker compose logs -f backend
docker compose logs -f frontend
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Backend
BACKEND_PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://localhost:8080
MAX_EXEC_TIME=300000
MAX_CONCURRENT=5
LOG_LEVEL=info

# Frontend
FRONTEND_PORT=8080
VITE_API_URL=http://localhost:3000
```

### Configuration Nginx (frontend)

```nginx
server {
    listen 8080;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Compression gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache statique
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

## Maintenance

### Mise à jour des conteneurs

```bash
# Arrêt des conteneurs
docker compose down

# Pull des nouvelles images
docker compose pull

# Reconstruction et redémarrage
docker compose up -d --build
```

### Sauvegarde des données

```bash
# Sauvegarde des logs
docker run --rm \
  -v affichage-dynamique_logs:/source \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/logs-$(date +%Y%m%d).tar.gz -C /source .
```

### Nettoyage

```bash
# Suppression des conteneurs arrêtés
docker compose down

# Suppression des volumes
docker compose down -v

# Nettoyage des images non utilisées
docker image prune -a
```

## Surveillance

### Surveillance des conteneurs

```bash
# Statistiques en temps réel
docker stats

# Processus dans les conteneurs
docker compose top
```

### Surveillance des logs

```bash
# Tous les logs
docker compose logs -f

# Logs avec timestamp
docker compose logs -f --timestamps

# Logs des dernières 24h
docker compose logs -f --since 24h
```

## Dépannage

### Problèmes courants

1. **Le backend ne démarre pas**
   ```bash
   # Vérifier les logs
   docker compose logs backend
   
   # Vérifier la configuration
   docker compose config
   ```

2. **Le frontend ne se connecte pas au backend**
   - Vérifier la variable VITE_API_URL
   - Vérifier la configuration CORS

3. **Problèmes de performance**
   ```bash
   # Vérifier l'utilisation des ressources
   docker stats
   
   # Vérifier les logs d'erreur
   docker compose logs -f backend | grep ERROR
   ```

### Redémarrage des services

```bash
# Redémarrer un service spécifique
docker compose restart backend

# Redémarrer tous les services
docker compose restart
```

## Sécurité

1. **Mise à jour des images**
   ```bash
   # Vérifier les mises à jour
   docker compose pull
   
   # Reconstruire avec les dernières images
   docker compose up -d --build
   ```

2. **Restriction des ports**
   - Exposer uniquement les ports nécessaires
   - Utiliser un réseau Docker interne

3. **Limites de ressources**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '0.50'
             memory: 512M
   ```

## Production

Pour un déploiement en production :

1. Utilisez un registry Docker privé
2. Configurez un reverse proxy (ex: Traefik)
3. Mettez en place un monitoring
4. Utilisez des secrets Docker pour les données sensibles
5. Configurez des sauvegardes automatiques
