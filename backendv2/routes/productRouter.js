const { PrismaClient } = require("@prisma/client");
const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const adminMiddleware = require("../middleware/admin.middleware.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Configure multer as needed

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { file: true }, // Includes related Document if available
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get product categories
router.get("/product-categories", (req, res) => {
  const categories = [
    "DOCUMENT",
    "SERVICE",
    "CONSULTANCY",
    "TRAINING",
    "PRODUCT",
    "ADVERTISING",
  ];

  res.status(200).json({
    categories: categories,
  });
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { item_id: parseInt(req.params.id) },
      include: { file: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new product (admin only)

router.post("/", upload.single("document"), async (req, res) => {
  console.log("Received body:", req.body);
  console.log("Received file:", req.file);
  try {
    const { title, description, price, category, available_stock } = req.body;

    // Validation for required fields
    if (!title || !description || !price || !category || !available_stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert numeric fields
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(available_stock);

    // Optional file handling
    let documentId = null;
    if (req.file) {
      const document = await prisma.document.create({
        data: {
          title: title,
          description: description,
          price: parsedPrice,
          download_limit: parsedStock,
          file_path: req.file.path, // Assuming `file_path` in Document model
          filename: req.file.originalname,
        },
      });
      documentId = document.document_id;
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: parsedPrice,
        category, // Make sure category is valid enum value
        available_stock: parsedStock,
        document_id: documentId,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update an existing product by ID (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      available_stock,
      document_id,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { item_id: parseInt(req.params.id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        category, // Update category as enum
        available_stock: parseInt(available_stock),
        document_id: document_id ? parseInt(document_id) : null, // Optional document_id
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a product by ID (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { item_id: parseInt(req.params.id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
