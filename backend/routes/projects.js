const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /api/projects - list projects user is a member of
router.get('/projects', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const projects = await Project.find({
      'members.user': userId
    }).sort({ createdAt: -1 });

    const formatted = await Promise.all(projects.map(async (p) => {
      const tasks = await Task.find({ project: p._id });
      
      let todo = 0, inProgress = 0, done = 0;
      for (const t of tasks) {
        if (t.status === 'TODO') todo++;
        if (t.status === 'IN_PROGRESS') inProgress++;
        if (t.status === 'DONE') done++;
      }

      return {
        id: p._id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
        members: p.members.length,
        tasks: { todo, inProgress, done },
      };
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - create new project
router.post('/projects', auth, async (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  try {
    const project = await Project.create({
      name,
      description,
      members: [{
        user: userId,
        role: 'ADMIN'
      }]
    });

    res.status(201).json({
      id: project._id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      members: project.members.length,
      tasks: { todo: 0, inProgress: 0, done: 0 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id - get project details
router.get('/projects/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const project = await Project.findOne({
      _id: id,
      'members.user': userId
    }).populate('members.user', 'name');

    if (!project) return res.status(404).json({ error: 'Project not found' });

    const tasks = await Task.find({ project: id }).populate('assignedTo', 'name');

    const formatted = {
      id: project._id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      members: project.members.map((m) => ({
        id: m.user._id,
        name: m.user.name,
        role: m.role,
        avatar: m.user.name.charAt(0).toUpperCase(),
      })),
      tasks: tasks.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo ? t.assignedTo._id : null,
        createdAt: t.createdAt
      })),
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

module.exports = router;
