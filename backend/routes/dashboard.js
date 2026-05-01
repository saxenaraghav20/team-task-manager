const Project = require("../models/Project");
const router = require("express").Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    // 1. Get user's projects
    const projects = await Project.find({
      createdBy: req.user.id,
    });

    const projectIds = projects.map(p => p._id);

    // 2. Get tasks only from those projects
    const tasks = await Task.find({
      projectId: { $in: projectIds },
    });

    const total = tasks.length;

    const completed = tasks.filter(
      t => t.status === "done"
    ).length;

    const overdue = tasks.filter(
      t =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== "done"
    ).length;

    res.json({
      total,
      completed,
      pending: total - completed,
      overdue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;