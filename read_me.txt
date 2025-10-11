# Agir Safely

Solution de sécurité au travail combinant une application mobile et un backend. Elle couvre la gestion des accidents, des équipements de protection individuelle (EPI), des produits chimiques, de la maintenance des équipements, des maladies professionnelles et des rendez-vous santé.

## Fonctionnalités

- Authentification sécurisée (JWT) et gestion du profil
- Accidentologie: déclaration, suivi, classification, statut et mesures préventives
- EPI: inventaire, disponibilité, état, assignation, signalement de dommages, historique d’utilisation
- Produits chimiques: consultation, catégories, niveaux de danger, affichage des FDS (PDF), consignes et pictogrammes
- Maintenance équipements: interventions, planification, journal des opérations, export/partage de rapports
- Maladies professionnelles: référentiel, auto-évaluation guidée, délais indicatifs, conseils et orientation
- Rendez-vous: demande/planification de visites médicales avec rappels
- Questions/Réponses: publication anonyme avec pièces jointes (images/PDF)
- Notifications locales et rappels
- Partage de documents et génération de rapports

## Technologies utilisées

- Mobile:
  - Expo, React Native, TypeScript
  - Navigation (stack/onglets), stockage local
  - Sélection d’images et de documents (images/PDF), système de fichiers et partage
  - Icônes vectorielles, zones sûres et composants UI modernes
- Backend:
  - Node.js, Express
  - MongoDB avec Mongoose
  - Authentification JWT, hachage des mots de passe (bcrypt), CORS, variables d’environnement
- Outils:
  - Expo/EAS pour builds mobiles
  - Scripts de déploiement et de vérification
  - Hébergement cloud (ex. Render/Railway)

## Architecture (vue d’ensemble)

- Application mobile consommant une API REST sécurisée (JWT)
- Base de données NoSQL modélisant: utilisateurs, accidents, EPI, produits chimiques, équipements, maladies, rendez-vous
- Validation des données, gestion des erreurs, statuts et historisation
- Gestion/affichage de documents (PDF) et export/partage de rapports

## Prérequis

- Node.js LTS et gestionnaire de paquets (npm/pnpm)
- Instance MongoDB (locale ou cloud)
- Compte Expo (tests et builds)

## Configuration

- Variables d’environnement côté serveur:
  - MONGODB_URI
  - JWT_SECRET
  - PORT
- Côté mobile: configurer l’URL de base de l’API (développement/production)

## Démarrage rapide

1) Backend
- Installer les dépendances
- Définir les variables d’environnement
- Démarrer en développement ou production
- (Optionnel) Initialiser des données de test

2) Application mobile
- Installer les dépendances à la racine
- Renseigner l’URL de l’API
- Démarrer avec Expo et tester sur appareil ou émulateur

## Déploiement

- Déployer le backend sur un service Node (Render)
- Définir les variables d’environnement en production
- Activer HTTPS, surveiller logs et métriques
- Distribuer l’application mobile via Expo/EAS ou builds natifs

## Sécurité et bonnes pratiques

- Protéger les secrets (JWT, accès base de données)
- Mettre à jour régulièrement les dépendances
- Valider et assainir toutes les entrées
- Activer CORS de manière restrictive et ajouter du rate limiting
- Sauvegardes régulières, stratégie de logs/monitoring

## Permissions (mobile)

- Accès réseau pour l’API
- Stockage pour lecture/écriture de documents
- Caméra/galerie pour pièces jointes
- Notifications locales pour rappels