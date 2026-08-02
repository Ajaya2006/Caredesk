import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient, updatePatient } from '../../../api/patients';
import { BottomSheet, Button, Input, Select } from '../../../Components/ui';
import { toast } from 'sonner';
import { useEffect } from 'react';

const patientSchema = z.object({
  patient_name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  age: z.number().min(0, 'Age must be positive').optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  visit_reason: z.string().optional(),
});

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
      // Clean data - convert empty strings to null
      const cleanedData = {
        patient_name: data.patient_name,
        phone: data.phone || null,
        email: data.email || null,
        age: data.age ? Number(data.age) : null,
        gender: data.gender || null,
        address: data.address || null,
        visit_reason: data.visit_reason || null,
      };

      console.log('Patient data to save:', cleanedData);

      if (patient) {
        console.log('Updating patient with ID:', patient.patient_id);
        return await updatePatient(patient.patient_id, cleanedData);
      } else {
        return await createPatient(cleanedData);
      }
    },
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      queryClient.invalidateQueries(['patients']);
      toast.success(patient ? 'Patient updated successfully' : 'Patient created successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      console.error('Error response:', error.response?.data);

      // Handle validation errors properly
      const errorData = error.response?.data;
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          // Pydantic validation errors
          const messages = errorData.detail.map((err) => {
            const field = err.loc?.join('.') || 'field';
            return `${field}: ${err.msg}`;
          }).join('\n');
          toast.error(`Validation Error:\n${messages}`);
        } else if (typeof errorData.detail === 'string') {
          toast.error(errorData.detail);
        } else {
          toast.error('Operation failed. Please check your input.');
        }
      } else {
        toast.error('Operation failed. Please try again.');
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? 'Edit Patient' : 'Add New Patient'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Full Name"
          {...register('patient_name')}
          error={errors.patient_name?.message}
        />
        <Input
          placeholder="Phone"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Input
          placeholder="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          placeholder="Age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          error={errors.age?.message}
        />
        <Select
          options={[
            { value: '', label: 'Select Gender' },
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          {...register('gender')}
          error={errors.gender?.message}
        />
        <Input
          placeholder="Address"
          {...register('address')}
        />
        <Input
          placeholder="Visit Reason"
          {...register('visit_reason')}
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-dark-border">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={mutation.isPending}>
            {patient ? 'Update' : 'Create'} Patient
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};