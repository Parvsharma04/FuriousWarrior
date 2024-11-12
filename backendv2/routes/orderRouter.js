const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware.js");

const router = express.Router();
const prisma = new PrismaClient();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { total_amount, payment_status, items } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        user_id: req.user.id,
        total_amount: parseFloat(total_amount),
        payment_status,
        invoice: {
          create: {
            user_id: req.user.id,
          },
        },
      },
    });

    // Create cart activities for each item in the order
    for (const item of items) {
      await prisma.cartActivity.create({
        data: {
          user_id: req.user.id,
          item_id: item.item_id,
          checked_out: true,
          checkout_time: new Date(),
        },
      });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's orders
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { user_id: req.user.id },
      include: { invoice: true },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single order
router.get("/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { order_id: parseInt(req.params.id) },
      include: { invoice: true },
    });

    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
