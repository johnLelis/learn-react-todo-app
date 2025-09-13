import React from 'react';

const ButtonFilter = () => {
  return (
    <>
      <button className="filter-btn active" data-filter="all">
        📋 All Tasks
      </button>
      <button className="filter-btn" data-filter="active">
        ⚡ Active
      </button>
      <button className="filter-btn" data-filter="completed">
        ✅ Completed
      </button>
      <button className="filter-btn" data-filter="high">
        🔴 High Priority
      </button>
      <button className="filter-btn" data-filter="today">
        📅 Due Today
      </button>
    </>
  );
};

export default ButtonFilter;
