const router = require("express").Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

// Create Task
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks (by project)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
  projectId: req.query.projectId
}).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task (status change)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;