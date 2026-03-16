const User = require("../models/User");
const { syncAllPlatforms } = require("../syncService");

/* GET USER PROFILE */

const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
};


/* UPDATE PLATFORM HANDLES */

const updatePlatforms = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    user.platforms = {
      ...user.platforms,
      ...req.body.platforms
    };

    await user.save();

    await syncAllPlatforms(user);

    res.json(user);

  } catch (err) {

    console.error("Platform update error:", err);

    res.status(500).json({ error: err.message });

  }
};


module.exports = {
  getProfile,
  updatePlatforms
};