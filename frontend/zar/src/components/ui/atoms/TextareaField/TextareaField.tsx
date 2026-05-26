import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './TextareaField.module.css';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  wrapperClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorMessage?: string;
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  {
    label,
    id,
    wrapperClassName,
    labelClassName,
    textareaClassName,
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
      <textarea
        ref={ref}
        id={id}
        required={required}
        className={cn(styles.textarea, textareaClassName, errorMessage && styles.textareaError)}
        {...props}
      />
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
});

export default TextareaField;
