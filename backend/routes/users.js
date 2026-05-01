const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get all users
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;