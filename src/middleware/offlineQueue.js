// Middleware for offline queueing
const OFFLINE_QUEUE_KEY = 'offline_queue';

const offlineQueueMiddleware = store => {
  let queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');

  window.addEventListener('online', () => {
    queue.forEach(action => store.dispatch(action));
    queue = [];
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  });

  return next => action => {
    if (!navigator.onLine && action.type.startsWith('tasks/')) {
      queue.push(action);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      store.dispatch({ type: 'ui/addNotification', payload: { id: Date.now(), message: 'Queued for sync when online.' } });
      return;
    }
    return next(action);
  };
};

export default offlineQueueMiddleware;
