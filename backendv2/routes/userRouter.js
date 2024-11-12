const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const JWT_SECRET = "thisisasecret";

router.post("/signin", async (req, res) => {
  try {
    const { password, email } = req.body;
    await prisma.$connect();
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

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
      id: existingUser.user_id,
      email: existingUser.email,
      fullName: existingUser.full_name,
    };

    const token = jwt.sign(
      {
        id: existingUser.user_id,
        email: existingUser.email,
        fullName: existingUser.full_name,
        role: existingUser.user_role,
        phonenumber: existingUser.phone_number,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Log the signin action in UserActivity
    await prisma.userActivity.create({
      data: {
        user_id: existingUser.user_id,
        activity_type: "LOGIN",
      },
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error occurred during signin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

router.post("/signup", async (req, res) => {
  let { fullname, phonenumber, password, email } = req.body;
  let prefix;
  let formattedEmail = "";
  if (email.startsWith("admin..")) {
    prefix = "ADMIN";
    formattedEmail = email.startsWith("admin..")
      ? email.replace("admin..", "")
      : email;
  } else if (email.startsWith("moderator..")) {
    prefix = "MODERATOR";
    formattedEmail = email.startsWith("moderator..")
      ? email.replace("moderator..", "")
      : email;
  } else {
    prefix = "USER";
    formattedEmail = email;
  }
  // console.log(req.body);
  try {
    await prisma.$connect();
    const existingUser = await prisma.user.findFirst({
      where: { email: formattedEmail },
    });
    // console.log(existingUser);
    if (existingUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        full_name: fullname,
        email: formattedEmail,
        phone_number: phonenumber,
        password_hash: hashedPassword,
        signup_date: new Date(),
        user_role: prefix,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.user_id,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.user_role,
        phonenumber: newUser.phone_number,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Log the signup action in UserActivity
    await prisma.userActivity.create({
      data: {
        user_id: newUser.user_id,
        activity_type: "SIGNUP",
      },
    });

    res.status(201).json({
      message: "Registered Successfully.",
      token: token,
    });
  } catch (error) {
    console.error("Error occurred during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
