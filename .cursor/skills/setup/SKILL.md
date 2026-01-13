---
name: setup
description: This is the setup guide
---

# Tech Stack & Setup

## 🛠️ Tech Stack

### Monorepo

- **TurboRepo** - Build system
- **Bun** - Package manager & runtime

### Backend

- **Hono** - Web framework (léger, rapide)
- **tRPC** - API type-safe
- **Better Auth** - Authentication
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Zod** - Validation schemas

### Frontend

- **Next.js 15** - Framework React (App Router)
- **React 19** - Library UI
- **TanStack Query** - State management async
- **shadcn/ui** - Composants UI
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Dev Tools

- **TypeScript** - Langage
- **ESLint** - Linting
- **Prettier** - Formatting (si configuré)

---

## 🚀 Démarrer le Projet

### 1. Installation

```bash
bun install
```

### 2. Configuration Environnement

Copier les fichiers `.env.example` et les renommer en `.env` :

```bash
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env
```

Puis configurer les variables (notamment `BETTER_AUTH_SECRET` et `DATABASE_URL`).

### 3. Migration Database

```bash
bun run db:push      # Push le schema Prisma vers la DB
bun run db:generate  # Génère le client Prisma
```

### 4. Démarrer en Dev

**Tout en même temps :**

```bash
bun run dev
```

**Ou séparément :**

```bash
bun run dev:web      # Frontend (port 3000)
bun run dev:server   # Backend (port 3001)
```

---

## 📦 Commandes Utiles

### Développement

```bash
bun run dev              # Démarre tous les services
bun run dev:web          # Démarre uniquement le frontend
bun run dev:server       # Démarre uniquement le backend
```

### Database

```bash
bun run db:push          # Push schema vers DB (dev)
bun run db:migrate       # Créer une migration (prod)
bun run db:generate      # Générer client Prisma
bun run db:studio        # Ouvrir Prisma Studio (GUI DB)
```

### Build

```bash
bun run build            # Build tous les packages
bun run check-types      # Vérifier les types TypeScript
```

---

## 📁 Structure Projet

```
/
├── apps/
│   ├── server/          # Backend API (Hono + tRPC)
│   └── web/             # Frontend (Next.js)
│
├── packages/
│   ├── api/             # tRPC routes + logique métier
│   ├── auth/            # Better Auth configuration
│   ├── db/              # Prisma schema + client
│   ├── env/             # Variables environnement
│   └── config/          # Config partagée TypeScript
│
├── ARCHITECTURE.md      # Guide architecture
├── package.json         # Monorepo config
└── turbo.json           # TurboRepo config
```

---

## 🌐 URLs par Défaut

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **tRPC endpoint** : http://localhost:3001/trpc
- **Auth endpoint** : http://localhost:3001/api/auth

---

## ⚡ Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd signed
bun install

# 2. Setup env & DB
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env
# Configurer les .env puis :
bun run db:push
bun run db:generate

# 3. Run
bun run dev

# 4. Ouvrir http://localhost:3000
```

---

## 📝 Notes

- **Bun** est utilisé comme runtime ET package manager
- **Hot reload** activé sur frontend et backend
- **Type safety** garantie via tRPC (pas besoin de générer des types manuellement)
- **Prisma Client** doit être regénéré après chaque changement de schema
