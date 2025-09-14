import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext';
const TaskCheckbox = () => {
  const { setError, setAllTodos, setMessage, setShowSuccessToast } =
    useContext(GlobalTodosContext);
  const { id, completed } = useContext(TaskContext);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const mapTodos = (prev, id) =>
    prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

  const message = completed ? 'Task marked as active 📝' : 'Task completed! 🎉';
  const handleOnCompleted = async id => {
    try {
      await axios.patch(`${baseUrl}/todos/${id}/toggle`);
      setMessage(message);
      setShowSuccessToast(true);
      setAllTodos(prev => mapTodos(prev, id));
    } catch (err) {
      setError(err.message);
      console.error('Error updating todos:', err);
    }
  };
  return (
    <div
      className={`task-checkbox ${completed && 'checked'} `}
      role="button"
      tabIndex="0"
      onClick={() => handleOnCompleted(id)}
    ></div>
  );
};

export default TaskCheckbox;
