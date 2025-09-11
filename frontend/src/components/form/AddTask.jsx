import { useRef, useEffect, useState } from 'react';
import FormGroup from './FormGroup';
import FormRow from './FormRow';
import PrioritySelect from './PrioritySelect';
import { useFormStatus } from 'react-dom';

const AddTask = () => {
  const [todos, setTodos] = useState([]);
  const triggerCalendar = () => {
    document.getElementById('dueDate').showPicker?.() ||
      document.getElementById('dueDate').focus();
  };

  const [inputValues, setInputValues] = useState({
    title: '',
    category: '',
    date: '',
    description: '',
    priority: 'medium',
  });

  const handleOnSubmit = async data => {
    const title = data.get('title');
    const priority = data.get('priority');
    console.log(`Prio: ${priority}`);
    const saveTodo = await simulateApiCall(title);
    setTodos(prevState => [...prevState, saveTodo]);
  };

  const handeOnClear = () => {
    setInputValues({
      title: '',
      category: '',
      date: '',
      description: '',
      priority: 'medium',
    });
  };

  const handleOnChange = e => {
    const { name, value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  return (
    <section className="add-task-section">
      <h2 className="section-title">Create New Task</h2>
      <form className="add-task-form" action={handleOnSubmit}>
        <FormRow>
          <FormGroup
            label="Task Title *"
            name="title"
            placeholder="What needs to be done?"
            minLength="3"
            maxLength="100"
            ref={titleRef}
            value={inputValues.title}
            onChange={handleOnChange}
          />
          <PrioritySelect
            value={inputValues.priority}
            onChange={handleOnChange}
          />

          <FormGroup
            label="Category"
            name="category"
            placeholder="e.g., Work, Personal, Learning"
            minLength="3"
            maxLength="50"
            value={inputValues.category}
            onChange={handleOnChange}
          />
          <FormGroup
            label="Due Date"
            name="dueDate"
            type="date"
            onClick={triggerCalendar}
            value={inputValues.date}
            onChange={handleOnChange}
          />
          <FormGroup
            label="Description"
            name="description"
            placeholder="Add more details about this task (optional)..."
            maxLength="500"
            additionalClass={['']}
            value={inputValues.description}
            onChange={handleOnChange}
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handeOnClear}
            >
              🗑️ Clear Form
            </button>
            <SubmitButton />
          </div>
        </FormRow>
      </form>
      <ul>
        {todos.length > 0 &&
          todos.map((todo, idx) => <li key={idx}>{todo}</li>)}
      </ul>
      <div className="form-error" id="formError">
        Please check your input and try again.
      </div>
    </section>
  );
};

function SubmitButton() {
  const data = useFormStatus();
  const isLoading = data.pending;
  return (
    <button disabled={isLoading} className="btn btn-primary">
      {isLoading ? <span className="spinner" /> : '✨ Add Task'}
    </button>
  );
}

async function simulateApiCall(todo) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(todo);
    }, 1000);
  });
}

export default AddTask;
