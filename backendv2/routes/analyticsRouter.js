const { subDays } = require("date-fns");
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware.js");
const { adminMiddleware } = require("../middleware/admin.middleware.js");

const router = express.Router();
const prisma = new PrismaClient();

// Get user activity analytics
router.get("/user-activity", async (req, res) => {
  try {
    const userActivity = await prisma.userActivity.groupBy({
      by: ["activity_type"],
      _count: {
        activity_type: true,
      },
    });

    res.json(userActivity);
  } catch (error) {
    console.error("Error fetching user activity analytics:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get document download analytics
router.get("/document-downloads", async (req, res) => {
  try {
    const documentDownloads = await prisma.documentDownload.groupBy({
      by: ["document_id"],
      _count: {
        document_id: true,
      },
    });

    res.json(documentDownloads);
  } catch (error) {
    console.error("Error fetching document download analytics:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    // Define the cutoff date for determining active and new users (e.g., 30 days ago)
    const cutoffDate = subDays(new Date(), 30);

    // Fetch all users with email and amount spent
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        email: true,
        amount_spent: true,
        user_role: true,
      },
    });

    // Get total user count
    const userCount = await prisma.user.count();

    // Count of new users (signed up within the last 30 days)
    const newUserCount = await prisma.user.count({
      where: {
        signup_date: {
          gte: cutoffDate,
        },
      },
    });

    // Count of active users (at least one activity within the last 30 days)
    const activeUserCount = await prisma.user.count({
      where: {
        activities: {
          some: {
            activity_time: {
              gte: cutoffDate,
            },
          },
        },
      },
    });

    // Count of inactive users (no activity within the last 30 days)
    const inactiveUserCount = userCount - activeUserCount;

    // Send response with user list and counts
    res.json({
      users,
      userCount,
      newUserCount,
      activeUserCount,
      inactiveUserCount,
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get order analytics
router.get("/orders", async (req, res) => {
  try {
    // Fetch the total count of orders
    const orderCount = await prisma.order.count();

    // Fetch detailed order information, including items and user details
    const orders = await prisma.order.findMany({
      select: {
        order_id: true,
        user: {
          select: {
            email: true,
            full_name: true,
          },
        },
        order_date: true,
        total_amount: true,
        payment_status: true,
        items: {
          select: {
            product: {
              select: {
                title: true,
                price: true,
                category: true,
              },
            },
            quantity: true,
            price: true,
          },
        },
        coupon: {
          select: {
            code: true,
            discount_amount: true,
            discount_percent: true,
          },
        },
      },
      orderBy: {
        order_date: "desc", // Orders fetched in descending order by date
      },
    });

    // Send response with order count and order details
    res.json({
      orderCount,
      orders,
    });
  } catch (error) {
    console.error("Error fetching order data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Generate and save an analytics report
router.post("/generate-report", async (req, res) => {
  try {
    const { report_type, data } = req.body;

    const newReport = await prisma.analyticsReport.create({
      data: {
        report_type,
        data,
      },
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error generating analytics report:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
