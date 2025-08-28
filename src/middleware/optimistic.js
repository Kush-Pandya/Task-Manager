// Middleware for optimistic UI and rollback
const optimisticMiddleware = store => next => action => {
  if (action.type.startsWith('tasks/')) {
    // Simulate sync failure for demo (replace with real API logic)
    const failSync = false;
    const result = next(action);
    if (failSync) {
      store.dispatch({ type: 'ui/addNotification', payload: { id: Date.now(), message: 'Sync failed. Rolling back.' } });
      // Rollback logic here (could reload from last good state)
    }
    return result;
  }
  return next(action);
};

export default optimisticMiddleware;
