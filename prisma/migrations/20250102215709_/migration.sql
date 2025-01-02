/*
  Warnings:

  - A unique constraint covering the columns `[productId,imageUrl]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_productId_imageUrl_key" ON "images"("productId", "imageUrl");
