#!/bin/bash
cd packages/db
bun run prisma db push --accept-data-loss
echo "✅ Migration completed!"
