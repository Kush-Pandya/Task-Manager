import { memo, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { deleteTask, updateTask } from '../slices/tasksSlice';

function TaskList({ tasks, dispatch, conflicts, sessionId }) {
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState('todo');
  const [localConflict, setLocalConflict] = useState(false);

  const startEdit = (task) => {
    const latestTask = tasks.find(t => t.id === task.id);
    setEditingTask(latestTask);
    setEditTitle(latestTask.title);
    setEditDesc(latestTask.description);
    setEditStatus(latestTask.status);
    setLocalConflict(false);
  };

  useEffect(() => {
    if (editingTask) {
      const latestTask = tasks.find(t => t.id === editingTask.id);
      if (latestTask && latestTask.version > editingTask.version) {
        setLocalConflict(true);
      } else {
        setLocalConflict(false);
      }
    }
  }, [tasks, editingTask]);

  const fetchLatest = () => {
    if (editingTask) {
      const latestTask = tasks.find(t => t.id === editingTask.id);
      if (latestTask) {
        setEditingTask(latestTask);
        setEditTitle(latestTask.title);
        setEditDesc(latestTask.description);
        setEditStatus(latestTask.status);
        setLocalConflict(false);
      }
    }
  };

  const saveEdit = () => {
    const updatedTask = {
      ...editingTask,
      title: editTitle,
      description: editDesc,
      status: editStatus,
      version: editingTask.version + 1,
      updatedAt: Date.now(),
      sessionId: sessionId,
    };
    dispatch(updateTask(updatedTask));
    setEditingTask(null);
    setLocalConflict(false);
    setTimeout(() => {
      const latest = tasks.find(t => t.id === updatedTask.id);
      if (latest && latest.version > updatedTask.version && latest.sessionId !== sessionId) {
        dispatch(updateTask(editingTask));
        dispatch({ type: 'ui/addNotification', payload: { id: Date.now(), message: 'Sync failed. Change rolled back.' } });
      }
    }, 500);
  };
  const closeModal = () => {
    setEditingTask(null);
    setLocalConflict(false);
  };

  const Row = memo(({ index, style }) => {
    const task = tasks[index];
    if (!task) return null;
    return (
      <div style={style} key={task.id} className={`task-row flex justify-between items-center border rounded p-2 mb-2 bg-white dark:bg-gray-800`}>
        <div className="task-info">
          <div className="task-title font-semibold text-lg gray-500">{task.title}</div>
          <div className="task-desc text-gray-500 text-sm">{task.description}</div>
          <div className="task-meta text-xs text-gray-400">Status: {task.status} | Version: {task.version}</div>
        </div>
        <div className="task-actions flex gap-2">
          <button className="done-btn bg-blue-500 text-white rounded px-2 py-1" onClick={() => startEdit(task)}>Edit</button>
          <button className="delete-btn bg-red-500 text-white rounded px-2 py-1" onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ height: '500px' }}>
        {tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          <List
            height={500}
            itemCount={tasks.length}
            itemSize={80}
            width={'100%'}
          >
            {Row}
          </List>
        )}
      </div>
      {editingTask && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className={`modal bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw] relative`} onClick={e => e.stopPropagation()}>
            <button className="close-btn absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700" onClick={closeModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <input className="w-full mb-2 px-3 py-2 border rounded text-black" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
            <input className="w-full mb-2 px-3 py-2 border rounded text-black" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />
            <select className="w-full mb-4 px-3 py-2 border rounded text-black" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="modal-actions flex gap-2">
              {localConflict ? (
                <button className="add-btn bg-yellow-500 text-white rounded px-4 py-2" onClick={fetchLatest}>Fetch Latest</button>
              ) : (
                <button className="add-btn bg-green-600 text-white rounded px-4 py-2" onClick={saveEdit}>Save</button>
              )}
              <button className="delete-btn bg-gray-400 text-white rounded px-4 py-2" onClick={closeModal}>Cancel</button>
            </div>
            {localConflict && <div className="conflict-text text-red-600 text-sm mt-2 break-words max-w-xs">Conflict detected! This task was updated in another tab. Please fetch the latest data to continue editing.</div>}
          </div>
        </div>
      )}
    </>
  );
}

export default TaskList;
