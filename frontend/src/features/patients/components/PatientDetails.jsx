import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Calendar, User, Droplet, Activity } from 'lucide-react';
import { getPatientAvatar, getFallbackColor } from '../../../lib/avatarService';
import { StatusChip } from '../../../Components/ui';

export const PatientDetails = ({ isOpen, onClose, patient }) => {
  if (!patient) return null;

  const avatarUrl = getPatientAvatar(patient.patient_id, patient.patient_name);
  const fallbackColor = getFallbackColor(patient.patient_id);

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="relative w-full max-w-2xl bg-surface dark:bg-dark-surface rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-background dark:hover:bg-dark-bg transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted dark:text-dark-muted" />
              </button>

              {/* Header with Avatar */}
              <div className="relative h-32 bg-gradient-to-r from-primary-500/20 to-secondary-500/20">
                <div className="absolute -bottom-12 left-8">
                  <div className="relative w-24 h-24 rounded-full border-4 border-surface dark:border-dark-surface overflow-hidden">
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

              {/* Content */}
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

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-muted dark:text-dark-muted" />
                        <span className="text-text dark:text-dark-text">{patient.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-muted dark:text-dark-muted" />
                        <span className="text-text dark:text-dark-text">{patient.age || '—'} years</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-muted dark:text-dark-muted" />
                        <span className="text-text dark:text-dark-text">{patient.gender || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {patient.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">{patient.phone}</span>
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">{patient.email}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">{patient.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Information (if available) */}
                {(patient.blood_group || patient.visit_reason) && (
                  <div className="mt-6 pt-6 border-t border-border dark:border-dark-border">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-4">
                      Medical Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patient.blood_group && (
                        <div className="flex items-center gap-3 text-sm">
                          <Droplet className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">Blood Group: {patient.blood_group}</span>
                        </div>
                      )}
                      {patient.visit_reason && (
                        <div className="flex items-center gap-3 text-sm">
                          <Activity className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">Visit Reason: {patient.visit_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};