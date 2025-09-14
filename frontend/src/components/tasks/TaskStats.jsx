import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import { isToday } from '../../utils/dateUtils';

const TaskStats = () => {
  const { allTodos } = useContext(GlobalTodosContext);
  const allTodosCount = allTodos.length;
  const activeTasksCount = allTodos.filter(
    ({ completed }) => !completed
  ).length;
  const completedTasksCount = allTodos.filter(
    ({ completed }) => completed
  ).length;
  const highPriorityCount = allTodos.filter(
    ({ priority }) => priority === 'high'
  ).length;
  const dueTodayCount = allTodos.filter(({ due_date }) => {
    return due_date && isToday(due_date);
  }).length;

  const progressPercentage = (completedTasksCount / allTodosCount) * 100;

  const stats = [
    {
      statLabel: 'Total Tasks',
      statNumber: allTodosCount,
    },
    {
      statLabel: 'Active Tasks',
      statNumber: activeTasksCount,
    },
    {
      statLabel: 'Completed',
      statNumber: completedTasksCount,
    },
    {
      statLabel: 'Progress',
      statNumber: `${progressPercentage.toFixed()} %`,
    },
    {
      statLabel: 'High Priority',
      statNumber: highPriorityCount,
    },
    {
      statLabel: 'Due Today',
      statNumber: dueTodayCount,
    },
  ];
  return (
    <div className="task-stats">
      {stats.map(({ statLabel, statNumber }) => (
        <div key={statLabel} className="stat-item">
          <span className="stat-number">{statNumber}</span>
          <span className="stat-label">{statLabel}</span>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
