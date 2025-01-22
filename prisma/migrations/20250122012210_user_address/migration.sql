/*
  Warnings:

  - You are about to drop the `comment_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rating_items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comment` to the `ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment_items" DROP CONSTRAINT "comment_items_commentId_fkey";

-- DropForeignKey
ALTER TABLE "comment_items" DROP CONSTRAINT "comment_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "rating_items" DROP CONSTRAINT "rating_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "rating_items" DROP CONSTRAINT "rating_items_ratingId_fkey";

-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "comment" VARCHAR(1000) NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "rate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "addressLine" TEXT;

-- DropTable
DROP TABLE "comment_items";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "rating_items";

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
