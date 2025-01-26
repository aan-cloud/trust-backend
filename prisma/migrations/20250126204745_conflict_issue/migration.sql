-- DropIndex
DROP INDEX "products_slug_idx";

-- CreateIndex
CREATE INDEX "products_slug_id_idx" ON "products"("slug", "id");

-- CreateIndex
CREATE INDEX "users_id_userName_email_idx" ON "users"("id", "userName", "email");
