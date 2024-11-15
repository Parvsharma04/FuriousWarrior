-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "couponCoupon_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_couponCoupon_id_fkey" FOREIGN KEY ("couponCoupon_id") REFERENCES "Coupon"("coupon_id") ON DELETE SET NULL ON UPDATE CASCADE;
