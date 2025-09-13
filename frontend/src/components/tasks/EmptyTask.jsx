const EmptyTask = () => {
  return (
    <div className="empty-state" id="emptyState">
      <div className="empty-icon">📝</div>
      <div className="empty-message">No tasks found</div>
      <div className="empty-submessage">
        Create your first task above to get started on your journey!
      </div>
    </div>
  );
};

export default EmptyTask;
