
import { useState, useEffect, useRef } from 'react';

interface AnimatedTextareaProps {
  text: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

const AnimatedTextarea = ({ 
  text, 
  placeholder = "Write your prompt here...", 
  onChange, 
  readOnly = false,
  className = ""
}: AnimatedTextareaProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [editableText, setEditableText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [displayText, editableText]);

  // Animation effect
  useEffect(() => {
    if (readOnly && text) {
      setIsAnimating(true);
      let currentIndex = 0;
      const animationSpeed = 5; // Characters per frame
      
      const typeAnimation = setInterval(() => {
        const nextChunk = text.substring(currentIndex, currentIndex + animationSpeed);
        setDisplayText(prev => prev + nextChunk);
        currentIndex += animationSpeed;
        
        if (currentIndex >= text.length) {
          clearInterval(typeAnimation);
          setIsAnimating(false);
        }
      }, 30);
      
      return () => clearInterval(typeAnimation);
    } else {
      setDisplayText(text);
    }
  }, [text, readOnly]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={readOnly ? displayText : editableText}
      onChange={handleChange}
      placeholder={placeholder}
      readOnly={readOnly || isAnimating}
      className={`animated-textarea ${isAnimating ? 'animating' : ''} ${className}`}
    />
  );
};

export default AnimatedTextarea;
