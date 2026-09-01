// frontend/src/components/ui/Select.jsx

import { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

export const Select = forwardRef(({ 
  className, 
  options, 
  error, 
  value,
  onChange,
  onBlur,
  name,
  placeholder = 'Select an option',
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef(null);
  const hiddenInputRef = useRef(null);

  useEffect(() => {
    const selected = options.find(opt => String(opt.value) === String(value));
    setSelectedLabel(selected?.label || placeholder);
  }, [value, options, placeholder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue, optionLabel) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = optionValue;
    }
    
    const event = {
      target: {
        name: name,
        value: optionValue,
      },
    };
    
    if (onChange) {
      onChange(event);
    }
    if (onBlur) {
      onBlur(event);
    }
    
    setSelectedLabel(optionLabel);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={(e) => {
          if (typeof ref === 'function') {
            ref(e);
          } else if (ref) {
            ref.current = e;
          }
          hiddenInputRef.current = e;
        }}
        type="hidden"
        name={name}
        value={value || ''}
      />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full h-12 rounded-input border bg-surface dark:bg-dark-surface',
          'text-text dark:text-dark-text placeholder-muted dark:placeholder-dark-muted',
          'focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
          'flex items-center justify-between px-4',
          'hover:border-primary-300 dark:hover:border-primary-700 transition-colors',
          error ? 'border-danger-500 focus:ring-danger-500/50' : 'border-border dark:border-dark-border',
          className
        )}
        {...props}
      >
        <span className={clsx(
          'truncate text-left',
          !selectedLabel || selectedLabel === placeholder 
            ? 'text-muted dark:text-dark-muted' 
            : 'text-text dark:text-dark-text'
        )}>
          {selectedLabel || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-5 h-5 text-muted dark:text-dark-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 
              bg-surface dark:bg-dark-surface
              border border-border dark:border-dark-border
              rounded-xl shadow-lg overflow-hidden
              max-h-60 overflow-y-auto"
          >
            <div className="py-1">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value, option.label)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-primary-50 dark:hover:bg-primary-900/20',
                    String(value) === String(option.value)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'text-text dark:text-dark-text'
                  )}
                >
                  <span>{option.label}</span>
                  {String(value) === String(option.value) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-sm text-danger-500 mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';