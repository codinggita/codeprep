// const bcrypt = require("bcrypt");
// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");
// const { syncAllPlatforms } = require("../syncService");

// const {
//   validateLeetCode,
//   validateCodeforces
// } = require("../services/platformValidation");

const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { syncAllPlatforms } = require("../syncService");

const {
  validateLeetCode,
  validateCodeforces
} = require("../services/platformValidation");

// REGISTER USER
exports.registerUser = async (req, res) => {

  try {

    const { username, email, password, platforms } = req.body;

    const leetcode = platforms?.leetcode;
    const codeforces = platforms?.codeforces;

    // Require at least one platform
    if (!leetcode && !codeforces) {
      return res.status(400).json({
        message: "At least one platform (LeetCode or Codeforces) is required"
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Validate LeetCode handle if provided
    if (leetcode) {

      const validLC = await validateLeetCode(leetcode);

      if (!validLC) {
        return res.status(400).json({
          message: "Invalid LeetCode username"
        });
      }

    }

    // Validate Codeforces handle if provided
    if (codeforces) {

      const validCF = await validateCodeforces(codeforces);

      if (!validCF) {
        return res.status(400).json({
          message: "Invalid Codeforces handle"
        });
      }

    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      platforms: {
        leetcode,
        codeforces
      }
    });

    res.status(201).json({

      message: "User registered successfully",

      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        platforms: user.platforms,
        dailyGoal: user.dailyGoal,
        streak: user.streak
      },

      token: generateToken(user._id)

    });
    
    // Background sync on register
    syncAllPlatforms(user).catch(err => console.error("Register sync failed:", err));

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};

// const { syncAllPlatforms } = require("../syncService");

exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("LOGIN SUCCESS — starting sync");

    // force sync
    await syncAllPlatforms(user);

    const token = generateToken(user._id);

    res.json({
      token,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};