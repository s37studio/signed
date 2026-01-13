#!/bin/bash

echo "🚀 Démarrage des services Docker..."
docker compose up -d

echo "⏳ Attente de PostgreSQL..."
sleep 3

echo "🔥 Démarrage de l'app..."
bun run turbo dev
