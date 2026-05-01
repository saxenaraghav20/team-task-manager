const router = require("express").Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Create Project
router.post("/", auth, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
      members: [req.user.id] // creator is also a member
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Projects (only where user is member)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    // Optional: also delete tasks of this project
    await Task.deleteMany({ projectId: req.params.id });

    res.json({ msg: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;