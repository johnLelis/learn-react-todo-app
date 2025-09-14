import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext';
const DeleteTaskButton = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { setAllTodos, setError } = useContext(GlobalTodosContext);
  const { id } = useContext(TaskContext);
  const handleOnDelete = async id => {
    try {
      await axios.delete(`${baseUrl}/todos/${id}`);
      setAllTodos(prev => {
        return prev.filter(todo => todo.id !== id);
      });
    } catch (err) {
      setError(err.message);
      console.error('Error deleting todo:', err);
    }
  };
  return (
    <>
      <button
        className="task-btn delete-btn"
        onClick={() => handleOnDelete(id)}
      >
        🗑️ Delete
      </button>
    </>
  );
};

export default DeleteTaskButton;
