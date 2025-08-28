import { createSelector } from '@reduxjs/toolkit';

export const selectTasks = state => state?.tasks?.tasks;
export const selectFilter = state => state?.ui?.filter;

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilter],
  (tasks, filter) => {
    return tasks?.filter(task => {
      if (filter?.status !== 'all' && task.status !== filter?.status) return false;
      if (filter?.keyword && !task.title.toLowerCase().includes(filter?.keyword.toLowerCase())) return false;
      return true;
    });
  }
);
