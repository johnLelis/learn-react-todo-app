import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import { isToday } from '../../utils/dateUtils';
const ButtonFilter = () => {
  const { allTodos, setFilteredTodos, activeFilter, setActiveFilter } =
    useContext(GlobalTodosContext);
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

  const getFilteredTodos = filterKey => {
    const filterMap = {
      active: () => allTodos?.filter(todo => todo.completed !== 1),
      completed: () => allTodos?.filter(todo => todo.completed),
      high: () => allTodos?.filter(todo => todo.priority === 'high'),
      today: () =>
        allTodos?.filter(({ due_date }) => {
          return due_date && isToday(due_date);
        }),
    };

    setFilteredTodos(filterMap[filterKey]);
  };

  const handleOnClick = filterKey => {
    setActiveFilter(filterKey);
    getFilteredTodos(filterKey);
  };

  return (
    <>
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
    </>
  );
};

export default ButtonFilter;
