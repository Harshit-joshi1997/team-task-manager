const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/rbac');

// GET /api/tasks - list tasks with filters
router.get('/tasks', auth, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { status, overdue } = req.query;

  try {
    let query = userRole === 'ADMIN' ? {} : { assignedTo: userId };

    if (status) {
      query.status = status;
    }

    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'DONE' };
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      dueDate: t.dueDate,
      project: t.project,
      assignedTo: t.assignedTo
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Only Admin can assign tasks
router.post('/tasks', auth, isAdmin, async (req, res) => {
  const userId = req.user.id;
  const { title, description, status, dueDate, projectId, assignedTo } = req.body;

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
      assignedTo: assignedTo || null,
      createdBy: userId,
    res.status(201).json({
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      project: task.project,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt
    });
  } catch (err) {
    console.error('Task Creation Error:', err);
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, assignedTo } = req.body;
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
      if (dueDate !== undefined) {
        task.dueDate = dueDate ? new Date(dueDate) : null;
      }
      task.assignedTo = assignedTo || task.assignedTo;
    } else {
      // Member can only update status
      if (title || description || dueDate || assignedTo) {
        return res.status(403).json({ error: 'Members can only update task status' });
      }
      task.status = status || task.status;
    }

    await task.save();
    res.json({
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      project: task.project,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt
    });
  } catch (err) {
    console.error('Task Update Error:', err);
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
});

module.exports = router;
