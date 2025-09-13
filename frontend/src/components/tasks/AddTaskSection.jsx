import { useRef, useEffect, useState } from 'react';
import FormGroup from '../form/FormGroup';
import FormRow from '../form/FormRow';
import PrioritySelect from '../form/PrioritySelect';
import axios from 'axios';
import { z } from 'zod';
import ErrorToast from '../errors/ErrorToast';
import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';

const AddTaskSection = () => {
  const { todos, isLoading, setIsLoading, setError, fetchTodos, error } =
    useContext(GlobalTodosContext);
  const [zodErrors, setZodErrors] = useState(null);
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

  const API_BASE_URL = 'http://localhost:3001/api';

  const addTodos = async data => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/todos`, data);
      await fetchTodos();
      setError(null);
      handeOnClear();
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const parsedData = {};
    for (let [key, value] of formData.entries()) {
      if (key && value) {
        parsedData[key] = value;
      }
    }

    console.log(JSON.stringify(parsedData, null, 2));

    const result = TaskSchema.safeParse(parsedData);

    if (result.success) {
      await addTodos(parsedData);
      setZodErrors(null);
    } else {
      const tree = z.treeifyError(result.error);
      setZodErrors(tree.properties);
    }
  };

  const titleRef = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const handeOnClear = () => {
    formRef.current.reset();
    setZodErrors(null);
  };

  return (
    <section className="add-task-section">
      <h2 className="section-title">Create New Task</h2>
      <form ref={formRef} className="add-task-form" onSubmit={handleOnSubmit}>
        <FormRow>
          <FormGroup
            label="Task Title *"
            name="title"
            placeholder="What needs to be done?"
            ref={titleRef}
            errors={zodErrors?.title?.errors[0]}
          />

          <PrioritySelect errors={zodErrors?.priority?.errors[0]} />

          <FormGroup
            label="Category"
            name="category"
            placeholder="e.g., Work, Personal, Learning"
            errors={zodErrors?.category?.errors[0]}
          />
          <FormGroup label="Due Date" name="dueDate" type="date" />
          <FormGroup
            label="Description"
            name="description"
            placeholder="Add more details about this task (optional)..."
            additionalClass={'full-width'}
            as="textarea"
            errors={zodErrors?.description?.errors[0]}
          />
        </FormRow>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handeOnClear}
          >
            🗑️ Clear Form
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? <span className="spinner" /> : '✨ Add Task'}
          </button>
        </div>
      </form>
      {isLoading ? (
        <span className="spinner" />
      ) : (
        todos.length > 0 && <pre>{JSON.stringify(todos, null, 2)}</pre>
      )}

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </section>
  );
};

export default AddTaskSection;
