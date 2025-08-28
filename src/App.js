
  import React from 'react';
  import { Provider } from 'react-redux';
  import store from './store';
  import TaskManager from './components/TaskManager';
  import './App.css';
  import './index.css';

  function App() {
    return (
      <Provider store={store}>
        <TaskManager />
      </Provider>
    );
  }

  export default App;