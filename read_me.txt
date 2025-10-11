# Agir Safely

Application mobile (Expo/React Native) et backend (Express/MongoDB) pour la sécurité au travail: gestion des accidents, EPI, produits chimiques, maintenance, maladies professionnelles et prises de rendez-vous.

- Shell web minimal via Next.js 13 (App Router) qui rend l’app mobile: [app/page.tsx](app/page.tsx) → [App.tsx](App.tsx)
- Service API côté mobile: [src/services/api.ts](src/services/api.ts)
- Backend Node/Express/MongoDB: [backend/server.js](backend/server.js)

## Fonctionnalités principales

- Authentification JWT (inscription/connexion) et profil utilisateur
- Accidentologie
  - Liste et création d’accidents: [src/screens/AccidentologyScreen.tsx](src/screens/AccidentologyScreen.tsx), [src/screens/AddAccidentScreen.tsx](src/screens/AddAccidentScreen.tsx)
- EPI (PPE)
  - Catalogue, détails, signalement de dommages, enregistrement d’utilisation: [src/screens/PPEScreen.tsx](src/screens/PPEScreen.tsx), [src/screens/PPEDetailScreen.tsx](src/screens/PPEDetailScreen.tsx)
- Produits chimiques
  - Listing + FDS (PDF), fiches détail: [src/screens/ChemicalProductsScreen.tsx](src/screens/ChemicalProductsScreen.tsx), [src/screens/ProductDetailScreen.tsx](src/screens/ProductDetailScreen.tsx), données PDF [src/data/pdfs.js](src/data/pdfs.js)
- Maintenance des équipements
  - Détail, interventions, export/partage de rapport: [src/screens/MaintenanceScreen.tsx](src/screens/MaintenanceScreen.tsx), [src/screens/EquipmentDetailScreen.tsx](src/screens/EquipmentDetailScreen.tsx)
- Maladies professionnelles
  - Référentiel, test guidé, prise de RDV: [src/screens/OccupationalDiseasesScreen.tsx](src/screens/OccupationalDiseasesScreen.tsx), [src/screens/DiseaseTestScreen.tsx](src/screens/DiseaseTestScreen.tsx), [src/screens/AppointmentScreen.tsx](src/screens/AppointmentScreen.tsx)
- Débogage/diagnostic: [src/screens/DebugScreen.tsx](src/screens/DebugScreen.tsx)

Backend: endpoints REST (auth, accidents, EPI, produits chimiques, maladies, RDV) + seeds réalistes: [backend/seed.js](backend/seed.js).  
Docs de déploiement: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md), [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md).

## Technologies utilisées

- Mobile/web:
  - Expo + React Native (TypeScript) — point d’entrée [App.tsx](App.tsx)
  - React Navigation (stack/tab), AsyncStorage, @expo/vector-icons
  - Expo FileSystem/Sharing (export/partage) → exemples dans [src/screens/EquipmentDetailScreen.tsx](src/screens/EquipmentDetailScreen.tsx)
  - Next.js 13 (App Router) pour l’enrobage web: [app/layout.tsx](app/layout.tsx), [app/page.tsx](app/page.tsx)
- Backend:
  - Node.js, Express: [backend/server.js](backend/server.js)
  - MongoDB + Mongoose (modèles: PPE, Accidents, Produits, Maladies, RDV)
  - JWT, bcrypt, CORS, dotenv
- Outils:
  - TypeScript, EAS/Expo, Tailwind config (web), scripts PowerShell pour déploiement

## Architecture

- Mobile (Expo RN): écrans sous [src/screens](src/screens), contexte auth: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx), appels API: [src/services/api.ts](src/services/api.ts)
- Backend (Express/MongoDB): serveur [backend/server.js](backend/server.js), seed [backend/seed.js](backend/seed.js), modèles Mongoose (ex. [backend/models/PPE.js](backend/models/PPE.js))

## Démarrage rapide

1) Backend
- Variables d’environnement (créer backend/.env):
  - MONGODB_URI, JWT_SECRET, PORT
- Installer et lancer:
  - cd backend && npm install
  - npm run dev (dev) ou npm start (prod)
- (Optionnel) Peupler la DB:
  - node seed.js — crée des données, y compris l’utilisateur de test

2) Mobile (Expo)
- Installer les dépendances à la racine:
  - npm install ou pnpm install
- Lancer l’app:
  - npx expo start
- Config API: l’URL backend est utilisée par [src/services/api.ts](src/services/api.ts)

Comptes de test (seed)
- Email: test@example.com
- Mot de passe: password123
(Source: impression console en fin de [backend/seed.js](backend/seed.js))

## Endpoints API

Résumé des routes (auth, accidents, EPI, produits chimiques, maladies, rendez-vous) dans:
- [MONGODB-SETUP-SUMMARY.md](MONGODB-SETUP-SUMMARY.md)
- [backend/README-MONGODB.md](backend/README-MONGODB.md)

Exemples côté mobile via le service API: [src/services/api.ts](src/services/api.ts).

## Déploiement

- Render: [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)
- Railway: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md), script: [deploy-backend.ps1](deploy-backend.ps1)

## Dossiers clés

- Mobile: [src/screens](src/screens), [src/services/api.ts](src/services/api.ts)
- Backend: [backend/server.js](backend/server.js), [backend/seed.js](backend/seed.js)
- Web shell: [app/page.tsx](app/page.tsx), [app/layout.tsx](app/layout.tsx)