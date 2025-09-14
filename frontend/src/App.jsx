import { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import { GlobalTodosContext } from './context/GlobalTodosContext';
import AddTaskSection from './components/tasks/AddTaskSection';
import TaskFilters from './components/tasks/TaskFiltersSection';
import TaskList from './components/tasks/TaskList';

const App = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [allTodos, setAllTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/todos?sort=priority`);
      setAllTodos(response?.data?.data);
      setError(null);
      setActiveFilter('all');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Task Manager</h1>
        </header>

        <main className="main-content">
          <GlobalTodosContext.Provider
            value={{
              allTodos,
              isLoading,
              setIsLoading,
              error,
              setError,
              fetchTodos,
              setActiveFilter,
              activeFilter,
              setFilteredTodos,
              filteredTodos,
              setAllTodos,
            }}
          >
            <AddTaskSection />
            <TaskFilters />
            <TaskList />
          </GlobalTodosContext.Provider>
        </main>
      </div>
    </>
  );
};

export default App;
