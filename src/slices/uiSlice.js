import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: {
    status: 'all',
    keyword: '',
  },
  darkMode: false,
  notifications: [],
  undoStack: [],
  redoStack: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = { ...state.filter, ...action.payload };
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    pushUndo(state, action) {
      state.undoStack.push(action.payload);
    },
    popUndo(state) {
      state.undoStack.pop();
    },
    pushRedo(state, action) {
      state.redoStack.push(action.payload);
    },
    popRedo(state) {
      state.redoStack.pop();
    },
  },
});

export const { setFilter, toggleDarkMode, addNotification, removeNotification, pushUndo, popUndo, pushRedo, popRedo } = uiSlice.actions;
export default uiSlice.reducer;
