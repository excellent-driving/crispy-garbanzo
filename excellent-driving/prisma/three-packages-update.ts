/**
 * One-off update of the live database for the three packages (owner's answers
 * of 2026-10-29): Starter becomes Basis, Standard becomes Volledig, Premium is
 * switched off, the Opfriscursus stays. Links each seeded module to the
 * packages that include it (prisma/content/packages.ts). Students keep their
 * package (none yet, so they still see every module). Safe to run twice.
 *
 *   DATABASE_URL=<session pooler> npx tsx prisma/three-packages-update.ts
 */
import { PrismaClient } from "@prisma/client";
import { packageSeeds } from "./content/packages";

const prisma = new PrismaClient();

async function main() {
  for (const { id, nameEn, nameNl, descriptionEn, descriptionNl, featured, isActive } of packageSeeds) {
    await prisma.package.update({ where: { id }, data: { nameEn, nameNl, descriptionEn, descriptionNl, featured, isActive } });
  }

  const modules = await prisma.module.findMany({ orderBy: { orderIndex: "asc" } });
  for (const mod of modules) {
    // Modules the admin added themselves aren't in the list; leave them as they are.
    if (!mod.id.startsWith("seed-")) continue;
    const packageIds = packageSeeds.filter((p) => p.modules.includes(mod.id)).map((p) => ({ id: p.id }));
    await prisma.module.update({ where: { id: mod.id }, data: { packages: { set: packageIds } } });
  }

  const packages = await prisma.package.findMany({ include: { modules: { orderBy: { orderIndex: "asc" } } } });
  for (const p of packages) {
    console.log(`${p.isActive ? "on " : "off"} ${p.nameNl} / ${p.nameEn}: ${p.modules.map((m) => m.orderIndex).join(", ") || "no modules"}`);
  }
  const students = await prisma.user.groupBy({ by: ["packageId"], where: { role: "STUDENT" }, _count: true });
  console.log("students by package:", students.map((s) => `${s.packageId ?? "none"}=${s._count}`).join(" "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
