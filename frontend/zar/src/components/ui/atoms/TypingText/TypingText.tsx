'use client';

import { useState, useEffect } from 'react';
import styles from './TypingText.module.css';

interface TypingTextProps {
  text: string;
  speed?: number;
  delayBetweenLoops?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypingText({
  text,
  speed = 1000,
  delayBetweenLoops = 5000,
  className = '',
  cursorClassName = '',
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else if (displayedText.length === text.length && !isComplete) {
      setIsComplete(true);
    }
  }, [displayedText, text, speed, isComplete]);

  useEffect(() => {
    if (isComplete) {
      const resetTimer = setTimeout(() => {
        setDisplayedText('');
        setIsComplete(false);
      }, delayBetweenLoops);

      return () => clearTimeout(resetTimer);
    }
  }, [isComplete, delayBetweenLoops]);

  return (
    <span className={`${styles.typingText} ${className}`}>
      {displayedText}
      <span className={`${styles.cursor} ${isComplete ? styles.complete : ''} ${cursorClassName}`} />
    </span>
  );
}
