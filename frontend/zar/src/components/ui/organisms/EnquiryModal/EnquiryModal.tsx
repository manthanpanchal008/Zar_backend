'use client';

import { useEffect, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import styles from './EnquiryModal.module.css';
import { cn } from '@/lib/utils';

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

const enquiryTypes = [
  'Wholesale Enquiry',
  'Custom Order',
  'Partnership',
  'Product Information',
  'Other',
];

type EnquiryFormValues = {
  fullName: string;
  companyName: string;
  email: string;
  contactNo: string;
  enquiryType: string;
  message: string;
};

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
const COMPANY_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s'&.,()-]{1,99}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const MESSAGE_REGEX = /^[A-Za-z0-9\s.,'"?!@#$%&*()\-:+;[\]{}]{10,1000}$/;

export default function EnquiryModal({ open, onClose, productName }: EnquiryModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    defaultValues: { fullName: '', companyName: '', email: '', contactNo: '', enquiryType: '', message: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.fullName,
          company: values.companyName,
          email: values.email,
          phone: values.contactNo,
          subject: values.enquiryType,
          message: values.message || 'N/A',
        }),
      });
      if (response.ok) {
        reset();
        onClose();
      }
    } catch {
      // Silent fail - modal stays open so user can retry.
    }
  });

  const modalContent = (
    <div
      className={cn(styles.backdrop, open && styles.backdropOpen)}
      onClick={handleBackdropClick}
      aria-hidden={!open}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Enquiry form">
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h2 className={styles.title}>Enquire Now</h2>
        {productName && <p className={styles.productTag}>{productName}</p>}
        <p className={styles.subtitle}>Fill in the details below and our team will get back to you shortly.</p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="enquiry-fullName">
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                id="enquiry-fullName"
                className={cn(styles.input, errors.fullName && styles.inputError)}
                type="text"
                placeholder="Enter your full name"
                {...register('fullName', {
                  required: 'Full name is required.',
                  pattern: { value: NAME_REGEX, message: 'Enter a valid full name.' },
                  minLength: { value: 2, message: 'Full name must be at least 2 characters.' },
                  maxLength: { value: 80, message: 'Full name cannot exceed 80 characters.' },
                })}
              />
              {errors.fullName && <span className={styles.errorMsg}>{errors.fullName.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="enquiry-companyName">
                Company Name
              </label>
              <input
                id="enquiry-companyName"
                className={cn(styles.input, errors.companyName && styles.inputError)}
                type="text"
                placeholder="Enter company name"
                {...register('companyName', {
                  validate: (value) =>
                    !value || COMPANY_REGEX.test(value) || 'Enter a valid company name.',
                  maxLength: { value: 100, message: 'Company name cannot exceed 100 characters.' },
                })}
              />
              {errors.companyName && <span className={styles.errorMsg}>{errors.companyName.message}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="enquiry-email">
                Email ID <span className={styles.required}>*</span>
              </label>
              <input
                id="enquiry-email"
                className={cn(styles.input, errors.email && styles.inputError)}
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required.',
                  pattern: { value: EMAIL_REGEX, message: 'Enter a valid email address.' },
                })}
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="enquiry-contactNo">
                Contact No. <span className={styles.required}>*</span>
              </label>
              <Controller
                name="contactNo"
                control={control}
                rules={{
                  required: 'Contact number is required.',
                  validate: (value) => {
                    const digits = value.replace(/\D/g, '');
                    return (
                      (digits.length >= 7 && digits.length <= 15) ||
                      'Enter a valid contact number.'
                    );
                  },
                }}
                render={({ field }) => (
                  <input
                    id="enquiry-contactNo"
                    className={cn(styles.input, errors.contactNo && styles.inputError)}
                    type="tel"
                    placeholder="Enter contact number"
                    {...field}
                  />
                )}
              />
              {errors.contactNo && <span className={styles.errorMsg}>{errors.contactNo.message}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="enquiry-type">
              Enquiry Type <span className={styles.required}>*</span>
            </label>
            <select
              id="enquiry-type"
              className={cn(styles.select, errors.enquiryType && styles.inputError)}
              defaultValue=""
              {...register('enquiryType', { required: 'Please select an enquiry type.' })}
            >
              <option value="" disabled>Select enquiry type</option>
              {enquiryTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.enquiryType && <span className={styles.errorMsg}>{errors.enquiryType.message}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="enquiry-message">
              Message
            </label>
            <textarea
              id="enquiry-message"
              className={cn(styles.textarea, errors.message && styles.inputError)}
              placeholder="Write your message here..."
              rows={4}
              {...register('message', {
                validate: (value) =>
                  !value || MESSAGE_REGEX.test(value) || 'Message contains invalid characters.',
                minLength: { value: 10, message: 'Message must be at least 10 characters.' },
                maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters.' },
              })}
            />
            {errors.message && <span className={styles.errorMsg}>{errors.message.message}</span>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <span className={styles.submitArrow}>
              <svg viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 1L18 6M18 6L12.5 11M18 6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  );

  if (!isMounted || !open) {
    return null;
  }

  return createPortal(modalContent, document.body);
}