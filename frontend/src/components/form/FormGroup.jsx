import React from 'react';

const FormGroup = ({
  label,
  name,
  type = 'text',
  additionalClass,
  ...props
}) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      className={`form-input ${{ ...additionalClass }}`}
      {...props}
    />
  </div>
);

export default FormGroup;
