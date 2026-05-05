const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// POST /api/tasks
router.post('/tasks', auth, async (req, res) => {
  const userId = req.user.id;
  const { title, description, status, dueDate, projectId, assignedToId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ error: 'Title and projectId are required' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      status: status || 'TODO',
      dueDate: dueDate ? new Date(dueDate) : null,
      project: projectId,
      assignedTo: assignedToId || null,
      createdBy: userId,
    });
    
    const formatted = {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt
    };

    res.status(201).json(formatted);
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
    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedToId || null,
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    const formatted = {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
