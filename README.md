# Webnovel Factory

> Une progressive web app (PWA) de création et de lecture d'histoires assistée par IA

## Description du Projet

Webnovel Factory est une plateforme innovante qui permet aux utilisateurs de créer et lire des histoires collaboratives avec l'aide de l'intelligence artificielle. Le projet propose deux modes d'utilisation :

- **Lecteur** : Accès libre à toutes les histoires publiées par la communauté
- **Lecteur Créateur** : Création d'histoires avec l'IA, système de progression, et publication

## Fonctionnalités Principales

### Mode Non Authentifié (Lecteur)
- Lecture libre de toutes les histoires publiées
- Navigation dans la bibliothèque communautaire
- Aperçu des histoires et épisodes

### Mode Authentifié (Lecteur Créateur)

#### Interactions avec les histoires
- Like et favoris
- Système de commentaires
- Sauvegarde des histoires générées

#### Création d'Histoires (Onboarding)
1. **Définition du titre** de l'histoire
2. **Choix du thème** :
   - Romance
   - Romantasy
   - Fantasy
   - Science-fiction
   - LGBTQIA+
   - Autres sous-genres populaires
   - Option "Je ne sais pas" pour suggestions de l'IA
3. **Définition du cadre** :
   - Protagoniste
   - Antagoniste
   - Personnages secondaires
   - Personnages divers
   - Relations entre personnages
   - Lieux et environnements

#### Système de Progression
- Gain de points d'XP à chaque épisode rédigé
- Pièces virtuelles comme récompenses
- Approche ludique et professionalisante

#### Bibliothèque Personnelle
- Mes créations
- Histoires favorites
- Suivi de progression

#### Publication
- Rendre une histoire disponible à toute la communauté
- Gestion de la visibilité des épisodes

### Navigation
- **NavBar** : Histoires favorites, Créations, Communauté
- Design responsive :
  - PC : Sidebar latérale
  - Mobile : Interface plein écran

## Stack Technique

### Frontend
- **Next.js 15.2.4**
- **TypeScript**
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants UI
- **React Hook Form** + **Zod** pour la validation

### Backend
- **Node.js** avec Next.js API Routes
- **NextAuth v5** pour l'authentification
- **Prisma** comme ORM

### Base de Données
- **PostgreSQL**
- Migration via Prisma

### Intelligence Artificielle
- **Ollama** pour la génération d'histoires

### Authentification
- **Credentials** (email/password)
- **OAuth** (Google, GitHub)
- **Two-Factor Authentication** (2FA) :
  - Email-based
  - OTP (Authenticator app)

### Services Externes
- **Resend** pour l'envoi d'emails

### Progressive Web App (PWA)
- **@ducanh2912/next-pwa** pour la configuration PWA
- **Service Worker** pour le mode hors-ligne
- **Manifest.json** pour l'installation sur mobile/desktop
- **Mise en cache** des ressources statiques et API

## Prérequis

- **Node.js** 18.x ou supérieur
- **PostgreSQL** 14.x ou supérieur
- **pnpm** / **npm** / **yarn**

## Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd ynov-hackaton
```

### 2. Installer les dépendances

```bash
npm install --legacy-peer-deps
# ou
pnpm install
# ou
yarn install
```

**Note** : L'option `--legacy-peer-deps` est nécessaire pour la compatibilité avec React 19 RC et @ducanh2912/next-pwa.

### 3. Configuration de l'environnement

Créer un fichier `.env.local` à la racine :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/webnovel_factory"

# NextAuth
NEXTAUTH_SECRET="votre-secret-aleatoire-genere"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
GITHUB_CLIENT_ID="votre-github-client-id"
GITHUB_CLIENT_SECRET="votre-github-client-secret"

# Email Service
RESEND_API_KEY="votre-cle-api-resend"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Ollama (IA)
OLLAMA_API_URL="http://localhost:11434"
```

### 4. Configuration de la base de données

```bash
# Créer la base de données et appliquer les migrations
npx prisma generate
npx prisma db push

# Optionnel : Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### 5. Configuration d'Ollama

```bash
# Installer Ollama (si pas déjà fait)
# macOS/Linux : https://ollama.ai

# Télécharger un modèle (exemple : llama2)
ollama pull llama2

