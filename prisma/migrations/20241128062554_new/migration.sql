-- CreateIndex
CREATE INDEX "user_tokens_token_expiresAt_idx" ON "user_tokens"("token", "expiresAt");
