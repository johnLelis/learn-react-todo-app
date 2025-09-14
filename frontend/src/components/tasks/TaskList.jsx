import { useContext, useState } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import EmptyTask from './EmptyTask';
import { TaskContext } from '../../context/TaskContext';
import TaskCheckbox from './TaskCheckbox';
import TaskMain from './TaskMain';
import TaskActions from './TaskActions';
import EditForm from './EditForm';

const TaskList = () => {
  const { activeFilter, allTodos, filteredTodos } =
    useContext(GlobalTodosContext);

  const [showEditForm, setShowEditForm] = useState(false);
  const [currentIdToEdit, setCurrentIdToEdit] = useState(null);

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
        return (
          <li
            key={id}
            className={`task-item priority-${priority} ${
              completed && 'completed'
            }`}
          >
            <div className="task-content">
              <div
                className={`task-header ${
                  showEditForm && currentIdToEdit === id && 'hidden'
                }`}
              >
                <TaskContext.Provider
                  value={{
                    id,
                    text,
                    description,
                    completed,
                    createdAt,
                    priority,
                    category,
                    dueDate,
                    setShowEditForm,
                    setCurrentIdToEdit,
                  }}
                >
                  <TaskCheckbox />
                  <TaskMain />
                  <TaskActions />
                </TaskContext.Provider>
              </div>{' '}
              {showEditForm && currentIdToEdit === id && (
                <EditForm
                  currentIdToEdit={currentIdToEdit}
                  allTodos={allTodos}
                  setShowEditForm={setShowEditForm}
                />
              )}
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
