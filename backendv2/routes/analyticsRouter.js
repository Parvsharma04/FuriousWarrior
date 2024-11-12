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

// Get order analytics
router.get("/orders", async (req, res) => {
  try {
    const orderAnalytics = await prisma.order.aggregate({
      _sum: {
        total_amount: true,
      },
      _count: {
        order_id: true,
      },
    });

    res.json(orderAnalytics);
  } catch (error) {
    console.error("Error fetching order analytics:", error.message);
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
