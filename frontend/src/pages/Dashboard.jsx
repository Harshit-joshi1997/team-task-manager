import useAuthStore from '../store/useAuthStore';
import './Dashboard.css';

const STAT_DEFS = [
  { label: 'To Do',       key: 'todo',       color: 'var(--teal)',   bg: 'var(--teal-dim)'   },
  { label: 'In Progress', key: 'inProgress',  color: 'var(--orange)', bg: 'var(--orange-dim)' },
  { label: 'Done',        key: 'done',        color: 'var(--green)',  bg: 'var(--green-dim)'  },
  { label: 'Overdue',     key: 'overdue',     color: 'var(--red)',    bg: 'var(--red-dim)'    },
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

function EmptyPanel({ message }) {
  return (
    <div className="panel-empty">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
      </svg>
      <p>{message}</p>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] || 'there';

  // Stats are all zero until backend is connected
  const stats = { todo: 0, inProgress: 0, done: 0, overdue: 0 };

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {firstName} 👋</p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="dashboard__stats">
        {STAT_DEFS.map((s) => (
          <StatCard key={s.key} label={s.label} value={stats[s.key]} color={s.color} bg={s.bg} />
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
            <EmptyPanel message="No overdue tasks — you're all caught up!" />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="panel">
          <h2 className="panel__title">
            <span className="panel__title-dot" style={{ background: 'var(--accent)' }} />
            Recent Activity
          </h2>
          <div className="panel__body">
            <EmptyPanel message="No recent activity yet. Start by creating a project." />
          </div>
        </section>
      </div>
    </div>
  );
}
