import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';

const EmptyTask = () => {
  const { activeFilter } = useContext(GlobalTodosContext);

  const emptyMessage = {
    all: "You're all set! Start by creating your first task to kick off your productivity streak.",
    active: 'No active tasks at the moment. Time to plan your next move!',
    completed: "No completed tasks yet. Let's get some wins on the board!",
    high: "No high-priority tasks found. Everything's chill for now.",
    today: "You're ahead of schedule—no tasks due today!",
  };

  const headerMessage = {
    all: 'No tasks yet',
    active: 'No active tasks',
    completed: 'No completed tasks',
    high: 'No high-priority tasks',
    today: 'No tasks due today',
  };

  return (
    <div className="empty-state" id="emptyState">
      <div className="empty-icon">📝</div>
      <div className="empty-message">{headerMessage[activeFilter]}</div>
      <div className="empty-submessage">{emptyMessage[activeFilter]}</div>
    </div>
  );
};

export default EmptyTask;
