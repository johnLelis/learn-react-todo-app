import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import axios from 'axios';
import { GlobalTodosContext } from './context/GlobalTodosContext';
import AddTaskSection from './components/tasks/AddTaskSection';
import TaskFilters from './components/tasks/TaskFiltersSection';
import TaskList from './components/tasks/TaskList';
import { isToday } from './utils/dateUtils';
import SuccessToast from './components/toasts/SuccessToast';
import TaskStats from './components/tasks/TaskStats';
import EditForm from './components/tasks/EditForm';
const App = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [allTodos, setAllTodos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [message, setMessage] = useState('');

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

  const filteredTodos = useMemo(() => {
    if (activeFilter === 'all') return allTodos;

    const filterMap = {
      active: () => allTodos?.filter(todo => !todo.completed),
      completed: () => allTodos?.filter(todo => todo.completed),
      high: () => allTodos?.filter(todo => todo.priority === 'high'),
      today: () =>
        allTodos?.filter(({ due_date }) => {
          return due_date && isToday(due_date);
        }),
    };

    return filterMap[activeFilter] ? filterMap[activeFilter]() : allTodos;
  }, [allTodos, activeFilter]);

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
              filteredTodos,
              setAllTodos,
              setMessage,
              setShowSuccessToast,
            }}
          >
            <AddTaskSection />
            <TaskFilters />
            <TaskList />
            <TaskStats />
          </GlobalTodosContext.Provider>
          <SuccessToast
            visible={showSuccessToast}
            message={message}
            onClose={() => setShowSuccessToast(false)}
          />
        </main>
      </div>
    </>
  );
};

export default App;
