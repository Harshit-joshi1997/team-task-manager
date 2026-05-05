import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './TasksView.css';

export default function TasksView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const overdue = searchParams.get('overdue');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data } = await api.get('/tasks', {
          params: { status, overdue }
        });
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [status, overdue]);

  const title = overdue === 'true' 
    ? 'Overdue Tasks' 
    : `${status ? status.replace('_', ' ').toLowerCase() : 'All'} Tasks`;

  return (
    <div className="tasks-view">
      <header className="page-header">
        <div className="tasks-view__heading">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{title}</h1>
          <p className="page-subtitle">{tasks.length} tasks found</p>
        </div>
      </header>

      <div className="tasks-list">
        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks found in this category.</div>
        ) : (
          <div className="tasks-table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} onClick={() => navigate(`/projects/${task.project?._id || task.project?.id}`)}>
                    <td className="task-title-cell">{task.title}</td>
                    <td className="project-name-cell">{task.project?.name || 'N/A'}</td>
                    <td className={`deadline-cell ${new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'overdue' : ''}`}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                    </td>
                    <td>
                      <span className={`status-tag status-tag--${task.status.toLowerCase()}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
