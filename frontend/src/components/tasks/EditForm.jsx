import { useRef, useEffect, useContext, useState } from 'react';
import z from 'zod';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import { formatDateForInput } from '../../utils/dateUtils';
import axios from 'axios';

const EditForm = ({ currentIdToEdit, allTodos, setShowEditForm }) => {
  const [filterToEditTask] = allTodos.filter(
    ({ id }) => id === currentIdToEdit
  );
  const { setMessage, setShowSuccessToast, fetchTodos } =
    useContext(GlobalTodosContext);
  const [zodErrors, setZodErrors] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    text,
    priority,
    category,
    due_date: dueDate,
    description,
  } = filterToEditTask;
  const titleRef = useRef(null);
  const priorityRef = useRef(null);
  const categoryRef = useRef(null);
  const dueDateRef = useRef(null);
  const descriptionRef = useRef(null);
  useEffect(() => {
    titleRef.current.value = text;
    priorityRef.current.value = priority;
    categoryRef.current.value = capitalizeFirstLetter(category);

    if (dueDate) {
      dueDateRef.current.value = formatDateForInput(dueDate);
    }
    descriptionRef.current.value = description;
  }, [text, priority, category, dueDate, description]);

  const TaskSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    priority: z.enum(['low', 'medium', 'high']),
    category: z
      .string()
      .min(3, 'Category must be at least 3 characters')
      .max(50)
      .optional(),
    description: z.string().max(500).optional(),
    dueDate: z.string().optional(),
  });

  const updateTodo = async data => {
    try {
      await axios.put(`${apiBaseUrl}/todos/${currentIdToEdit}`, data);
    } catch (error) {
      console.error(`Error updating todo: ${error.message}`);
    }
  };
  const handleOnSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const parsedData = {};
    for (let [key, value] of formData.entries()) {
      parsedData[key] = value;
    }

    const result = TaskSchema.safeParse(parsedData);

    if (result.success) {
      await updateTodo(parsedData);
      setMessage('Task updated successfully!');
      setShowSuccessToast(true);
      setShowEditForm(false);
      setZodErrors(null);
      fetchTodos();
    } else {
      const tree = z.treeifyError(result.error);
      setZodErrors(tree.properties);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="edit-form">
      <div className="edit-row">
        <div className="edit-title">
          <div className="title-input">
            <input name="title" className="edit-input " ref={titleRef} />
            {zodErrors?.title?.errors?.length > 0 && (
              <p className="error">{zodErrors?.title?.errors[0]}</p>
            )}
          </div>

          <select ref={priorityRef} name="priority" className="edit-select">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <input
          name="category"
          ref={categoryRef}
          className="edit-input"
          placeholder="Category"
        />
        <input
          name="dueDate"
          ref={dueDateRef}
          type="date"
          className="edit-input"
        />
        <textarea
          name="description"
          ref={descriptionRef}
          className="edit-textarea"
          placeholder="Description"
        ></textarea>
      </div>
      <div className="edit-actions">
        <button
          type="button"
          onClick={() => {
            setShowEditForm(false);
          }}
          className="task-btn cancel-btn"
        >
          ❌ Cancel
        </button>
        <button type="submit" className="task-btn save-btn">
          💾 Save
        </button>
      </div>
    </form>
  );
};

export default EditForm;
