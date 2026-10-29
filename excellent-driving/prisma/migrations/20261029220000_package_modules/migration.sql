-- Students get a package; modules list the packages that include them.

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "packageId" TEXT;

-- CreateTable
CREATE TABLE "_ModulePackages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModulePackages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ModulePackages_B_index" ON "_ModulePackages"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModulePackages" ADD CONSTRAINT "_ModulePackages_A_fkey" FOREIGN KEY ("A") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModulePackages" ADD CONSTRAINT "_ModulePackages_B_fkey" FOREIGN KEY ("B") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
