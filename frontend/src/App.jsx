import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { GlobalTodosContext } from './context/GlobalTodosContext';
import AddTaskSection from './components/tasks/AddTaskSection';
import TaskFilters from './components/tasks/TaskFiltersSection';

function App() {
  const API_BASE_URL = 'http://localhost:3001/api';
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response?.data?.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Task Manager</h1>
        </header>
      </div>

      <main className="main-content">
        <GlobalTodosContext.Provider
          value={{
            todos,
            isLoading,
            setIsLoading,
            error,
            setError,
            fetchTodos,
          }}
        >
          <AddTaskSection />
          <TaskFilters />
        </GlobalTodosContext.Provider>
      </main>
    </>
  );
}

export default App;
