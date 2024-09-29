/*
  Warnings:

  - You are about to drop the column `categoriesId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoriesId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "categoriesId",
ADD COLUMN     "categoryId" UUID;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
