import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';
import crossTabSyncMiddleware from './middleware/crossTabSync';
import offlineQueueMiddleware from './middleware/offlineQueue';
import optimisticMiddleware from './middleware/optimistic';

// Load persisted state
function loadState() {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks_state')) || undefined;
    const ui = JSON.parse(localStorage.getItem('ui_state')) || undefined;
    return { tasks, ui };
  } catch {
    return undefined;
  }
}

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      crossTabSyncMiddleware,
      offlineQueueMiddleware,
      optimisticMiddleware
    ]),
});

// Persist state on change
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('tasks_state', JSON.stringify(state.tasks));
  localStorage.setItem('ui_state', JSON.stringify(state.ui));
});

export default store;
