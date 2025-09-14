import { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { formatDate, getDaysSince } from '../../utils/dateUtils';
import { capitalizeFirstLetter } from '../../utils/stringUtils';

const TaskMain = () => {
  const {
    text,
    description,
    category,
    priority,
    completed,
    dueDate,
    createdAt,
  } = useContext(TaskContext);
  const pastDays = getDaysSince(createdAt);

  const priorityCircle = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };
  return (
    <div className="task-main">
      <h3 className="task-title">{text}</h3>
      <p className="task-description">{description}</p>
      <div className="task-meta">
        <span className="meta-item">{capitalizeFirstLetter(category)}</span>
        <span className={`priority-badge priority-${priority}`}>
          {`${priorityCircle[priority]} ${priority} Priority`}
        </span>
        {completed && <span className="meta-item">✅ Completed</span>}
        {dueDate && <span className="meta-item">🗓️ {formatDate(dueDate)}</span>}
        <span className="meta-item">
          {`🕒 Created ${pastDays === 0 ? 'Today' : `${pastDays} days ago`}`}
        </span>
      </div>
    </div>
  );
};

export default TaskMain;
