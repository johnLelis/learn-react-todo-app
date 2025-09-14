import EditTaskButton from './EditTaskButton';
import DeleteTaskButton from './DeleteTaskButton';

const TaskActions = () => {
  return (
    <div className="task-actions">
      <EditTaskButton />
      <DeleteTaskButton />
    </div>
  );
};

export default TaskActions;
