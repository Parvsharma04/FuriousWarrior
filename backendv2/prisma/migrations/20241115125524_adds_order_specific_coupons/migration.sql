/*
  Warnings:

  - You are about to drop the column `coupon_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `couponCoupon_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `type` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_couponCoupon_id_fkey";

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "coupon_id";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "couponCoupon_id";

-- CreateTable
CREATE TABLE "ProductCoupon" (
    "product_coupon_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCoupon_pkey" PRIMARY KEY ("product_coupon_id")
);

-- CreateTable
CREATE TABLE "_CouponToOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CouponToOrder_AB_unique" ON "_CouponToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponToOrder_B_index" ON "_CouponToOrder"("B");

-- AddForeignKey
ALTER TABLE "ProductCoupon" ADD CONSTRAINT "ProductCoupon_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCoupon" ADD CONSTRAINT "ProductCoupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("coupon_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToOrder" ADD CONSTRAINT "_CouponToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Coupon"("coupon_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToOrder" ADD CONSTRAINT "_CouponToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
