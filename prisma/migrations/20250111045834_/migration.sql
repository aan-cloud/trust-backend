/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_imageUrl_key" ON "images"("imageUrl");
