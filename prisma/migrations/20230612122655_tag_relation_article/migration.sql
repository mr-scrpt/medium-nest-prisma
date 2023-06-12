/*
  Warnings:

  - You are about to drop the column `tagList` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "tagList";

-- CreateTable
CREATE TABLE "ArticleToTag" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ArticleToTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleToTag_articleId_tagId_key" ON "ArticleToTag"("articleId", "tagId");

-- AddForeignKey
ALTER TABLE "ArticleToTag" ADD CONSTRAINT "ArticleToTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleToTag" ADD CONSTRAINT "ArticleToTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
