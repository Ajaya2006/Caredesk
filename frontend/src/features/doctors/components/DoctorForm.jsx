import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDoctor, updateDoctor } from '../../../api/doctors';
import { BottomSheet, Button, Input, Select } from '../../../components/ui';
import { toast } from 'sonner';
import { useEffect } from 'react';

const doctorSchema = z.object({
  doctor_name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  experience: z.number().min(0, 'Experience cannot be negative').optional(),
  availability: z.string().optional(),
});

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
      
      console.log('Doctor data to save:', cleanedData);
      
      if (doctor) {
        console.log('Updating doctor with ID:', doctor.doctor_id);
        return await updateDoctor(doctor.doctor_id, cleanedData);
      } else {
        return await createDoctor(cleanedData);
      }
    },
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      queryClient.invalidateQueries(['doctors']);
      toast.success(doctor ? 'Doctor updated successfully' : 'Doctor created successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      const errorMessage = error.response?.data?.detail || 'Operation failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={doctor ? 'Edit Doctor' : 'Add New Doctor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Full Name" {...register('doctor_name')} error={errors.doctor_name?.message} />
        <Input placeholder="Specialization" {...register('specialization')} error={errors.specialization?.message} />
        <Input placeholder="Phone" {...register('phone')} error={errors.phone?.message} />
        <Input placeholder="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input placeholder="Experience (years)" type="number" {...register('experience', { valueAsNumber: true })} error={errors.experience?.message} />
        <Select options={[
          { value: '', label: 'Select Availability' },
          { value: 'Mon-Fri', label: 'Monday - Friday' },
          { value: 'Mon-Sat', label: 'Monday - Saturday' },
          { value: 'Weekends', label: 'Weekends' },
        ]} {...register('availability')} error={errors.availability?.message} />
        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-dark-border">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" isLoading={mutation.isPending}>
            {doctor ? 'Update' : 'Create'} Doctor
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};