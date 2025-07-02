-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_token_key" ON "RefreshTokens"("token");

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
