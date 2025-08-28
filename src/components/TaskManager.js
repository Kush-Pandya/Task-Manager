import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, toggleDarkMode } from '../slices/uiSlice';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';

function TaskManager() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const filter = useSelector(state => state.ui.filter);
  const darkMode = useSelector(state => state.ui.darkMode);
  const notifications = useSelector(state => state.ui.notifications);
  const sessionId = useRef(Math.random().toString(36).slice(2));
  const [conflicts, setConflicts] = useState([]);
  const [lastEdited, setLastEdited] = useState({});

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const syncDarkMode = (event) => {
      if (event.key === 'dark_mode' && event.newValue != null) {
        const value = JSON.parse(event.newValue);
        if (value !== darkMode) {
          dispatch(toggleDarkMode());
        }
      }
    };
    window.addEventListener('storage', syncDarkMode);
    return () => window.removeEventListener('storage', syncDarkMode);
  }, [darkMode, dispatch]);

  useEffect(() => {
    const updated = {};
    tasks.forEach(t => {
      updated[t.id] = { version: t.version, updatedAt: t.updatedAt, sessionId: t.sessionId };
    });
    setLastEdited(updated);
  }, []);

  useEffect(() => {
    const conflictsFound = tasks.filter(t => {
      const prev = lastEdited[t.id];
      return prev && t.version > prev.version && t.sessionId !== sessionId.current;
    }).map(t => t.id);
    setConflicts(conflictsFound);
    const updated = { ...lastEdited };
    tasks.forEach(t => {
      updated[t.id] = { version: t.version, updatedAt: t.updatedAt, sessionId: t.sessionId };
    });
    setLastEdited(updated);
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter.status !== 'all' && task.status !== filter.status) return false;
    if (filter.keyword && !task.title.toLowerCase().includes(filter.keyword.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="main-container"> 
      <div className="header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button className={`dark-toggle px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`} onClick={() => dispatch(toggleDarkMode())}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="filter-bar mb-4 flex gap-2">
        <input className="filter-input border px-2 py-1 rounded text-black" placeholder="Search..." value={filter.keyword} onChange={e => dispatch(setFilter({ keyword: e.target.value }))} />
        <select className="filter-select border px-2 py-1 rounded text-black" value={filter.status} onChange={e => dispatch(setFilter({ status: e.target.value }))}>
          <option value="all">All</option>
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {notifications.length > 0 && (
        <div className="notification-popup fixed top-6 right-6 z-50">
          {notifications.map(n => (
            <div key={n.id} className="notification bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 mb-2">
              {n.message}
              <button className="close-btn text-white text-lg" onClick={() => dispatch({ type: 'ui/removeNotification', payload: n.id })}>&times;</button>
            </div>
          ))}
        </div>
      )}
      <span style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
      <AddTaskForm dispatch={dispatch} sessionId={sessionId.current} />
      </span>
      <TaskList tasks={filteredTasks} dispatch={dispatch} conflicts={conflicts} sessionId={sessionId.current} />
    </div>
  );
}

export default TaskManager;
