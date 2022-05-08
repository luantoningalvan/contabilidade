/*
  Warnings:

  - You are about to drop the column `original_price` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unit_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "original_price",
ADD COLUMN     "thumbnail" TEXT;
UPDATE "Product" SET "thumbnail" = CONCAT('thumb-', "natCode", '.jpg');

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_unit_id_key" ON "Transaction"("unit_id");
