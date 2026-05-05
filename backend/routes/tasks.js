const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// POST /api/tasks
router.post('/tasks', auth, async (req, res) => {
  const userId = req.user.id;
  const { title, description, status, dueDate, projectId, assignedToId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ error: 'Title and projectId are required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId,
        createdById: userId,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id
router.put('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, assignedToId } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId,
      },
    });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
