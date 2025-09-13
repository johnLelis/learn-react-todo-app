const FormGroup = ({
  label,
  name,
  type = 'text',
  as = 'input',
  additionalClass = '',
  errors,
  ...props
}) => (
  <div className={`form-group ${additionalClass}`}>
    <label htmlFor={name} className="form-label">
      {label}
    </label>

    {as === 'textarea' ? (
      <textarea id={name} name={name} className="form-textarea" {...props} />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        className="form-input"
        {...props}
      />
    )}

    {errors && <p className="error">{errors}</p>}
  </div>
);

export default FormGroup;
