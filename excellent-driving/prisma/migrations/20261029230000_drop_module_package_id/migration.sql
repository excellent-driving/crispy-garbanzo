-- The single, never-used module package (replaced by "_ModulePackages").
-- A separate step so the old code, which still reads this column, keeps working until the new code is deployed.

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_packageId_fkey";

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "packageId";
