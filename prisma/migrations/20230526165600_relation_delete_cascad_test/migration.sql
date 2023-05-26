-- DropForeignKey
ALTER TABLE "UserToArticle" DROP CONSTRAINT "UserToArticle_articleId_fkey";

-- AddForeignKey
ALTER TABLE "UserToArticle" ADD CONSTRAINT "UserToArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
