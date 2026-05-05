import { useState, useEffect } from 'react';
import './TaskModal.css';

const STATUS_OPTIONS = [
  { value: 'TODO',        label: 'To Do',       color: 'var(--teal)' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'var(--orange)' },
  { value: 'DONE',        label: 'Done',        color: 'var(--green)' },
];

export default function TaskModal({ task, members = [], onSave, onClose }) {
  const isEdit = !!task;

  const [form, setForm] = useState({
    title:       '',
    description: '',
    dueDate:     '',
    assignedTo:  '',
    status:      'TODO',
  });

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        dueDate:     task.dueDate     || '',
        assignedTo:  task.assignedTo  || '',
        status:      task.status      || 'TODO',
      });
    }
  }, [task]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, assignedTo: form.assignedTo || null });
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--task" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal__close" id="task-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form className="modal__body" onSubmit={handleSubmit} id="task-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              className="form-input form-textarea"
              placeholder="Add more details..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Status & Due Date side by side */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <div className="status-selector">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`status-${opt.value.toLowerCase()}`}
                    className={`status-btn ${form.status === opt.value ? 'status-btn--active' : ''}`}
                    style={{ '--s-color': opt.color }}
                    onClick={() => set('status', opt.value)}
                  >
                    <span className="status-btn__dot" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={(e) => set('dueDate', e.target.value)}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              className="form-input"
              value={form.assignedTo}
              onChange={(e) => set('assignedTo', e.target.value)}
            >
              <option value="">— Unassigned —</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role === 'ADMIN' ? 'Admin' : 'Staff'})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" id="task-save-btn">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
