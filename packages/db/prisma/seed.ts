/**
 * Seed de développement local
 * Usage: bun run db:seed
 * Prérequis: le serveur doit tourner sur localhost:3000
 */

import { Client } from "pg";
import { randomBytes } from "crypto";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:password@localhost:5432/postgres";

const SERVER_URL = "http://localhost:3000";

const db = new Client({ connectionString: DATABASE_URL });

function tok() {
  return randomBytes(32).toString("hex");
}

function ago(days: number) {
  return new Date(Date.now() - days * 864e5).toISOString();
}

const designData = (title: string, desc: string) => JSON.stringify({
  projectTitle: title,
  projectDescription: desc,
  brandName: "S37™",
  ctaText: "Prêt à démarrer ?",
  acceptUrl: "#contact",
});

const gtmData = (title: string, desc: string, videoUrl?: string) => JSON.stringify({
  projectTitle: title,
  projectDescription: desc,
  brandName: "S37™",
  ctaText: "Démarrons ensemble",
  acceptUrl: "#contact",
  videoUrl: videoUrl ?? "",
});

async function signUp(name: string, email: string): Promise<string> {
  const res = await fetch(`${SERVER_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password: "password123" }),
  });
  const data = (await res.json()) as { user?: { id: string }; message?: string };
  if (!data.user?.id) throw new Error(`Signup échoué pour ${email}: ${data.message}`);
  return data.user.id;
}

async function main() {
  await db.connect();
  console.log("✅ Connecté à la DB\n");

  // Nettoyage
  await db.query("DELETE FROM proposal_view");
  await db.query("DELETE FROM proposal");
  await db.query("DELETE FROM lead");
  await db.query("DELETE FROM member");
  await db.query("DELETE FROM invitation");
  await db.query("DELETE FROM organization");
  await db.query("DELETE FROM session");
  await db.query("DELETE FROM account");
  await db.query('DELETE FROM "user"');
  console.log("🗑️  Base nettoyée\n");

  // Création des users via l'API (Better Auth hash scrypt)
  console.log("👤 Création des utilisateurs...");
  const u1 = await signUp("Alice Dupont",   "alice@studio-pixel.com");   await Bun.sleep(500);
  const u2 = await signUp("Bob Martin",     "bob@studio-pixel.com");     await Bun.sleep(500);
  const u3 = await signUp("Clara Nova",     "clara@freelance-nova.com"); await Bun.sleep(500);
  const u4 = await signUp("David Leroy",    "david@agence-bolt.com");    await Bun.sleep(500);
  const u5 = await signUp("Emma Petit",     "emma@agence-bolt.com");     await Bun.sleep(500);
  const u6 = await signUp("Thomas Bernard", "thomas@agence-bolt.com");
  console.log("✅ 6 utilisateurs créés\n");

  // Org 1 — Studio Pixel
  await db.query(`INSERT INTO organization (id,name,slug,"createdAt","updatedAt") VALUES('org1','Studio Pixel','studio-pixel',NOW(),NOW())`);
  await db.query(`INSERT INTO member (id,"organizationId","userId",role,"createdAt") VALUES('m1','org1',$1,'owner',NOW()),('m2','org1',$2,'member',NOW())`, [u1, u2]);

  const { rows: [l1] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l1','Jean-Luc Renard','jl@techcorp.fr','TechCorp','org1',$1,NOW(),NOW()) RETURNING id`, [u1]);
  const { rows: [l2] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l2','Sophie Lambert','sophie@agence.io','Agence.io','org1',$1,NOW(),NOW()) RETURNING id`, [u1]);
  const { rows: [l3] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l3','Marc Girard','marc@startup.co','Startup.co','org1',$1,NOW(),NOW()) RETURNING id`, [u2]);

  for (const [title, tplId, customData, slug, status, lid, uid, sentD, openD, rev] of [
    ["Refonte site TechCorp",       "design", designData("Refonte site TechCorp", "Refonte complète du site vitrine avec une identité moderne et performante."),                            "refonte-techcorp",   "WON",      l1.id, u1, 10, 9,    null],
    ["Identite visuelle Agence.io", "design", designData("Identité visuelle Agence.io", "Création d'une identité de marque cohérente : logo, charte graphique et supports."),             "identite-agenceio",  "PENDING",  l2.id, u1, 2,  null, null],
    ["App mobile Startup.co",       "gtm",    gtmData("App mobile Startup.co", "Développement MVP iOS/Android avec stratégie de lancement go-to-market."),                               "app-startupco",      "REVISION", l3.id, u2, 5,  4,    "Budget a revoir"],
    ["SEO & Analytics TechCorp",    "gtm",    gtmData("SEO & Analytics TechCorp", "Audit SEO complet, setup analytics et stratégie de contenu sur 3 mois."),                             "seo-techcorp",       "LOST",     l1.id, u1, 20, 19,   null],
  ] as const) {
    await db.query(
      `INSERT INTO proposal (id,title,"templateId","customData",token,slug,status,"revisionMessage","organizationId","leadId","createdById","createdAt","updatedAt","sentAt","openedAt")
       VALUES(gen_random_uuid(),$1,$2,$3::jsonb,$4,$5,$6::"ProposalStatus",$7,'org1',$8,$9,NOW(),NOW(),$10,$11)`,
      [title, tplId, customData, tok(), slug, status, rev, lid, uid, ago(sentD as number), openD ? ago(openD as number) : null]
    );
  }
  console.log("✅ Org 1 — Studio Pixel (2 membres, 3 leads, 4 propals)");

  // Org 2 — Freelance Nova
  await db.query(`INSERT INTO organization (id,name,slug,"createdAt","updatedAt") VALUES('org2','Freelance Nova','freelance-nova',NOW(),NOW())`);
  await db.query(`INSERT INTO member (id,"organizationId","userId",role,"createdAt") VALUES('m3','org2',$1,'owner',NOW())`, [u3]);

  const { rows: [l4] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l4','Paul Dumont','paul@restaurant.fr','Les Silos','org2',$1,NOW(),NOW()) RETURNING id`, [u3]);
  const { rows: [l5] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l5','Isabelle Roy','i.roy@cabinet.fr','Cabinet RH','org2',$1,NOW(),NOW()) RETURNING id`, [u3]);

  for (const [title, tplId, customData, slug, status, lid, sentD, openD] of [
    ["Site Restaurant Les Silos", "design", designData("Site Restaurant Les Silos", "Site one-page élégant avec réservation en ligne, menu interactif et galerie photo."),    "site-les-silos",     "WON",    l4.id, 15, 14],
    ["Newsletter & CRM Cabinet RH", "gtm",  gtmData("Newsletter & CRM Cabinet RH", "Setup Mailchimp, intégration CRM et stratégie de nurturing email sur 6 semaines."),     "newsletter-cabinet", "PENDING", l5.id, 1,  null],
  ] as const) {
    await db.query(
      `INSERT INTO proposal (id,title,"templateId","customData",token,slug,status,"organizationId","leadId","createdById","createdAt","updatedAt","sentAt","openedAt")
       VALUES(gen_random_uuid(),$1,$2,$3::jsonb,$4,$5,$6::"ProposalStatus",'org2',$7,$8,NOW(),NOW(),$9,$10)`,
      [title, tplId, customData, tok(), slug, status, lid, u3, ago(sentD as number), openD ? ago(openD as number) : null]
    );
  }
  console.log("✅ Org 2 — Freelance Nova (1 membre, 2 leads, 2 propals)");

  // Org 3 — Agence Bolt
  await db.query(`INSERT INTO organization (id,name,slug,"createdAt","updatedAt") VALUES('org3','Agence Bolt','agence-bolt',NOW(),NOW())`);
  await db.query(`INSERT INTO member (id,"organizationId","userId",role,"createdAt") VALUES('m4','org3',$1,'owner',NOW()),('m5','org3',$2,'admin',NOW()),('m6','org3',$3,'member',NOW())`, [u4, u5, u6]);

  const { rows: [l6] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l6','Nathan Fabre','n.fabre@luxe-immo.fr','Luxe Immo','org3',$1,NOW(),NOW()) RETURNING id`, [u4]);
  const { rows: [l7] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l7','Lucie Morel','lucie@sport-elite.fr','Sport Elite','org3',$1,NOW(),NOW()) RETURNING id`, [u5]);
  const { rows: [l8] } = await db.query(`INSERT INTO lead (id,name,email,company,"organizationId","createdById","createdAt","updatedAt") VALUES('l8','Romain Blanc','r.blanc@fintech.io','FinTech Solutions','org3',$1,NOW(),NOW()) RETURNING id`, [u4]);

  for (const [title, tplId, customData, slug, status, lid, uid, sentD, openD, rev] of [
    ["Campagne ads Luxe Immo",  "gtm",    gtmData("Campagne ads Luxe Immo", "Stratégie Google Ads + Meta Ads sur 3 mois avec suivi hebdomadaire et reporting.", "https://www.youtube.com/embed/dQw4w9WgXcQ"), "ads-luxe-immo",     "WON",      l6.id, u4, 30, 29,   null],
    ["Branding Sport Elite",    "design", designData("Branding Sport Elite", "Identité de marque complète : logo, typographie, palette de couleurs et charte graphique."),                                    "branding-sport",    "PENDING",  l7.id, u5, 3,  3,    null],
    ["Audit UX FinTech",        "design", designData("Audit UX FinTech Solutions", "Audit complet de l'expérience utilisateur avec livrables UX research et recommandations."),                              "audit-ux-fintech",  "LOST",     l8.id, u4, 12, 11,   null],
    ["Dashboard FinTech",       "gtm",    gtmData("Dashboard Analytics FinTech", "Tableau de bord data personnalisé avec KPIs temps réel et intégrations API."),                                            "dashboard-fintech", "REVISION", l8.id, u5, 7,  6,    "Perimetre trop large"],
  ] as const) {
    await db.query(
      `INSERT INTO proposal (id,title,"templateId","customData",token,slug,status,"revisionMessage","organizationId","leadId","createdById","createdAt","updatedAt","sentAt","openedAt")
       VALUES(gen_random_uuid(),$1,$2,$3::jsonb,$4,$5,$6::"ProposalStatus",$7,'org3',$8,$9,NOW(),NOW(),$10,$11)`,
      [title, tplId, customData, tok(), slug, status, rev, lid, uid, ago(sentD as number), openD ? ago(openD as number) : null]
    );
  }
  console.log("✅ Org 3 — Agence Bolt (3 membres, 3 leads, 4 propals)");

  await db.end();

  console.log("\n🎉 Seed terminé !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Mot de passe pour tous : password123");
  console.log("alice@studio-pixel.com   — Studio Pixel (owner)");
  console.log("bob@studio-pixel.com     — Studio Pixel (member)");
  console.log("clara@freelance-nova.com — Freelance Nova (owner)");
  console.log("david@agence-bolt.com    — Agence Bolt (owner)");
  console.log("emma@agence-bolt.com     — Agence Bolt (admin)");
  console.log("thomas@agence-bolt.com   — Agence Bolt (member)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
