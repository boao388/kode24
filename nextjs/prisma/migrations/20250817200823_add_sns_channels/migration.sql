/*
  Warnings:

  - You are about to drop the column `author` on the `comments` table. All the data in the column will be lost.
  - Added the required column `authorName` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CommentStatus" AS ENUM ('PUBLISHED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "author",
ADD COLUMN     "authorEmail" TEXT,
ADD COLUMN     "authorName" TEXT NOT NULL,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "status" "public"."CommentStatus" NOT NULL DEFAULT 'PUBLISHED',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."sns_channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sns_channels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
