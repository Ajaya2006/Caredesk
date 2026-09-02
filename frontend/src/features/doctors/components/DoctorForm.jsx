// frontend/src/features/doctors/components/DoctorForm.jsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDoctor, updateDoctor } from '../../../api/doctors';
import { BottomSheet, Button, Input, Select } from '../../../Components/ui';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const doctorSchema = z.object({
  doctor_name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  experience: z.number().min(0, 'Experience cannot be negative').optional(),
  availability: z.string().optional(),
});

const fieldSpring = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 0.6,
  bounce: 0.05,
};

export const DoctorForm = ({ isOpen, onClose, doctor }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      doctor_name: '',
      specialization: '',
      phone: '',
      email: '',
      experience: '',
      availability: '',
    },
  });

  useEffect(() => {
    if (doctor) {
      reset({
        doctor_name: doctor.doctor_name || '',
        specialization: doctor.specialization || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        experience: doctor.experience || '',
        availability: doctor.availability || '',
      });
    } else {
      reset({
        doctor_name: '',
        specialization: '',
        phone: '',
        email: '',
        experience: '',
        availability: '',
      });
    }
  }, [doctor, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const cleanedData = {
        doctor_name: data.doctor_name,
        specialization: data.specialization,
        phone: data.phone || null,
        email: data.email || null,
        experience: data.experience ? Number(data.experience) : null,
        availability: data.availability || null,
      };

      if (doctor) {
        return await updateDoctor(doctor.doctor_id, cleanedData);
      } else {
        return await createDoctor(cleanedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
      toast.success(doctor ? 'Doctor updated successfully' : 'Doctor created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Operation failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const getFieldDelay = (index) => 0.05 + index * 0.03;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={doctor ? 'Edit Doctor' : 'Add New Doctor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(0) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Full Name <span className="text-danger">*</span>
          </label>
          <Input
            placeholder="Enter doctor's full name"
            {...register('doctor_name')}
            error={errors.doctor_name?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(1) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Specialization <span className="text-danger">*</span>
          </label>
          <Input
            placeholder="Enter specialization (e.g., Cardiology)"
            {...register('specialization')}
            error={errors.specialization?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(2) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Phone
          </label>
          <Input
            placeholder="Enter phone number"
            {...register('phone')}
            error={errors.phone?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(3) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Email
          </label>
          <Input
            placeholder="Enter email address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(4) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Experience (years)
          </label>
          <Input
            placeholder="Enter years of experience"
            type="number"
            {...register('experience', { valueAsNumber: true })}
            error={errors.experience?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(5) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Availability
          </label>
          <Select
            options={[
              { value: '', label: 'Select Availability' },
              { value: 'Mon-Fri', label: 'Monday - Friday' },
              { value: 'Mon-Sat', label: 'Monday - Saturday' },
              { value: 'Weekends', label: 'Weekends' },
            ]}
            {...register('availability')}
            error={errors.availability?.message}
            placeholder="Select Availability"
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        <motion.div
          className="flex justify-end gap-3 pt-4 mt-4 border-t border-white/20 dark:border-dark-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(6) }}
        >
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={mutation.isPending}
          >
            {doctor ? 'Update Doctor' : 'Create Doctor'}
          </Button>
        </motion.div>
      </form>
    </BottomSheet>
  );
};