'use client';

import { ChangeEvent, forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './InputField.module.css';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorMessage?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  {
    label,
    id,
    wrapperClassName,
    labelClassName,
    inputClassName,
    required,
    onChange,
    errorMessage,
    ...props
  },
  ref
) {
  const [selectedFileName, setSelectedFileName] = useState('');
  const isFileInput = props.type === 'file';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isFileInput) {
      const selectedFile = event.target.files?.[0];
      setSelectedFileName(selectedFile ? selectedFile.name : '');
    }

    onChange?.(event);
  };

  return (
    <div className={cn('fieldGroup', wrapperClassName, isFileInput && selectedFileName && 'hasFile')}>
      <label htmlFor={id} className={cn('label', labelClassName)}>
        {isFileInput && selectedFileName ? selectedFileName : label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        ref={ref}
        id={id}
        required={required}
        className={cn('input', inputClassName, errorMessage && styles.inputError)}
        onChange={handleChange}
        {...props}
      />
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
});

export default InputField;
