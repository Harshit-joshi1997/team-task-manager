import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskModal from '../components/TaskModal';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import './ProjectDetail.css';

const COLUMNS = [
  { key: 'TODO',        label: 'To Do',       color: 'var(--teal)',   dot: 'var(--teal)' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'var(--orange)', dot: 'var(--orange)' },
  { key: 'DONE',        label: 'Done',        color: 'var(--green)',  dot: 'var(--green)' },
];

function MemberBadge({ member }) {
  return (
    <div className="member-badge">
      <div className="member-badge__avatar">{member.avatar}</div>
      <div className="member-badge__info">
        <p className="member-badge__name">{member.name}</p>
        <p className={`member-badge__role member-badge__role--${member.role.toLowerCase()}`}>
          {member.role}
        </p>
      </div>
    </div>
  );
}

function TaskCard({ task, member, onClick }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
  return (
    <div className="task-card" onClick={() => onClick(task)}>
      <p className="task-card__title">{task.title}</p>
      {task.description && <p className="task-card__desc">{task.description}</p>}
      <div className="task-card__footer">
        {member && (
          <div className="task-card__assignee">
            <span className="task-card__avatar">{member.avatar}</span>
            <span className="task-card__assignee-name">{member.name.split(' ')[0]}</span>
          </div>
        )}
        {task.dueDate && (
          <span className={`task-card__due ${isOverdue ? 'task-card__due--overdue' : ''}`}>
            {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
        setTasks(data.tasks);
      } catch (err) {
        console.error('Failed to load project', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  function openCreate() { setEditingTask(null); setModalOpen(true); }
  function openEdit(task) { setEditingTask(task); setModalOpen(true); }

  async function handleSave(taskData) {
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask.id}`, taskData);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t)));
      } else {
        const { data } = await api.post('/tasks', { ...taskData, projectId: id });
        setTasks((prev) => [...prev, data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save task', err);
    }
  }

  if (loading) return <div className="loading-state">Loading project details...</div>;
  if (!project) return <div className="error-state">Project not found</div>;

  const memberMap = Object.fromEntries(project.members.map((m) => [m.id, m]));

  return (
    <div className="project-detail">
      {/* Page Header */}
      <header className="page-header">
        <div className="project-detail__heading">
          <button className="back-btn" id="back-to-projects" onClick={() => navigate('/projects')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Projects
          </button>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">{project.description}</p>
        </div>
        {isAdmin && (
          <button className="btn btn--primary" id="add-task-btn" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Task
          </button>
        )}
      </header>

      {/* Members */}
      <section className="project-detail__members">
        <h2 className="section-title">Team Members</h2>
        <div className="members-list">
          {project.members.map((m) => (
            <MemberBadge key={m.id} member={m} />
          ))}
        </div>
      </section>

      {/* Kanban Board */}
      <section className="kanban">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="kanban__col">
              <div className="kanban__col-header">
                <span className="kanban__col-dot" style={{ background: col.color }} />
                <span className="kanban__col-label">{col.label}</span>
                <span className="kanban__col-count">{colTasks.length}</span>
              </div>
              <div className="kanban__cards">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    member={task.assignedTo ? memberMap[task.assignedTo] : null}
                    onClick={openEdit}
                  />
                ))}
                {isAdmin && (
                  <button className="kanban__add-btn" onClick={openCreate}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          members={project.members}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
