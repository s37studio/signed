import "dotenv/config";
import prisma from "../src/index";

async function generateSlug(text: string): Promise<string> {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function migrateExistingProposals() {
  console.log("🔄 Starting slug migration for existing proposals...");

  const proposals = await prisma.proposal.findMany({
    where: {
      OR: [{ slug: "" }, { slug: { equals: "" } }],
    },
    include: {
      lead: {
        select: {
          name: true,
          company: true,
        },
      },
    },
  });

  console.log(`📊 Found ${proposals.length} proposals to migrate`);

  if (proposals.length === 0) {
    console.log("✅ No proposals to migrate. All done!");
    return;
  }

  for (const proposal of proposals) {
    if (!proposal.lead) {
      console.log(`⚠️  Skipping proposal ${proposal.id}: lead not found`);
      continue;
    }

    const baseSlug = proposal.lead.company
      ? await generateSlug(proposal.lead.company)
      : await generateSlug(proposal.lead.name);

    const slug = `${baseSlug}-${proposal.token.slice(0, 6).toUpperCase()}`;

    await prisma.proposal.update({
      where: { id: proposal.id },
      data: { slug },
    });

    console.log(`✓ Migrated proposal ${proposal.id}: ${slug}`);
  }

  console.log("✅ Migration complete!");
  console.log(`📈 Total migrated: ${proposals.length} proposals`);
}

// Exécuter la migration
migrateExistingProposals()
  .then(() => {
    console.log("🎉 Script terminated successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
