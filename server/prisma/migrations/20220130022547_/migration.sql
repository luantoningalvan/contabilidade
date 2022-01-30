/*
  Warnings:

  - You are about to drop the `Unity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Unity" DROP CONSTRAINT "Unity_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Unity" DROP CONSTRAINT "Unity_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Unity" DROP CONSTRAINT "Unity_product_id_fkey";

-- DropTable
DROP TABLE "Unity";

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "purchase_price" DOUBLE PRECISION NOT NULL,
    "sale_price" DOUBLE PRECISION,
    "sale_date" TIMESTAMP(3),
    "client_id" INTEGER,
    "category_id" INTEGER NOT NULL,
    "expiration_date" TIMESTAMP(3),

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
