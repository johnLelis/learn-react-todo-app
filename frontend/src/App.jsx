// import { useState } from 'react';
import './App.css';
import AddTask from './components/form/AddTask';

function App() {
  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Task Manager</h1>
        </header>
      </div>

      <main className="main-content">
        <AddTask />
      </main>
    </>
  );
}

export default App;
