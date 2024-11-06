const router = require("express").Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  try {
    const { fullname, phonenumber, password, email } = req.body;
    await prisma.$connect();

    // Check if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.json({
        message: "User Already Exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entry
    const newUser = await prisma.user.create({
      data: {
        full_name: fullname,
        email: email,
        phone_number: phonenumber,
        password_hash: hashedPassword,
        signup_date: new Date(),
      },
    });

    // Set session user and send success message
    req.session.user = newUser;
    res.status(200).json({
      message: "Registered Successfully.",
    });
  } catch (error) {
    console.error("Error occurred during signup:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
