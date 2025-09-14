import { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
const EditTaskButton = () => {
  const { id, setShowEditForm, setCurrentIdToEdit } = useContext(TaskContext);
  const handleEdit = () => {
    setShowEditForm(true);
    setCurrentIdToEdit(id);
  };
  return (
    <>
      <button className="task-btn edit-btn" onClick={() => handleEdit()}>
        ✏️ Edit
      </button>
    </>
  );
};

export default EditTaskButton;
