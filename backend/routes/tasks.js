const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/rbac');

// POST /api/tasks - Only Admin can assign tasks
router.post('/tasks', auth, isAdmin, async (req, res) => {
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
  const userRole = req.user.role;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Logic: 
    // - Admin can change everything.
    // - Member can ONLY change status (e.g. move to Done), not title/desc/assignee.
    
    if (userRole === 'ADMIN') {
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status || task.status;
      task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
      task.assignedTo = assignedToId || task.assignedTo;
    } else {
      // Member can only update status
      if (title || description || dueDate || assignedToId) {
        return res.status(403).json({ error: 'Members can only update task status' });
      }
      task.status = status || task.status;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
