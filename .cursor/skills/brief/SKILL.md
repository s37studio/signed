---
name: brief
description: the brief of the project
---

## Brief Projet : Signed

Signed est un outil interne ultra-simplifié pour les agences qui permet d'envoyer des propositions commerciales personnalisées à haute valeur perçue en quelques clics, avec suivi d'engagement client en temps réel. Conçu pour éliminer toute complexité inutile, il se concentre uniquement sur la création rapide de propals vibecodées, leur attribution à des leads et leur tracking.

## Utilité Principale

Permettre aux équipes d'agence de transformer un lead en opportunité concrète en moins de 5 minutes : ajouter le client, choisir un template React vibecodé, envoyer la propal, et suivre son ouverture/décision en temps réel. Zéro friction, focus total sur la conversion.

## Fonctionnalités Minimales

### 1. Gestion des Leads (Database Client)

- Ajout rapide d'un lead : nom, email, notes optionnelles
- Vue unique par lead : historique des propals envoyées, statuts (Pending/Won/Lost/Revision), nombre d'ouvertures
- Recherche et filtres simples par nom/email/statut

### 2. Templates Vibecodés (Galerie Composants)

- Galerie de templates React pré-construits (shadcn/ui) : pas d'éditeur, sélection directe
- Templates par type : Landing Agency, SaaS Development, Design Studio, Leadgen, etc.
- Personnalisation minimale inline : nom client, prix, services spécifiques
- Chaque template = composant React prêt-à-envoyer

### 3. Création & Attribution Propal

- 1 clic : Nouvelle propal → sélection template → attribution au lead → personnalisation rapide
- Prévisualisation en temps réel du rendu final
- Génération lien unique de partage (signed.propal.io/lead-xyz/propal-123)

### 4. Envoi & Tracking

- Envoi par email automatique avec lien personnalisé
- Notifications temps réel : ouverture propal, dernière consultation
- Métriques par propal : ouvert (OUI/NON), dernière ouverture, temps passé, statut finalisé par l'équipe
- Vue dashboard : toutes propals + leads en un coup d'œil (statuts, ouvertures)

**MVP Scope** : 4 écrans max (Dashboard Leads, Fiche Lead, Création Propal, Galerie Templates). Backend minimal pour tracking et liens sécurisés. Zéro intégrations externes, zéro paiements, zéro équipe/multi-users. Juste l'essentiel pour closer des deals rapidement.
