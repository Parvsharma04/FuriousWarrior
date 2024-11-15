const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to check and update coupon validity
const checkCouponValidity = async (coupon) => {
  const now = new Date();
  const valid =
    coupon.start_date <= now &&
    coupon.end_date >= now &&
    coupon.times_used < coupon.max_uses;

  if (coupon.valid !== valid) {
    // If validity has changed, update the database
    await prisma.coupon.update({
      where: { coupon_id: coupon.coupon_id },
      data: { valid },
    });
  }

  return valid;
};

router.get("/", async (req, res) => {
  try {
    // Fetch all coupons including their products
    const coupons = await prisma.coupon.findMany({
      include: {
        products: true, // Include related products
      },
    });

    // Add the validity status dynamically and update in DB if necessary
    const couponsWithValidity = await Promise.all(
      coupons.map(async (coupon) => {
        const valid = await checkCouponValidity(coupon); // Update validity in DB if necessary
        return {
          ...coupon,
          valid, // Calculate and add the 'valid' status
        };
      })
    );

    res.json(couponsWithValidity); // Return coupons with their validity status
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);

  const {
    title,
    description,
    code,
    discount_amount,
    discount_percent,
    start_date,
    end_date,
    max_uses,
    times_used,
    type,
    applicable_products,
  } = req.body;

  // Convert data types before saving to Prisma
  const now = new Date();
  const valid =
    new Date(start_date) <= now &&
    new Date(end_date) >= now &&
    times_used < max_uses;

  // Ensure numeric fields are converted
  const newCouponData = {
    title: title,
    description: description,
    code: code,
    discount_amount: parseFloat(discount_amount),
    discount_percent: discount_percent ? parseFloat(discount_percent) : null,
    max_uses: parseInt(max_uses),
    times_used: parseInt(times_used),
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    valid,
    type: type,
  };

  try {
    await prisma.$connect();

    // Check if coupon with the same code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        code: code, // Check for existing coupon by code
      },
    });

    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    // Create the coupon in the database
    const newCoupon = await prisma.coupon.create({
      data: {
        ...newCouponData,
        // Correctly associate products if the coupon type is "PRODUCT"
        products:
          applicable_products && type === "PRODUCT"
            ? {
                connect: applicable_products.map((id) => ({ item_id: id })),
              }
            : undefined,
      },
    });

    // If the coupon is of type 'PRODUCT', create ProductCoupon records (for many-to-many relation)
    // if (type === "PRODUCT" && applicable_products) {
    //   console.log(applicable_products)
    //   await prisma.productCoupon.createMany({
    //     data: applicable_products.map((productId) => ({
    //       product_id: productId,
    //       coupon_id: newCoupon.coupon_id,
    //     })),
    //   });
    // }

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error(error); // Log error for more detailed diagnostics
    res.status(500).json({ message: "Error creating coupon", error });
  }
});

router.put(
  "/:id",
  [
    param("id").isInt(),
    body("title").optional().isString().notEmpty(), // Validate title
    body("description").optional().isString().notEmpty(), // Validate description
    body("code").optional().isString(),
    body("discount_amount").optional().isFloat({ min: 0 }),
    body("discount_percent").optional().isFloat({ min: 0, max: 100 }),
    body("start_date").optional().isISO8601(),
    body("end_date").optional().isISO8601(),
    body("max_uses").optional().isInt({ min: 1 }),
    body("product_ids").optional().isArray(), // Optional array of product IDs
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { product_ids, ...couponData } = req.body;

    try {
      const updatedCoupon = await prisma.coupon.update({
        where: { coupon_id: parseInt(id) },
        data: {
          ...couponData,
          products: product_ids
            ? {
                set: [], // Remove existing product associations first
                connect: product_ids.map((id) => ({ item_id: id })), // Add new product associations
              }
            : undefined, // Only update if product_ids are provided
        },
        include: {
          products: true, // Include related products in the response
        },
      });

      res.json(updatedCoupon);
    } catch (error) {
      res.status(500).json({ message: "Error updating coupon", error });
    }
  }
);

// DELETE route to remove a coupon and its product associations
router.delete("/:id", [param("id").isInt()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    // Delete the coupon and its associations from the database
    await prisma.coupon.delete({
      where: { coupon_id: parseInt(id) },
    });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
});

module.exports = router;
