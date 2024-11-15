/*
  Warnings:

  - You are about to drop the `ProductCoupon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductCoupon" DROP CONSTRAINT "ProductCoupon_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductCoupon" DROP CONSTRAINT "ProductCoupon_product_id_fkey";

-- DropTable
DROP TABLE "ProductCoupon";

-- CreateTable
CREATE TABLE "_CouponToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CouponToProduct_AB_unique" ON "_CouponToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponToProduct_B_index" ON "_CouponToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CouponToProduct" ADD CONSTRAINT "_CouponToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Coupon"("coupon_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToProduct" ADD CONSTRAINT "_CouponToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;
