# Signed - Setup Guide

## ✅ Setup Complete!

Your Signed application is now running with test data.

## 🔐 Test Accounts

The database has been seeded with 3 organizations and 6 users. Use any of these accounts to log in:

### Organization 1: Studio Pixel
- **alice@studio-pixel.com** (owner) - Password: `password123`
- **bob@studio-pixel.com** (member) - Password: `password123`

### Organization 2: Freelance Nova
- **clara@freelance-nova.com** (owner) - Password: `password123`

### Organization 3: Agence Bolt
- **david@agence-bolt.com** (owner) - Password: `password123`
- **emma@agence-bolt.com** (admin) - Password: `password123`
- **thomas@agence-bolt.com** (member) - Password: `password123`

## 🚀 Access the Application

1. **Web App**: http://localhost:3000
2. **API Server**: http://localhost:3001
3. **MCP Server**: http://localhost:3002

## 📝 How to Use

1. Go to http://localhost:3000
2. Click "Sign In"
3. Use one of the test accounts above (e.g., `alice@studio-pixel.com` / `password123`)
4. You'll be automatically redirected to the dashboard with your organization active
5. Now you can create leads, proposals, etc.

## ⚠️ Important Notes

### "No active organization" Error
If you see an error like "Unexpected token 'I', 'Internal S'... is not valid JSON", it means:
- You're not logged in, OR
- Your session doesn't have an active organization set

**Solution**: 
- Log out and log back in with one of the seeded accounts
- The sign-in process will automatically set your active organization

### Creating New Users
If you create a new user account (not from the seed data):
1. After signing up, you'll be redirected to the onboarding page
2. Create an organization (e.g., "My Studio")
3. You'll then be able to access the dashboard and create leads

## 🗄️ Database Management

- **View data**: `bun run db:studio` (opens Prisma Studio)
- **Reset & reseed**: `bun run db:seed` (clears all data and recreates test data)
- **Push schema changes**: `bun run db:push`

## 🛠️ Development Commands

```bash
# Start all services
bun run dev

# Start individual services
bun run dev:web      # Web app only
bun run dev:server   # API server only

# Database
bun run db:studio    # Open Prisma Studio
bun run db:push      # Push schema to database
bun run db:seed      # Seed test data

# Docker
bun run docker:up    # Start PostgreSQL
bun run docker:down  # Stop PostgreSQL
```

## 🐛 Troubleshooting

### Ports already in use
```bash
# Kill processes on ports 3000-3002
lsof -ti:3000,3001,3002 | xargs kill -9
```

### Database connection issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
bun run docker:down
bun run docker:up
```

### JSON parsing errors
- Make sure you're logged in with a valid account
- Check that your session has an active organization
- Try logging out and logging back in

---

**Enjoy using Signed! 🎉**
