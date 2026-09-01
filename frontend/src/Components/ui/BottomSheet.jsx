// frontend/src/components/ui/BottomSheet.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

// Custom spring presets for smooth animations
const springPresets = {
  // For the sheet itself - bouncy but smooth
  sheet: {
    type: 'spring',
    stiffness: 350,
    damping: 32,
    mass: 0.8,
    bounce: 0.12,
  },
  // For content - slightly different for staggered feel
  content: {
    type: 'spring',
    stiffness: 300,
    damping: 28,
    mass: 0.7,
    bounce: 0.08,
  },
  // For backdrop - smooth fade
  backdrop: {
    duration: 0.25,
    ease: [0.22, 1, 0.36, 1], // Custom ease curve
  },
  // For close button
  button: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  },
};

export const BottomSheet = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springPresets.backdrop}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Bottom Sheet with custom spring */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
            <motion.div
              initial={{ 
                y: '100%', 
                opacity: 0,
                scale: 0.96,
              }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: 1,
              }}
              exit={{ 
                y: '100%', 
                opacity: 0,
                scale: 0.96,
              }}
              transition={springPresets.sheet}
              className={`pointer-events-auto w-full ${maxWidth} max-h-[90vh] 
                bg-white/80 dark:bg-dark-surface/80 
                backdrop-blur-xl backdrop-saturate-150
                border border-white/30 dark:border-dark-border/30
                rounded-t-3xl shadow-2xl overflow-hidden`}
            >
              {/* Handle Bar with spring animation */}
              <motion.div 
                className="flex justify-center pt-3 pb-1"
                initial={{ opacity: 0, y: -8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.08,
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  mass: 0.4,
                }}
              >
                <motion.div 
                  className="w-12 h-1.5 rounded-full bg-neutral-300/70 dark:bg-neutral-600/70"
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ 
                    delay: 0.1,
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              </motion.div>
              
              {/* Header with spring animation */}
              <motion.div 
                className="flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-dark-border/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  mass: 0.5,
                }}
              >
                <motion.h2 
                  className="text-xl font-heading font-bold text-text dark:text-dark-text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.1,
                    type: 'spring',
                    stiffness: 350,
                    damping: 25,
                  }}
                >
                  {title}
                </motion.h2>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springPresets.button}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-dark-border/20 transition-colors"
                >
                  <X className="w-5 h-5 text-muted dark:text-dark-muted" />
                </motion.button>
              </motion.div>
              
              {/* Content with staggered spring animation */}
              <motion.div 
                className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.12,
                  type: 'spring',
                  stiffness: 280,
                  damping: 30,
                  mass: 0.7,
                  bounce: 0.08,
                }}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};