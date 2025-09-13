const PrioritySelect = () => {
  return (
    <div className="form-group priority-select">
      <label htmlFor="priority" className="form-label">
        Priority Level
      </label>
      <select
        id="priority"
        name="priority"
        className="form-select"
        defaultValue="medium"
      >
        <option value="low">🟢 Low Priority</option>
        <option value="medium">🟡 Medium Priority</option>
        <option value="high">🔴 High Priority</option>
      </select>
    </div>
  );
};

export default PrioritySelect;
