-- DropForeignKey
ALTER TABLE "UserToArticle" DROP CONSTRAINT "UserToArticle_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserToArticle" ADD CONSTRAINT "UserToArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
