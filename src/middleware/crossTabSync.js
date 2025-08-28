// Middleware for cross-tab sync using localStorage events
const CROSS_TAB_KEY = 'tasks_sync';

const crossTabSyncMiddleware = store => {
  window.addEventListener('storage', (event) => {
    if (event.key === CROSS_TAB_KEY && event.newValue) {
      try {
        const { tasks } = JSON.parse(event.newValue);
        store.dispatch({ type: 'tasks/setTasks', payload: tasks });
      } catch {}
    }
  });

  return next => action => {
    const result = next(action);
    if (action.type.startsWith('tasks/')) {
      const state = store.getState();
      localStorage.setItem(CROSS_TAB_KEY, JSON.stringify({ tasks: state.tasks.tasks }));
    }
    return result;
  };
};

export default crossTabSyncMiddleware;
