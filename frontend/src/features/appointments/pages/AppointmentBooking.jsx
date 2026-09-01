// frontend/src/features/appointments/pages/AppointmentBooking.jsx

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPatients } from '../../../api/patients';
import { getDoctors } from '../../../api/doctors';
import { createAppointment } from '../../../api/appointments';
import { Card, Input, Select, Button, FrostedCard } from '../../../components/ui';
import { PageTransition } from '../../../components/animations/PageTransition';
import { Calendar, Clock, User, Stethoscope, FileText, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

const fieldSpring = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 0.6,
  bounce: 0.05,
};

export default function AppointmentBooking() {
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  });
  
  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      remarks: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success('Appointment booked successfully');
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Booking failed');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
    });
  };

  const getFieldDelay = (index) => 0.05 + index * 0.03;

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 hero-frosted" />
        <div className="absolute inset-0 bg-[url('/illustrations/booking-hero.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex items-center h-full px-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text dark:text-dark-text">
              Book Appointment
            </h1>
            <p className="text-muted dark:text-dark-muted">
              Schedule a new patient appointment
            </p>
          </div>
        </div>
      </div>

      <FrostedCard className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Patient Select with Label */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(0) }}
          >
            <label className="block text-sm font-medium text-text dark:text-dark-text">
              Patient <span className="text-danger">*</span>
            </label>
            <Select
              options={[
                { value: '', label: 'Select Patient' },
                ...patients.map((p) => ({ 
                  value: String(p.patient_id), 
                  label: p.patient_name 
                })),
              ]}
              {...register('patient_id')}
              error={errors.patient_id?.message}
              placeholder="Select Patient"
              className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            />
          </motion.div>

          {/* Doctor Select with Label */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(1) }}
          >
            <label className="block text-sm font-medium text-text dark:text-dark-text">
              Doctor <span className="text-danger">*</span>
            </label>
            <Select
              options={[
                { value: '', label: 'Select Doctor' },
                ...doctors.map((d) => ({ 
                  value: String(d.doctor_id), 
                  label: d.doctor_name 
                })),
              ]}
              {...register('doctor_id')}
              error={errors.doctor_id?.message}
              placeholder="Select Doctor"
              className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            />
          </motion.div>

          {/* Date with Label */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(2) }}
          >
            <label className="block text-sm font-medium text-text dark:text-dark-text">
              Appointment Date <span className="text-danger">*</span>
            </label>
            <Input
              type="date"
              icon={<Calendar className="w-5 h-5 text-muted" />}
              {...register('appointment_date')}
              error={errors.appointment_date?.message}
              className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            />
          </motion.div>

          {/* Time with Label */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(3) }}
          >
            <label className="block text-sm font-medium text-text dark:text-dark-text">
              Appointment Time <span className="text-danger">*</span>
            </label>
            <Input
              type="time"
              icon={<Clock className="w-5 h-5 text-muted" />}
              {...register('appointment_time')}
              error={errors.appointment_time?.message}
              className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            />
          </motion.div>

          {/* Reason with Label */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(4) }}
          >
            <label className="block text-sm font-medium text-text dark:text-dark-text">
              Reason for Visit
            </label>
            <Input
              placeholder="Enter reason for visit"
              icon={<FileText className="w-5 h-5 text-muted" />}
              {...register('reason')}
              className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            />
          </motion.div>

          {/* Remarks with Label */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(5) }}
          >
            <label className="block text-sm font-medium text-text dark:text-dark-text">
              Remarks
            </label>
            <Input
              placeholder="Enter any remarks (optional)"
              icon={<MessageCircle className="w-5 h-5 text-muted" />}
              {...register('remarks')}
              className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            className="pt-4 mt-4 border-t border-white/20 dark:border-dark-border/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fieldSpring, delay: getFieldDelay(6) }}
          >
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={mutation.isPending}
            >
              {mutation.isPending ? 'Booking...' : 'Book Appointment'}
            </Button>
          </motion.div>
        </form>
      </FrostedCard>
    </PageTransition>
  );
}