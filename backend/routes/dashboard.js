const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /api/dashboard
router.get('/dashboard', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const [total, todo, inProgress, done, overdue] = await Promise.all([
      prisma.task.count({ where: { assignedToId: userId } }),
      prisma.task.count({ where: { assignedToId: userId, status: 'TODO' } }),
      prisma.task.count({ where: { assignedToId: userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { assignedToId: userId, status: 'DONE' } }),
      prisma.task.count({
        where: {
          assignedToId: userId,
          dueDate: { lt: new Date() },
          status: { not: 'DONE' },
        },
      }),
    ]);
    res.json({ total, todo, inProgress, done, overdue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

module.exports = router;
