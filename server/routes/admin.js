const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminLayout = "../views/layouts/admin";

const jwtSecret = process.env.JWT_SECRET;
/**
 * Check-Login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "unautorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "unautorized" });
  }
};
/**
 * GET /
 * Admin-Login-page
 */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});
router.get("/about", (req, res) => {
  res.render("about");
});

/**
 * POST /
 * Admin-Check Login
 */

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashbord");
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin-Check Login
 */

router.get("/dashbord", authMiddleware, async (req, res) => {
  res.render("admin/dashbord");
});

/**
 * POST /
 * Admin-Register
 */

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unexpected server error" });
  }
});
router.get("/test", (req, res) => {
  res.json({ message: "Test route working fine" });
});

module.exports = router;
