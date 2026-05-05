const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// GET /api/dashboard
router.get('/dashboard', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const now = new Date();

    const [total, todo, inProgress, done, overdueCount, overdueTasks, recentTasks] =
      await Promise.all([
        prisma.task.count({ where: { assignedToId: userId } }),
        prisma.task.count({ where: { assignedToId: userId, status: 'TODO' } }),
        prisma.task.count({ where: { assignedToId: userId, status: 'IN_PROGRESS' } }),
        prisma.task.count({ where: { assignedToId: userId, status: 'DONE' } }),
        prisma.task.count({
          where: { assignedToId: userId, dueDate: { lt: now }, status: { not: 'DONE' } },
        }),
        // Overdue task list (max 5)
        prisma.task.findMany({
          where: { assignedToId: userId, dueDate: { lt: now }, status: { not: 'DONE' } },
          orderBy: { dueDate: 'asc' },
          take: 5,
          include: {
            project: { select: { name: true } },
            assignedTo: { select: { name: true } },
          },
        }),
        // Recent tasks created by or assigned to this user (max 5)
        prisma.task.findMany({
          where: {
            OR: [{ createdById: userId }, { assignedToId: userId }],
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            createdBy: { select: { name: true } },
            project: { select: { name: true } },
          },
        }),
      ]);

    res.json({
      stats: { total, todo, inProgress, done, overdue: overdueCount },
      overdueTasks,
      recentTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
