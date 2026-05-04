import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskModal from '../components/TaskModal';
import './ProjectDetail.css';

/* ── Mock Data ── */
const MOCK_PROJECT = {
  id: '1',
  name: 'Backend API',
  description: 'Node/Express REST API with authentication, Prisma ORM, and role-based access control.',
  members: [
    { id: 'u1', name: 'Harshit Joshi', role: 'ADMIN',  avatar: 'H' },
    { id: 'u2', name: 'Priya Sharma',  role: 'MEMBER', avatar: 'P' },
    { id: 'u3', name: 'Raj Verma',     role: 'MEMBER', avatar: 'R' },
    { id: 'u4', name: 'Meera Singh',   role: 'MEMBER', avatar: 'M' },
  ],
  tasks: [
    { id: 't1', title: 'Set up Express server',        description: 'Initialize project, install deps.', status: 'DONE',        dueDate: '2026-04-20', assignedTo: 'u1', createdById: 'u1' },
    { id: 't2', title: 'Implement auth middleware',    description: 'JWT verify, attach req.user.',      status: 'DONE',        dueDate: '2026-04-22', assignedTo: 'u1', createdById: 'u1' },
    { id: 't3', title: 'Prisma schema design',         description: 'User, Project, Task models.',       status: 'DONE',        dueDate: '2026-04-25', assignedTo: 'u2', createdById: 'u1' },
    { id: 't4', title: 'User registration endpoint',   description: 'POST /api/register with bcrypt.',   status: 'IN_PROGRESS', dueDate: '2026-05-05', assignedTo: 'u2', createdById: 'u1' },
    { id: 't5', title: 'Projects CRUD routes',         description: 'Create, list, update, delete.',     status: 'IN_PROGRESS', dueDate: '2026-05-07', assignedTo: 'u3', createdById: 'u1' },
    { id: 't6', title: 'Task assignment feature',      description: 'Assign tasks to project members.',  status: 'TODO',        dueDate: '2026-05-10', assignedTo: 'u3', createdById: 'u1' },
    { id: 't7', title: 'Role-based access control',    description: 'requireRole middleware.',            status: 'TODO',        dueDate: '2026-05-12', assignedTo: 'u4', createdById: 'u1' },
    { id: 't8', title: 'Write API tests',              description: 'Jest + Supertest integration tests.',status: 'TODO',        dueDate: '2026-05-15', assignedTo: null, createdById: 'u1' },
  ],
};

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
  const project = MOCK_PROJECT; // In real app: fetch by id

  const [tasks, setTasks] = useState(project.tasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  function openCreate() { setEditingTask(null); setModalOpen(true); }
  function openEdit(task) { setEditingTask(task); setModalOpen(true); }

  function handleSave(taskData) {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)));
    } else {
      setTasks((prev) => [...prev, { id: `t${Date.now()}`, ...taskData, createdById: 'u1' }]);
    }
    setModalOpen(false);
  }

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
        <button className="btn btn--primary" id="add-task-btn" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Task
        </button>
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
                <button className="kanban__add-btn" onClick={openCreate}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add task
                </button>
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
