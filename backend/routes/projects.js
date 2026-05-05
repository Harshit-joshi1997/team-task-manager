const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// GET /api/projects - list projects user is a member of
router.get('/projects', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = projects.map((p) => {
      let todo = 0, inProgress = 0, done = 0;
      for (const t of p.tasks) {
        if (t.status === 'TODO') todo++;
        if (t.status === 'IN_PROGRESS') inProgress++;
        if (t.status === 'DONE') done++;
      }
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
        members: p._count.members,
        tasks: { todo, inProgress, done },
      };
    });

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
    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: 'ADMIN', // creator is admin
          },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    res.status(201).json({
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      members: project._count.members,
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
    const project = await prisma.project.findFirst({
      where: {
        id,
        members: { some: { userId } },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        tasks: true,
      },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Format members and tasks
    const formatted = {
      ...project,
      members: project.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        role: m.role,
        avatar: m.user.name.charAt(0).toUpperCase(),
      })),
      tasks: project.tasks.map((t) => ({
        ...t,
        assignedTo: t.assignedToId,
      })),
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

module.exports = router;
