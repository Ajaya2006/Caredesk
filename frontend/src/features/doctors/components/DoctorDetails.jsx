import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Calendar, User, Stethoscope, Award, Clock } from 'lucide-react';
import { getPatientAvatar, getFallbackColor } from '../../../lib/avatarService';
import { StatusChip } from '../../../Components/ui';

export const DoctorDetails = ({ isOpen, onClose, doctor }) => {
  if (!doctor) return null;

  const avatarUrl = getPatientAvatar(doctor.doctor_id, doctor.doctor_name);
  const fallbackColor = getFallbackColor(doctor.doctor_id);

  const getInitials = (name) => {
    if (!name) return 'D';
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
                      alt={doctor.doctor_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const initials = getInitials(doctor.doctor_name);
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
                      {doctor.doctor_name}
                    </h2>
                    <p className="text-sm text-muted dark:text-dark-muted">
                      Doctor ID: #{String(doctor.doctor_id).slice(0, 8)}
                    </p>
                  </div>
                  <StatusChip status={doctor.is_active ? 'Active' : 'Inactive'} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">
                      Professional Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Stethoscope className="w-4 h-4 text-muted dark:text-dark-muted" />
                        <span className="text-text dark:text-dark-text">{doctor.specialization}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Award className="w-4 h-4 text-muted dark:text-dark-muted" />
                        <span className="text-text dark:text-dark-text">{doctor.experience || '—'} years experience</span>
                      </div>
                      {doctor.availability && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">{doctor.availability}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {doctor.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">{doctor.phone}</span>
                        </div>
                      )}
                      {doctor.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-muted dark:text-dark-muted" />
                          <span className="text-text dark:text-dark-text">{doctor.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};