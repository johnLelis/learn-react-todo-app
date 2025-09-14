import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
const TaskFiltersSection = () => {
  const { activeFilter, setActiveFilter } = useContext(GlobalTodosContext);
  const filters = [
    {
      dataFilter: 'all',
      label: '📋 All Tasks',
    },
    {
      dataFilter: 'active',
      label: '⚡ Active',
    },
    {
      dataFilter: 'completed',
      label: '✅ Completed',
    },
    {
      dataFilter: 'high',
      label: '🔴 High Priority',
    },
    {
      dataFilter: 'today',
      label: '📅 Due Today',
    },
  ];

  const handleOnClick = filterKey => {
    setActiveFilter(filterKey);
  };
  return (
    <div className="task-filters">
      {filters.map(({ dataFilter, label }, idx) => (
        <button
          key={idx}
          className={`filter-btn ${
            activeFilter === dataFilter ? 'active' : ''
          }`}
          data-filter={dataFilter}
          onClick={() => handleOnClick(dataFilter)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TaskFiltersSection;
