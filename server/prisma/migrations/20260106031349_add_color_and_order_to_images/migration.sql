-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "color" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
