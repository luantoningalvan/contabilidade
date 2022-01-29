/*
  Warnings:

  - Made the column `name` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Unity" DROP CONSTRAINT "Unity_client_id_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- AlterTable
ALTER TABLE "Unity" ALTER COLUMN "sold" SET DEFAULT false,
ALTER COLUMN "sale_price" DROP NOT NULL,
ALTER COLUMN "sale_date" DROP NOT NULL,
ALTER COLUMN "client_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Unity" ADD CONSTRAINT "Unity_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
