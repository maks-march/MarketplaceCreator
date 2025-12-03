import React from 'react';
import '../styles/ui.css';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, name, hint, ...rest }) => (
  <div className="ui-form-field">
    <label htmlFor={name} className="ui-label">{label}</label>
    <input id={name} name={name} {...rest} className="ui-input" />
    {hint && <small className="ui-hint">{hint}</small>}
  </div>
);