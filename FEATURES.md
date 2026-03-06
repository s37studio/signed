# Features implémentées — à designer

## Auth
- **Sign in / Sign up** — page `/login`, toggle entre les deux formulaires
- **Onboarding** — page `/onboarding` : création de l'organisation après inscription (obligatoire pour accéder au dashboard)
- **Protection des routes** — le dashboard est inaccessible sans session active (guard côté layout)

## Multi-tenant / Organisations
- Chaque user appartient à **une organisation**
- Les données (leads, propals) sont **100% isolées** par org — un user ne voit jamais les données d'une autre org
- **Page Paramètres** `/dashboard/settings` :
  - Liste des membres avec leur rôle (owner / admin / member)
  - Changer le rôle d'un membre
  - Retirer un membre
  - Inviter un nouveau membre par email
  - Annuler une invitation en attente

## Leads
- **Liste** `/dashboard/leads` — tous les leads de l'org
- **Détail** `/dashboard/leads/[id]` — infos du lead + ses propositions liées
- Création, édition, suppression

## Propositions
- **Liste** `/dashboard` — toutes les propals avec statut (PENDING / WON / LOST / REVISION)
- **Détail / édition** `/dashboard/proposals/[id]/edit`
- **Vue publique** `/p/[token]` — page envoyée au client, sans auth
- Statuts : `PENDING`, `WON`, `LOST`, `REVISION` (avec message de révision)
- Tracking des vues (date, durée, ville/pays)

## Templates
- **2 templates disponibles** : `design` et `gtm`
- **Page templates** `/dashboard/templates` — aperçu + liste des champs configurables
- Chaque template a des champs custom (titre, description, brandName, CTA, URL, videoUrl…)
- Vue publique rendu côté client selon le `templateId` + `customData` stockés en DB

## Dev
- **Seed local** : `bun run db:seed` (serveur doit tourner sur localhost:3000)
  - Crée 3 orgs : Studio Pixel, Freelance Nova, Agence Bolt
  - 6 comptes, mot de passe : `password123`
  - Leads + propals avec tous les statuts et vrais templates
