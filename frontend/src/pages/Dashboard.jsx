import { useState } from 'react';
import './Dashboard.css';

/* ── Mock Data ── */
const STATS = [
  { label: 'To Do',       value: 8,  color: 'var(--teal)',   bg: 'var(--teal-dim)',   status: 'TODO' },
  { label: 'In Progress', value: 5,  color: 'var(--orange)', bg: 'var(--orange-dim)', status: 'IN_PROGRESS' },
  { label: 'Done',        value: 12, color: 'var(--green)',  bg: 'var(--green-dim)',  status: 'DONE' },
  { label: 'Overdue',     value: 3,  color: 'var(--red)',    bg: 'var(--red-dim)',    status: 'OVERDUE' },
];

const OVERDUE = [
  { id: 1, title: 'Fix authentication bug', project: 'Backend API', dueDate: '2026-04-28', assignee: 'Harshit' },
  { id: 2, title: 'Update user dashboard UI', project: 'Frontend App', dueDate: '2026-04-30', assignee: 'Priya' },
  { id: 3, title: 'Write API documentation', project: 'Backend API', dueDate: '2026-05-01', assignee: 'Raj' },
];

const ACTIVITY = [
  { id: 1, user: 'Harshit', action: 'created task', target: 'Implement auth middleware', time: '2 min ago', avatar: 'H' },
  { id: 2, user: 'Priya',   action: 'moved task to Done', target: 'Design system setup', time: '14 min ago', avatar: 'P' },
  { id: 3, user: 'Raj',     action: 'commented on', target: 'Kanban board layout', time: '1 hr ago', avatar: 'R' },
  { id: 4, user: 'Harshit', action: 'assigned task to Priya', target: 'Dashboard analytics', time: '3 hr ago', avatar: 'H' },
  { id: 5, user: 'Meera',   action: 'completed task', target: 'User registration flow', time: 'Yesterday', avatar: 'M' },
];

function StatCard({ label, value, color, bg }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color, '--card-bg': bg }}>
      <div className="stat-card__icon" style={{ background: bg }}>
        <div className="stat-card__dot" style={{ background: color }} />
      </div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
}

function OverdueRow({ task }) {
  const days = Math.floor(
    (Date.now() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)
  );
  return (
    <div className="overdue-row">
      <div className="overdue-row__info">
        <span className="overdue-row__title">{task.title}</span>
        <span className="overdue-row__project">{task.project}</span>
      </div>
      <div className="overdue-row__meta">
        <span className="overdue-row__badge">{days}d overdue</span>
        <span className="overdue-row__assignee">{task.assignee}</span>
      </div>
    </div>
  );
}

function ActivityItem({ item }) {
  return (
    <div className="activity-item">
      <div className="activity-item__avatar">{item.avatar}</div>
      <div className="activity-item__body">
        <p className="activity-item__text">
          <span className="activity-item__user">{item.user}</span>{' '}
          {item.action}{' '}
          <span className="activity-item__target">"{item.target}"</span>
        </p>
        <p className="activity-item__time">{item.time}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, Harshit 👋</p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="dashboard__stats">
        {STATS.map((s) => (
          <StatCard key={s.status} {...s} />
        ))}
      </section>

      {/* Bottom Grid: Overdue + Activity */}
      <div className="dashboard__grid">
        {/* Overdue Tasks */}
        <section className="panel">
          <h2 className="panel__title">
            <span className="panel__title-dot" style={{ background: 'var(--red)' }} />
            Overdue Tasks
          </h2>
          <div className="panel__body">
            {OVERDUE.map((t) => (
              <OverdueRow key={t.id} task={t} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="panel">
          <h2 className="panel__title">
            <span className="panel__title-dot" style={{ background: 'var(--accent)' }} />
            Recent Activity
          </h2>
          <div className="panel__body">
            {ACTIVITY.map((a) => (
              <ActivityItem key={a.id} item={a} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
