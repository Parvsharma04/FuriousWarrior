const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/signin", async (req, res) => {
  try {
    const { password, email } = req.body;
    await prisma.$connect();
    console.log(req.body);
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password." });
    }


    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    req.session.user = {
      id: existingUser.id,
      email: existingUser.email,
      fullName: existingUser.full_name,
    };

    res.status(200).json({
      message: "Login successful",
      fullname: existingUser.full_name,
      phone: existingUser.phone_number,
    });
  } catch (error) {
    console.error("Error occurred during signin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
