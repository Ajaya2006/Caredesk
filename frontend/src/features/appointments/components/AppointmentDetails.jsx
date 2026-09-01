// frontend/src/features/appointments/components/AppointmentDetails.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Stethoscope, FileText, MessageCircle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { StatusChip, Button } from '../../../components/ui';

export const AppointmentDetails = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  const statusColors = {
    'Scheduled': 'text-blue-500',
    'Confirmed': 'text-green-500',
    'Completed': 'text-emerald-500',
    'Cancelled': 'text-red-500',
    'Pending': 'text-yellow-500',
  };

  const statusIcons = {
    'Scheduled': ClockIcon,
    'Confirmed': CheckCircle,
    'Completed': CheckCircle,
    'Cancelled': XCircle,
    'Pending': ClockIcon,
  };

  const StatusIcon = statusIcons[appointment.status] || ClockIcon;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with frosted blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal with frosted glass */}
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
              {/* Close Button */}
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

              {/* Header */}
              <div className="relative h-24 bg-gradient-to-r from-[#234EC8]/30 to-secondary-500/30">
                <div className="absolute bottom-0 left-8 pb-4">
                  <h2 className="text-2xl font-heading font-bold text-text dark:text-dark-text">
                    Appointment Details
                  </h2>
                  <p className="text-sm text-muted dark:text-dark-muted">
                    Appointment ID: #{String(appointment.appointment_id).slice(0, 8)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="pt-6 pb-6 px-8">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${statusColors[appointment.status] || 'text-muted'}`} />
                    <StatusChip status={appointment.status} />
                  </div>
                  <span className="text-xs text-muted dark:text-dark-muted">
                    {new Date(appointment.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Details Grid with Frosted Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Patient Information */}
                  <div className="p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-3">
                      Patient Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">{appointment.patient_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">ID: {String(appointment.patient_id).slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Information */}
                  <div className="p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-3">
                      Doctor Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Stethoscope className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">{appointment.doctor_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">ID: {String(appointment.doctor_id).slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-3">
                      Schedule
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">{appointment.appointment_date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8]" />
                        <span className="text-text dark:text-dark-text">{appointment.appointment_time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="p-4 rounded-xl bg-white/40 dark:bg-dark-surface/40 backdrop-blur-sm border border-white/20 dark:border-dark-border/20">
                    <h3 className="text-sm font-semibold text-muted dark:text-dark-muted uppercase tracking-wider mb-3">
                      Additional Information
                    </h3>
                    <div className="space-y-3">
                      {appointment.reason && (
                        <div className="flex items-start gap-3 text-sm">
                          <FileText className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8] mt-0.5" />
                          <span className="text-text dark:text-dark-text">{appointment.reason}</span>
                        </div>
                      )}
                      {appointment.remarks && (
                        <div className="flex items-start gap-3 text-sm">
                          <MessageCircle className="w-4 h-4 text-[#234EC8] dark:text-[#234EC8] mt-0.5" />
                          <span className="text-text dark:text-dark-text">{appointment.remarks}</span>
                        </div>
                      )}
                      {!appointment.reason && !appointment.remarks && (
                        <p className="text-sm text-muted dark:text-dark-muted">No additional information</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
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