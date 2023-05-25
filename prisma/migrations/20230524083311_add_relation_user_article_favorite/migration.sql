-- CreateTable
CREATE TABLE "UserToArticle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,

    CONSTRAINT "UserToArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserToArticle_userId_articleId_key" ON "UserToArticle"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "UserToArticle" ADD CONSTRAINT "UserToArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToArticle" ADD CONSTRAINT "UserToArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
