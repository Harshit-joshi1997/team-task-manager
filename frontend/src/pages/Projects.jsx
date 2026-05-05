import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import './Projects.css';

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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [projects, setProjects] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  function handleOpen(id) {
    navigate(`/projects/${id}`);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) { setNameError('Project name is required'); return; }

    try {
      const { data } = await api.post('/projects', {
        name: newName.trim(),
        description: newDesc.trim(),
      });

      setProjects((prev) => [data, ...prev]);
      setShowNew(false);
      setNewName('');
      setNewDesc('');
      setNameError('');
    } catch (err) {
      console.error('Failed to create project', err);
      setNameError('Failed to create project');
    }
  }

  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} active projects</p>
        </div>
        {isAdmin && (
          <button className="btn btn--primary" id="create-project-btn" onClick={() => setShowNew(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Project
          </button>
        )}
      </header>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="projects-empty">
            <div className="projects-empty__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h3 className="projects-empty__title">No projects yet</h3>
            <p className="projects-empty__subtitle">Create your first project to start managing tasks with your team.</p>
            <button className="btn btn--primary" onClick={() => setShowNew(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create First Project
            </button>
          </div>
        ) : (
          projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={handleOpen} />
          ))
        )}
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
                <label className="form-label">Project Name *</label>
                <input
                  id="new-project-name"
                  className={`form-input${nameError ? ' form-input--error' : ''}`}
                  placeholder="e.g. Backend API"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setNameError(''); }}
                  required
                  autoFocus
                />
                {nameError && <p className="form-error">{nameError}</p>}
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
