import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  tasks: [], // {id, title, description, status, version, updatedAt}
  lastSynced: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.tasks.push(action.payload);
      },
      prepare(task) {
        return {
          payload: {
            ...task,
            id: nanoid(),
            version: 1,
            updatedAt: Date.now(),
          },
        };
      },
    },
    updateTask(state, action) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        // Last-writer-wins
        if (!state.tasks[idx].version || action.payload.version >= state.tasks[idx].version) {
          state.tasks[idx] = { ...action.payload };
        }
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    incrementVersion(state, action) {
      const idx = state.tasks.findIndex(t => t.id === action.payload);
      if (idx !== -1) {
        state.tasks[idx].version += 1;
        state.tasks[idx].updatedAt = Date.now();
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, setTasks, incrementVersion } = tasksSlice.actions;
export default tasksSlice.reducer;
