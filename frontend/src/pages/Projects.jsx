import { useState } from 'react';
import './Projects.css';

/* ── Mock Data ── */
const MOCK_PROJECTS = [
  { id: '1', name: 'Backend API', description: 'Node/Express REST API with auth, Prisma ORM.', members: 4, tasks: { todo: 5, inProgress: 3, done: 8 }, createdAt: '2026-04-10' },
  { id: '2', name: 'Frontend App', description: 'React + Vite SPA — Kanban, dashboard, task management.', members: 3, tasks: { todo: 7, inProgress: 2, done: 5 }, createdAt: '2026-04-15' },
  { id: '3', name: 'Mobile App', description: 'React Native cross-platform mobile application.', members: 2, tasks: { todo: 3, inProgress: 1, done: 2 }, createdAt: '2026-04-20' },
  { id: '4', name: 'DevOps Pipeline', description: 'CI/CD setup with Docker, GitHub Actions, deployments.', members: 2, tasks: { todo: 4, inProgress: 2, done: 6 }, createdAt: '2026-04-22' },
];

function ProjectCard({ project, onOpen }) {
  const total = project.tasks.todo + project.tasks.inProgress + project.tasks.done;
  const donePercent = total ? Math.round((project.tasks.done / total) * 100) : 0;

  return (
    <div className="project-card" onClick={() => onOpen(project.id)}>
      <div className="project-card__header">
        <div className="project-card__icon">
          {project.name.charAt(0)}
        </div>
        <div className="project-card__meta">
          <h3 className="project-card__name">{project.name}</h3>
          <p className="project-card__date">Since {new Date(project.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <p className="project-card__desc">{project.description}</p>

      <div className="project-card__progress">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${donePercent}%` }} />
        </div>
        <span className="progress-bar__label">{donePercent}% complete</span>
      </div>

      <div className="project-card__stats">
        <div className="task-pill task-pill--todo">
          <span className="task-pill__dot" />
          {project.tasks.todo} Todo
        </div>
        <div className="task-pill task-pill--progress">
          <span className="task-pill__dot" />
          {project.tasks.inProgress} In Progress
        </div>
        <div className="task-pill task-pill--done">
          <span className="task-pill__dot" />
          {project.tasks.done} Done
        </div>
      </div>

      <div className="project-card__footer">
        <div className="member-avatars">
          {Array.from({ length: Math.min(project.members, 3) }).map((_, i) => (
            <div key={i} className="member-avatars__item">{String.fromCharCode(65 + i)}</div>
          ))}
          {project.members > 3 && (
            <div className="member-avatars__more">+{project.members - 3}</div>
          )}
        </div>
        <span className="project-card__member-count">{project.members} members</span>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects] = useState(MOCK_PROJECTS);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  function handleOpen(id) {
    window.location.href = `/projects/${id}`;
  }

  function handleCreate(e) {
    e.preventDefault();
    setShowNew(false);
    setNewName('');
    setNewDesc('');
  }

  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} active projects</p>
        </div>
        <button className="btn btn--primary" id="create-project-btn" onClick={() => setShowNew(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </button>
      </header>

      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={handleOpen} />
        ))}
      </div>

      {/* New Project Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Create New Project</h2>
              <button className="modal__close" onClick={() => setShowNew(false)}>✕</button>
            </div>
            <form className="modal__body" onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  id="new-project-name"
                  className="form-input"
                  placeholder="e.g. Backend API"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  id="new-project-desc"
                  className="form-input form-textarea"
                  placeholder="Brief description of this project..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setShowNew(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