# Démarrer le serveur Ollama
ollama serve
```

### 6. Lancer le serveur de développement

```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 7. Configuration PWA (optionnel)

Pour activer la PWA, créez vos icônes d'application :

1. Créez ou générez des icônes PNG aux tailles suivantes : 72, 96, 128, 144, 152, 192, 384, 512 pixels
2. Placez-les dans le dossier `public/icons/`
3. Nommez-les : `icon-72x72.png`, `icon-96x96.png`, etc.

**Outils recommandés pour générer les icônes** :
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)

La PWA sera automatiquement activée en production. Elle est désactivée en développement pour faciliter le debugging.

## Structure du Projet

```
ynov-hackaton/
├── app/                          # Next.js App Router
│   ├── (protected)/              # Routes authentifiées
│   │   ├── onboarding/           # Page d'onboarding création histoire
│   │   ├── settings/             # Paramètres utilisateur
│   │   └── ...
│   ├── auth/                     # Pages d'authentification
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
│   └── api/                      # API Routes
│       └── auth/[...nextauth]/   # NextAuth endpoints
├── components/                   # Composants React
│   ├── ui/                       # Composants UI (Shadcn)
│   └── auth/                     # Composants d'authentification
├── lib/                          # Utilitaires et services
│   ├── db.ts                     # Client Prisma
│   ├── auth.ts                   # Helpers d'authentification
│   ├── mail.ts                   # Service d'email
│   └── tokens.ts                 # Génération de tokens
├── actions/                      # Server Actions Next.js
│   ├── login.ts
│   ├── register.ts
│   └── ...
├── data/                         # Couche d'accès aux données
│   ├── user.ts
│   └── ...
├── schemas/                      # Schémas de validation Zod
│   └── index.ts
├── hooks/                        # Custom React Hooks
│   ├── use-current-user.ts
│   └── use-current-role.ts
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Schéma de base de données
├── public/                       # Assets statiques
├── auth.ts                       # Configuration NextAuth
├── auth.config.ts                # Configuration des providers
├── middleware.ts                 # Protection des routes
├── routes.ts                     # Constantes de routes
└── package.json
```

## Schéma de Base de Données (Actuel)

### Modèles Prisma Existants

```prisma
User {
  id                    String (CUID)
  name                  String?
  email                 String? (unique)
  emailVerified         DateTime?
  image                 String?
  password              String?
  role                  UserRole (USER | ADMIN)
  isTwoFactorEnabled    Boolean
  TwoFactorMethod       TwoFactorMethod? (EMAIL | OTP)
  otpSecret             String?
  accounts              Account[]
  TwoFactorConfirmation TwoFactorConfirmation?
}
```

## Scripts Disponibles

```bash
# Développement
npm run dev           # Démarrer le serveur de dev

# Production
npm run build         # Build de production
npm run start         # Démarrer le serveur de production

# Base de données
npx prisma generate   # Générer le client Prisma
npx prisma db push    # Pousser le schéma vers la DB
npx prisma studio     # Interface de gestion DB

# Code Quality
npm run lint          # Linter ESLint
```

## Roadmap du Hackathon

### Phase 1 : Préparation et Infrastructure
- [x] Authentification complète (credentials + OAuth + 2FA)
- [x] Base de données avec Prisma
- [x] Configuration PWA (Progressive Web App)
- [ ] Modèles de données pour les histoires
- [ ] Configuration Ollama et API d'IA

### Phase 2 : Fonctionnalités Principales
- [ ] Onboarding création d'histoire
- [ ] Génération d'histoires avec Ollama
- [ ] Système de chapitres/épisodes
- [ ] Bibliothèque personnelle

### Phase 3 : Interactions Sociales
- [ ] Système de likes
- [ ] Système de favoris
- [ ] Commentaires sur les histoires
- [ ] Page de découverte communautaire

### Phase 4 : Gamification
- [ ] Système d'XP et de niveaux
- [ ] Monnaie virtuelle (pièces)
- [ ] Récompenses par épisode
- [ ] Profil utilisateur avec stats

### Phase 5 : UI/UX et Polish
- [ ] Design (mobile)
- [ ] Animations et transitions
- [ ] Page d'accueil publique
- [ ] Lecteur d'histoires optimisé

## Compte de Test

Pour tester l'application :

```
Email: admin@admin.com
Password: admin123
```
