const router = require("express").Router();
const Project = require("../models/Project");
const Task = require("../models/task");
const auth = require("../middleware/auth");

// CREATE PROJECT
router.post("/", auth, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description || "",
      createdBy: req.user.id,
      members: [req.user.id], // creator is also a member
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PROJECTS (only where user is member)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PROJECT (only creator can delete)
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Only creator can delete
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Project.findByIdAndDelete(req.params.id);

    // Delete related tasks
    await Task.deleteMany({ projectId: req.params.id });

    res.json({ msg: "Project deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;