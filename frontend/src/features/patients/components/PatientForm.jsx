// frontend/src/features/patients/components/PatientForm.jsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient, updatePatient } from '../../../api/patients';
import { BottomSheet, Button, Input, Select } from '../../../components/ui';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const patientSchema = z.object({
  patient_name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  age: z.number().min(0, 'Age must be positive').optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  visit_reason: z.string().optional(),
});

// Spring preset for form fields
const fieldSpring = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 0.6,
  bounce: 0.05,
};

export const PatientForm = ({ isOpen, onClose, patient }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patient_name: '',
      phone: '',
      email: '',
      age: '',
      gender: '',
      address: '',
      visit_reason: '',
    },
  });

  useEffect(() => {
    if (patient) {
      reset({
        patient_name: patient.patient_name || '',
        phone: patient.phone || '',
        email: patient.email || '',
        age: patient.age || '',
        gender: patient.gender || '',
        address: patient.address || '',
        visit_reason: patient.visit_reason || '',
      });
    } else {
      reset({
        patient_name: '',
        phone: '',
        email: '',
        age: '',
        gender: '',
        address: '',
        visit_reason: '',
      });
    }
  }, [patient, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const cleanedData = {
        patient_name: data.patient_name,
        phone: data.phone || null,
        email: data.email || null,
        age: data.age ? Number(data.age) : null,
        gender: data.gender || null,
        address: data.address || null,
        visit_reason: data.visit_reason || null,
      };

      if (patient) {
        return await updatePatient(patient.patient_id, cleanedData);
      } else {
        return await createPatient(cleanedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success(patient ? 'Patient updated successfully' : 'Patient created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Operation failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  // Staggered field animation delay
  const getFieldDelay = (index) => 0.05 + index * 0.03;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={patient ? 'Edit Patient' : 'Add New Patient'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
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
            placeholder="Enter full name"
            {...register('patient_name')}
            error={errors.patient_name?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Phone */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(1) }}
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

        {/* Email */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(2) }}
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

        {/* Age */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(3) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Age
          </label>
          <Input
            placeholder="Enter age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Gender */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(4) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Gender
          </label>
          <Select
            options={[
              { value: '', label: 'Select Gender' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
            {...register('gender')}
            error={errors.gender?.message}
            placeholder="Select Gender"
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Address */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(5) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Address
          </label>
          <Input
            placeholder="Enter address"
            {...register('address')}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Visit Reason */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(6) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Visit Reason
          </label>
          <Input
            placeholder="Enter reason for visit"
            {...register('visit_reason')}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-end gap-3 pt-4 mt-4 border-t border-white/20 dark:border-dark-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(7) }}
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
            {patient ? 'Update Patient' : 'Create Patient'}
          </Button>
        </motion.div>
      </form>
    </BottomSheet>
  );
};