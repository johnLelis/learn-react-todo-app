import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import { formatDate, getDaysSince } from '../../utils/dateUtils';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import EmptyTask from './EmptyTask';
import axios from 'axios';

const TaskList = () => {
  const { activeFilter, allTodos, filteredTodos, setError, setAllTodos } =
    useContext(GlobalTodosContext);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const priorityCircle = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const mapTodos = (prev, id) =>
    prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

  const handleOnCompleted = async id => {
    try {
      await axios.patch(`${baseUrl}/todos/${id}/toggle`);
      setAllTodos(prev => mapTodos(prev, id));
    } catch (err) {
      setError(err.message);
      console.error('Error updating todos:', err);
    }
  };

  const displayData = todos => {
    return todos.map(
      ({
        id,
        text,
        description,
        completed,
        created_at: createdAt,
        priority,
        category,
        due_date: dueDate,
      }) => {
        const pastDays = getDaysSince(createdAt);
        return (
          <li
            key={id}
            className={`task-item priority-${priority} ${
              completed && 'completed'
            }`}
          >
            <div className="task-content">
              <div className="task-header">
                <div
                  className={`task-checkbox ${completed && 'checked'} `}
                  role="button"
                  tabIndex="0"
                  onClick={() => handleOnCompleted(id)}
                ></div>
                <div className="task-main">
                  <h3 className="task-title">{text}</h3>
                  <p className="task-description">{description}</p>
                  <div className="task-meta">
                    <span className="meta-item">
                      {capitalizeFirstLetter(category)}
                    </span>
                    <span className={`priority-badge priority-${priority}`}>
                      {`${priorityCircle[priority]} ${priority} Priority`}
                    </span>
                    {completed && (
                      <span className="meta-item">✅ Completed</span>
                    )}
                    {dueDate && (
                      <span className="meta-item">
                        🗓️ {formatDate(dueDate)}
                      </span>
                    )}
                    <span className="meta-item">
                      {`🕒 Created ${
                        pastDays === 0 ? 'Today' : `${pastDays} days ago`
                      }`}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="task-btn edit-btn">✏️ Edit</button>
                  <button className="task-btn delete-btn">🗑️ Delete</button>
                </div>
              </div>
            </div>
          </li>
        );
      }
    );
  };

  return (
    <ul className="task-list" id="taskList">
      {activeFilter === 'all' && allTodos.length > 0 ? (
        displayData(allTodos)
      ) : filteredTodos?.length > 0 ? (
        displayData(filteredTodos)
      ) : (
        <EmptyTask />
      )}
    </ul>
  );
};

export default TaskList;
