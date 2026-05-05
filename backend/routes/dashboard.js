const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /api/dashboard
router.get('/dashboard', auth, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const now = new Date();
    
    // If Admin, they see global stats. If Member, they see only their own.
    const filter = userRole === 'ADMIN' ? {} : { assignedTo: userId };

    const [total, todo, inProgress, done, overdueCount, overdueTasks, recentTasks] =
      await Promise.all([
        Task.countDocuments(filter),
        Task.countDocuments({ ...filter, status: 'TODO' }),
        Task.countDocuments({ ...filter, status: 'IN_PROGRESS' }),
        Task.countDocuments({ ...filter, status: 'DONE' }),
        Task.countDocuments({ ...filter, dueDate: { $lt: now }, status: { $ne: 'DONE' } }),
        // Overdue task list (max 5)
        Task.find({ ...filter, dueDate: { $lt: now }, status: { $ne: 'DONE' } })
          .sort({ dueDate: 1 })
          .limit(5)
          .populate('project', 'name')
          .populate('assignedTo', 'name'),
        // Recent tasks (max 5)
        Task.find(userRole === 'ADMIN' ? {} : { $or: [{ createdBy: userId }, { assignedTo: userId }] })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('createdBy', 'name')
          .populate('project', 'name')
          .populate('assignedTo', 'name'),
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
        project: t.project,
        assignedTo: t.assignedTo
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
