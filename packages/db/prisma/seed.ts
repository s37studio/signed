/**
 * Seed de développement local
 * Usage: bun run db:seed
 *
 * Crée 3 organisations isolées avec membres, leads et propositions.
 * Mot de passe pour tous les comptes : password123
 */

import { PrismaClient } from "../generated/client.js";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function tok() {
  return randomBytes(32).toString("hex");
}

function ago(days: number) {
  return new Date(Date.now() - days * 864e5);
}

// Better Auth utilise scrypt. Pour le seed local on appelle directement
// l'API de signup qui hash correctement le mot de passe.
async function signUp(name: string, email: string) {
  const res = await fetch("http://localhost:3000/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password: "password123" }),
  });
  const data = (await res.json()) as { user?: { id: string } };
  if (!data.user?.id) throw new Error(`Signup failed for ${email}: ${JSON.stringify(data)}`);
  return data.user.id;
}

async function main() {
  console.log("🌱 Début du seed...\n");

  // Nettoyage complet
  await prisma.proposalView.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.member.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Base de données nettoyée");

  // ─── Comptes utilisateurs ────────────────────────────────────────────────────
  // On crée via l'API pour que Better Auth hash les mots de passe correctement
  console.log("👤 Création des utilisateurs...");
  const [u1, u2, u3, u4, u5, u6] = await Promise.all([
    signUp("Alice Dupont",   "alice@studio-pixel.com"),
    signUp("Bob Martin",     "bob@studio-pixel.com"),
    signUp("Clara Nova",     "clara@freelance-nova.com"),
    signUp("David Leroy",    "david@agence-bolt.com"),
    signUp("Emma Petit",     "emma@agence-bolt.com"),
    signUp("Thomas Bernard", "thomas@agence-bolt.com"),
  ]);
  console.log("✅ 6 utilisateurs créés");

  // ─── Org 1 : Studio Pixel ────────────────────────────────────────────────────
  const org1 = await prisma.organization.create({
    data: {
      name: "Studio Pixel",
      slug: "studio-pixel",
      members: {
        create: [
          { userId: u1, role: "owner" },
          { userId: u2, role: "member" },
        ],
      },
    },
  });

  const [l1, l2, l3] = await Promise.all([
    prisma.lead.create({ data: { name: "Jean-Luc Renard", email: "jl@techcorp.fr",   company: "TechCorp",   organizationId: org1.id, createdById: u1 } }),
    prisma.lead.create({ data: { name: "Sophie Lambert",  email: "sophie@agence.io", company: "Agence.io",  organizationId: org1.id, createdById: u1 } }),
    prisma.lead.create({ data: { name: "Marc Girard",     email: "marc@startup.co",  company: "Startup.co", organizationId: org1.id, createdById: u2 } }),
  ]);

  await prisma.proposal.createMany({
    data: [
      { title: "Refonte site TechCorp",        templateId: "tpl", customData: { budget: 8500  }, token: tok(), slug: "refonte-techcorp",    status: "WON",      organizationId: org1.id, leadId: l1.id, createdById: u1, sentAt: ago(10), openedAt: ago(9)  },
      { title: "Identité visuelle Agence.io",  templateId: "tpl", customData: { budget: 3200  }, token: tok(), slug: "identite-agenceio",   status: "PENDING",  organizationId: org1.id, leadId: l2.id, createdById: u1, sentAt: ago(2)                       },
      { title: "App mobile Startup.co",        templateId: "tpl", customData: { budget: 15000 }, token: tok(), slug: "app-startupco",       status: "REVISION", organizationId: org1.id, leadId: l3.id, createdById: u2, sentAt: ago(5),  openedAt: ago(4), revisionMessage: "Budget à revoir" },
      { title: "SEO TechCorp",                 templateId: "tpl", customData: { budget: 2100  }, token: tok(), slug: "seo-techcorp",        status: "LOST",     organizationId: org1.id, leadId: l1.id, createdById: u1, sentAt: ago(20), openedAt: ago(19) },
    ],
  });
  console.log("✅ Org 1 — Studio Pixel (2 membres, 3 leads, 4 propals)");

  // ─── Org 2 : Freelance Nova ──────────────────────────────────────────────────
  const org2 = await prisma.organization.create({
    data: {
      name: "Freelance Nova",
      slug: "freelance-nova",
      members: { create: [{ userId: u3, role: "owner" }] },
    },
  });

  const [l4, l5] = await Promise.all([
    prisma.lead.create({ data: { name: "Paul Dumont",   email: "paul@restaurant.fr", company: "Les Silos",  organizationId: org2.id, createdById: u3 } }),
    prisma.lead.create({ data: { name: "Isabelle Roy",  email: "i.roy@cabinet.fr",   company: "Cabinet RH", organizationId: org2.id, createdById: u3 } }),
  ]);

  await prisma.proposal.createMany({
    data: [
      { title: "Site Restaurant Les Silos", templateId: "tpl", customData: { budget: 1800 }, token: tok(), slug: "site-les-silos",      status: "WON",     organizationId: org2.id, leadId: l4.id, createdById: u3, sentAt: ago(15), openedAt: ago(14) },
      { title: "Newsletter Cabinet RH",     templateId: "tpl", customData: { budget: 950  }, token: tok(), slug: "newsletter-cabinet",  status: "PENDING", organizationId: org2.id, leadId: l5.id, createdById: u3, sentAt: ago(1)                       },
    ],
  });
  console.log("✅ Org 2 — Freelance Nova (1 membre, 2 leads, 2 propals)");

  // ─── Org 3 : Agence Bolt ─────────────────────────────────────────────────────
  const org3 = await prisma.organization.create({
    data: {
      name: "Agence Bolt",
      slug: "agence-bolt",
      members: {
        create: [
          { userId: u4, role: "owner" },
          { userId: u5, role: "admin" },
          { userId: u6, role: "member" },
        ],
      },
    },
  });

  const [l6, l7, l8] = await Promise.all([
    prisma.lead.create({ data: { name: "Nathan Fabre", email: "n.fabre@luxe-immo.fr", company: "Luxe Immo",         organizationId: org3.id, createdById: u4 } }),
    prisma.lead.create({ data: { name: "Lucie Morel",  email: "lucie@sport-elite.fr", company: "Sport Elite",        organizationId: org3.id, createdById: u5 } }),
    prisma.lead.create({ data: { name: "Romain Blanc", email: "r.blanc@fintech.io",   company: "FinTech Solutions",  organizationId: org3.id, createdById: u4 } }),
  ]);

  await prisma.proposal.createMany({
    data: [
      { title: "Campagne ads Luxe Immo",  templateId: "tpl", customData: { budget: 12000 }, token: tok(), slug: "ads-luxe-immo",       status: "WON",      organizationId: org3.id, leadId: l6.id, createdById: u4, sentAt: ago(30), openedAt: ago(29) },
      { title: "Branding Sport Elite",    templateId: "tpl", customData: { budget: 5500  }, token: tok(), slug: "branding-sport",       status: "PENDING",  organizationId: org3.id, leadId: l7.id, createdById: u5, sentAt: ago(3),  openedAt: ago(3)  },
      { title: "Audit UX FinTech",        templateId: "tpl", customData: { budget: 7200  }, token: tok(), slug: "audit-ux-fintech",     status: "LOST",     organizationId: org3.id, leadId: l8.id, createdById: u4, sentAt: ago(12), openedAt: ago(11) },
      { title: "Dashboard FinTech",       templateId: "tpl", customData: { budget: 18500 }, token: tok(), slug: "dashboard-fintech",    status: "REVISION", organizationId: org3.id, leadId: l8.id, createdById: u5, sentAt: ago(7),  openedAt: ago(6), revisionMessage: "Périmètre trop large" },
    ],
  });
  console.log("✅ Org 3 — Agence Bolt (3 membres, 3 leads, 4 propals)");

  console.log("\n🎉 Seed terminé !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Mot de passe pour tous : password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Studio Pixel    → alice@studio-pixel.com (owner)");
  console.log("                  bob@studio-pixel.com   (member)");
  console.log("Freelance Nova  → clara@freelance-nova.com (owner)");
  console.log("Agence Bolt     → david@agence-bolt.com  (owner)");
  console.log("                  emma@agence-bolt.com   (admin)");
  console.log("                  thomas@agence-bolt.com (member)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
