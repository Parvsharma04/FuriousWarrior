const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const adminMiddleware = require("./middleware/admin.middleware");
const moderatorMiddleware = require("./middleware/moderator.middleware");
const authMiddleware = require("./middleware/auth.middleware");

// Import routers
const analyticsRouter = require("./routes/analyticsRouter.js");
const documentRouter = require("./routes/documentRouter.js");
const orderRouter = require("./routes/orderRouter.js");
const productRouter = require("./routes/productRouter.js");
const couponRouter = require("./routes/couponRouter.js");
const userRouter = require("./routes/userRouter.js");

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/documents", documentRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("FuriousWarrior API Server Online");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(8000, () => {
  console.log("server online");
});
