---
name: architecture
description: The architecture of the project
---

# Architecture Projet Signed

## 📋 Stack Actuelle

- **Monorepo** : TurboRepo + Bun
- **Backend** : Hono + tRPC + Better Auth
- **Frontend** : Next.js 15 (App Router) + TanStack Query + shadcn/ui
- **Database** : Prisma + PostgreSQL

**✅ Stack parfaite, rien à changer.**

---

## 🎯 Principe Directeur

> **"3 couches backend, architecture composants frontend, zéro over-engineering"**

---

## 📁 Architecture Backend

### Structure des Dossiers

```
packages/api/
├── src/
│   ├── context.ts                    # Context tRPC (session, prisma)
│   ├── index.ts                      # Init tRPC (publicProcedure, protectedProcedure)
│   ├── controllers/
│   │   ├── index.ts                  # AppRouter (combine tous les controllers)
│   │   ├── lead.controller.ts
│   │   ├── proposal.controller.ts
│   │   ├── template.controller.ts
│   │   └── tracking.controller.ts
│   ├── services/
│   │   ├── lead.service.ts
│   │   ├── proposal.service.ts
│   │   ├── template.service.ts
│   │   ├── tracking.service.ts
│   │   └── email.service.ts
│   └── repositories/
│       ├── lead.repository.ts
│       ├── proposal.repository.ts
│       └── tracking.repository.ts
```

### Responsabilités par Couche

**Controller (tRPC)**

- Validation des inputs avec Zod
- Vérification auth (protectedProcedure)
- Appel des services
- Return des réponses

**Service**

- Logique métier
- Règles business
- Orchestration entre plusieurs repositories
- Gestion des erreurs métier

**Repository**

- Requêtes Prisma uniquement
- Zéro logique métier
- Fonctions réutilisables pour accès DB

### Flow de Données

```
Client (tRPC call)
    ↓
Controller (validation + auth)
    ↓
Service (logique métier)
    ↓
Repository (DB access)
    ↓
Prisma (PostgreSQL)
```

---

## 🎨 Architecture Frontend

### Structure des Dossiers

```
apps/web/src/
├── app/                              # Next.js App Router (routes)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx                  # Dashboard principal
│   │   └── leads/[id]/page.tsx       # Détail lead
│   ├── proposals/
│   │   ├── new/page.tsx              # Création propal
│   │   └── [id]/edit/page.tsx        # Edition propal
│   ├── templates/page.tsx            # Galerie templates
│   └── p/[token]/page.tsx            # Page publique (propal partagée)
│
├── components/                       # Composants UI réutilisables
│   ├── ui/                           # shadcn/ui primitives
│   ├── leads/                        # Composants leads (cards, forms, lists)
│   ├── proposals/                    # Composants proposals (cards, stats, preview)
│   ├── templates/                    # Templates React + registry
│   └── shared/                       # Composants partagés (header, loader)
│
├── features/                         # Logique métier frontend
│   ├── leads/
│   │   ├── hooks/                    # Custom hooks (use-leads, use-create-lead)
│   │   └── types.ts                  # Types TypeScript
│   ├── proposals/
│   │   ├── hooks/
│   │   └── types.ts
│   └── templates/
│       ├── hooks/
│       └── types.ts
│
├── lib/                              # Utilitaires
│   ├── auth-client.ts
│   └── utils.ts
│
└── utils/
    └── trpc.ts                       # Config tRPC client
```

### Responsabilités par Niveau

**Pages (app/)**

- Server Components par défaut
- Fetch data initiale si besoin
- Auth checks
- Render des containers

**Components**

- UI pure, réutilisables
- Props typées
- Pas d'appels API directs
- Composition de composants shadcn/ui

**Features (hooks)**

- Logique métier frontend
- Appels tRPC via TanStack Query
- État local si nécessaire
- Gestion des mutations

### Flow Frontend

```
Page (Server Component)
    ↓
Feature Container (Client Component)
    ↓
Custom Hook (tRPC query/mutation)
    ↓
tRPC → Backend
    ↓
UI Components (shadcn/ui)
```

---

## 🎨 Système de Templates

### Concept

Au lieu d'un éditeur WYSIWYG complexe, on code chaque template comme un composant React.

**Avantages :**

- Full contrôle design
- Type-safe
- Performance optimale
- Facile à maintenir
- Pas de builder à développer

### Organisation

```
components/templates/
├── landing-agency-template.tsx       # Template 1
├── saas-development-template.tsx     # Template 2
├── design-studio-template.tsx        # Template 3
└── registry.ts                       # Map template ID → Component
```

### Fonctionnement

1. Chaque template = composant React avec props typées
2. Registry pour mapper un ID vers le composant
3. Lors de la création propal : sélection template + customData (props)
4. Lors du rendu : `TEMPLATE_REGISTRY[templateId]` + spread des props
5. Page publique : rendu dynamique du bon composant

**Personnalisation** : via props (nom client, prix, services, etc.) stockées en JSON dans la table Proposal

---

## 🎯 Ce Qu'il Faut ÉVITER

**❌ Ne JAMAIS faire :**

- Architecture hexagonale / DDD / CQRS pour un MVP
- Séparation excessive en microservices
- Cache Redis "au cas où"
- WebSocket pour le tracking (polling suffit)
- Tests e2e exhaustifs dès le début
- Abstractions prématurées

**✅ Faire simple :**

- 3 couches backend, pas plus
- Composants React classiques
- tRPC pour l'API (déjà type-safe)
- Prisma direct (pas de pattern Repository complexe)

---

## 📦 Organisation Monorepo

```
/
├── apps/
│   ├── server/              # Backend Hono (entry point)
│   └── web/                 # Frontend Next.js
│
├── packages/
│   ├── api/                 # tRPC routes + logique métier
│   ├── auth/                # Better Auth config
│   ├── db/                  # Prisma schema + client
│   ├── env/                 # Variables d'environnement
│   └── config/              # Config partagée TypeScript
```

**Principe** : Les packages sont partagés entre apps. Si besoin d'une 3e app (mobile, etc.), elle réutilise `api`, `auth`, `db`.
