import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPatients } from '../../../api/patients';
import { getDoctors } from '../../../api/doctors';
import { createAppointment } from '../../../api/appointments';
import { Card, Input, Select, Button, FrostedCard } from '../../../components/ui';
import { PageTransition } from '../../../components/animations/PageTransition';
import { Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
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
      patient_id: Number(data.patient_id),
      doctor_id: Number(data.doctor_id),
    });
  };

  return (
    <PageTransition>
      <div className="relative w-full h-40 rounded-card overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-secondary-500/30" />
        <div className="absolute inset-0 bg-[url('/illustrations/booking-hero.png')] bg-cover bg-center opacity-20" />
        <div className="frosted absolute inset-0 rounded-card" />
        <div className="relative z-10 flex items-center h-full px-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text dark:text-dark-text">Book Appointment</h1>
            <p className="text-muted dark:text-dark-muted">Schedule a new patient appointment</p>
          </div>
        </div>
      </div>

      <FrostedCard className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            options={[
              { value: '', label: 'Select Patient' },
              ...patients.map((p) => ({ value: String(p.patient_id), label: p.patient_name })),
            ]}
            {...register('patient_id')}
            error={errors.patient_id?.message}
          />
          <Select
            options={[
              { value: '', label: 'Select Doctor' },
              ...doctors.map((d) => ({ value: String(d.doctor_id), label: d.doctor_name })),
            ]}
            {...register('doctor_id')}
            error={errors.doctor_id?.message}
          />
          <Input
            type="date"
            icon={<Calendar className="w-5 h-5 text-muted" />}
            {...register('appointment_date')}
            error={errors.appointment_date?.message}
          />
          <Input
            type="time"
            icon={<Clock className="w-5 h-5 text-muted" />}
            {...register('appointment_time')}
            error={errors.appointment_time?.message}
          />
          <Input placeholder="Reason for visit" {...register('reason')} />
          <Input placeholder="Remarks (optional)" {...register('remarks')} />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={mutation.isPending}
          >
            Book Appointment
          </Button>
        </form>
      </FrostedCard>
    </PageTransition>
  );
}