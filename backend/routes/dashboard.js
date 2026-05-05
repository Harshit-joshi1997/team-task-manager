const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /api/dashboard
router.get('/dashboard', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const now = new Date();

    const [total, todo, inProgress, done, overdueCount, overdueTasks, recentTasks] =
      await Promise.all([
        Task.countDocuments({ assignedTo: userId }),
        Task.countDocuments({ assignedTo: userId, status: 'TODO' }),
        Task.countDocuments({ assignedTo: userId, status: 'IN_PROGRESS' }),
        Task.countDocuments({ assignedTo: userId, status: 'DONE' }),
        Task.countDocuments({ assignedTo: userId, dueDate: { $lt: now }, status: { $ne: 'DONE' } }),
        // Overdue task list (max 5)
        Task.find({ assignedTo: userId, dueDate: { $lt: now }, status: { $ne: 'DONE' } })
          .sort({ dueDate: 1 })
          .limit(5)
          .populate('project', 'name')
          .populate('assignedTo', 'name'),
        // Recent tasks created by or assigned to this user (max 5)
        Task.find({
          $or: [{ createdBy: userId }, { assignedTo: userId }],
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('createdBy', 'name')
          .populate('project', 'name'),
      ]);

    res.json({
      stats: { total, todo, inProgress, done, overdue: overdueCount },
      overdueTasks: overdueTasks.map(t => ({
        id: t._id,
        title: t.title,
        dueDate: t.dueDate,
        project: t.project,
        assignedTo: t.assignedTo
      })),
      recentTasks: recentTasks.map(t => ({
        id: t._id,
        title: t.title,
        createdAt: t.createdAt,
        createdBy: t.createdBy,
        project: t.project
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
