const router = require("express").Router();
const Team = require("../models/team");
const auth = require("../middleware/auth");

// Create team
router.post("/", auth, async (req, res) => {
  try {
    const { name, members } = req.body;

    const team = new Team({
      name,
      members,
      createdBy: req.user.id,
    });

    await team.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all teams
router.get("/", auth, async (req, res) => {
  try {
    const teams = await Team.find({
      createdBy: req.user.id,
    }).populate("members", "name email");

    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;