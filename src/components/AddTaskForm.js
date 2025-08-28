import React, { useState } from 'react';
import { addTask } from '../slices/tasksSlice';

function AddTaskForm({ dispatch, sessionId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    const newTask = { title, description, status: 'todo', sessionId };
    dispatch(addTask(newTask));
    setTitle('');
    setDescription('');
  };
  return (
    <form className="add-form flex gap-2 mt-4" onSubmit={handleAdd}>
      <input className="add-title border px-2 py-1 rounded text-black" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input className="add-desc border px-2 py-1 rounded text-black" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button className="add-btn bg-green-600 text-white rounded px-4 py-2" type="submit">Add</button>
    </form>
  );
}

export default AddTaskForm;
