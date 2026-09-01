// frontend/src/features/patients/components/PatientDetails.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Calendar, User, Activity, Clock, Heart } from 'lucide-react';
import { getAvatar, getFallbackColor } from '../../../lib/avatarService';
import { StatusChip, Button } from '../../../components/ui';

export const PatientDetails = ({ isOpen, onClose, patient }) => {
  if (!patient) return null;

  const avatarUrl = getAvatar(patient.patient_id, patient.patient_name, 'patient');
  const fallbackColor = getFallbackColor(patient.patient_id);

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
                mass: 0.9,
                bounce: 0.15,
              }}
              className="relative w-full max-w-2xl 
                bg-white/80 dark:bg-dark-surface/80 
                backdrop-blur-xl backdrop-saturate-150
                border border-white/30 dark:border-dark-border/30
                rounded-2xl shadow-2xl overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg 
                  bg-white/20 dark:bg-dark-surface/20 
                  backdrop-blur-sm hover:bg-white/40 dark:hover:bg-dark-surface/40 
                  transition-colors z-10"
              >
                <X className="w-5 h-5 text-text dark:text-dark-text" />
              </motion.button>

              <div className="relative h-32 bg-gradient-to-r from-[#234EC8]/30 to-secondary-500/30">
                <div className="absolute -bottom-12 left-8">
                  <div className="relative w-24 h-24 rounded-full border-4 border-white/50 dark:border-dark-border/50 overflow-hidden shadow-xl">
                    <img
                      src={avatarUrl}
                      alt={patient.patient_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const initials = getInitials(patient.patient_name);
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-white font-bold text-2xl" style="background-color: ${fallbackColor}">
                            ${initials}
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 px-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-text dark:text-dark-text">
                      {patient.patient_name}
                    </h2>
                    <p className="text-sm text-muted dark:text-dark-muted">
                      Patient ID: #{String(patient.patient_id).slice(0, 8)}
                    </p>
                  </div>
                  <StatusChip status={patient.is_active !== false ? 'Active' : 'Inactive'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-3">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">{patient.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">{patient.age || '—'} years</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">Registered: {new Date(patient.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {patient.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                          <span className="text-text dark:text-dark-text">{patient.phone}</span>
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                          <span className="text-text dark:text-dark-text">{patient.email}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                          <span className="text-text dark:text-dark-text">{patient.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {patient.visit_reason && (
                  <div className="mt-4 p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-2">
                      Medical Information
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <Heart className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                      <span className="text-text dark:text-dark-text">Visit Reason: {patient.visit_reason}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/20 dark:border-dark-border/20">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={onClose}
                    className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};