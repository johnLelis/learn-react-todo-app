import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { GlobalTodosContext } from './context/GlobalTodosContext';
import AddTaskSection from './components/tasks/AddTaskSection';
import TaskFilters from './components/tasks/TaskFiltersSection';
import EmptyTask from './components/tasks/EmptyTask';
import TaskList from './components/tasks/TaskList';

const App = () => {
  const API_BASE_URL = 'http://localhost:3001/api';
  const [allTodos, setAllTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/todos?sort=priority`);
      setAllTodos(response?.data?.data);
      setError(null);
      setActiveFilter('all');
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
