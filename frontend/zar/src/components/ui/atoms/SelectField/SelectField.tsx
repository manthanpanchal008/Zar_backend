import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './SelectField.module.css';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorMessage?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  {
    label,
    id,
    options,
    placeholder,
    wrapperClassName,
    labelClassName,
    selectClassName,
    required,
    errorMessage,
    ...props
  },
  ref
) {
  return (
    <div className={cn('fieldGroup', wrapperClassName)}>
      <label htmlFor={id} className={cn('label', labelClassName)}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <select
        ref={ref}
        id={id}
        required={required}
        className={cn(styles.select, selectClassName, errorMessage && styles.selectError)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
});

export default SelectField;
