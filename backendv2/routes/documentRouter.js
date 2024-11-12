const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware.js");
const { adminMiddleware } = require("../middleware/admin.middleware.js");

const router = express.Router();
const prisma = new PrismaClient();

// Get all documents
router.get("/", async (req, res) => {
  try {
    const documents = await prisma.document.findMany();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single document
router.get("/:id", async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { document_id: parseInt(req.params.id) },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new document (admin only)
router.post("/", async (req, res) => {
  try {
    const { title, description, price, download_limit } = req.body;

    const newDocument = await prisma.document.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        download_limit: parseInt(download_limit),
      },
    });

    res.status(201).json(newDocument);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a document (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, price, download_limit } = req.body;

    const updatedDocument = await prisma.document.update({
      where: { document_id: parseInt(req.params.id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        download_limit: parseInt(download_limit),
      },
    });

    res.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a document (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await prisma.document.delete({
      where: { document_id: parseInt(req.params.id) },
    });

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Download a document
router.post("/:id/download", async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user.id;

    const document = await prisma.document.findUnique({
      where: { document_id: documentId },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the user has already downloaded this document
    const existingDownload = await prisma.documentDownload.findFirst({
      where: {
        user_id: userId,
        document_id: documentId,
      },
    });

    if (existingDownload && document.download_limit > 0) {
      // Check if the download limit has been reached
      const downloadCount = await prisma.documentDownload.count({
        where: {
          user_id: userId,
          document_id: documentId,
        },
      });

      if (downloadCount >= document.download_limit) {
        return res.status(403).json({ message: "Download limit reached" });
      }
    }

    // Create a new download record
    await prisma.documentDownload.create({
      data: {
        user_id: userId,
        document_id: documentId,
      },
    });

    // In a real-world scenario, you would generate a download link or stream the file here
    res.json({
      message: "Document download initiated",
      downloadUrl: "https://example.com/download/link",
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
