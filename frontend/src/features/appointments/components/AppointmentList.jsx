// frontend/src/features/appointments/pages/AppointmentList.jsx

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from '../../../api/appointments';
import { getDoctors } from '../../../api/doctors';
import { getPatients } from '../../../api/patients';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  StatusChip,
  EmptyState,
  Button,
  FrostedCard,
  Select
} from '../../../Components/ui';
import { AppointmentForm } from '../components/AppointmentForm';
import { AppointmentDetails } from '../components/AppointmentDetails';
import { PageTransition } from '../../../Components/animations/PageTransition';
import { Plus, Pencil, Trash2, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AppointmentList() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['appointments', statusFilter],
    queryFn: () => getAppointments({ status: statusFilter || undefined }),
    staleTime: 1000 * 60,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Status updated successfully');
      refetch();
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment cancelled successfully');
      refetch();
    },
    onError: () => toast.error('Failed to cancel appointment'),
  });

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  const handleDelete = (id) => {
    if (window.confirm('Cancel this appointment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleView = (appointment) => {
    setViewingAppointment(appointment);
    setIsDetailsOpen(true);
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 hero-frosted" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}illustrations/appointments-hero.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text dark:text-dark-text">Appointments</h1>
            <p className="text-muted dark:text-dark-muted">View and manage appointments</p>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Book Appointment
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'Confirmed', label: 'Confirmed' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
          placeholder="Filter by status"
        />
      </div>

      <FrostedCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background dark:bg-dark-bg border-b border-border dark:border-dark-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8">
                    <EmptyState
                      title="No appointments found"
                      description="Book your first appointment to get started."
                      actionLabel="Book Appointment"
                      onAction={handleAdd}
                      illustration="empty-appointments"
                    />
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <motion.tr
                    key={appointment.appointment_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-bg transition-colors"
                  >
                    <td className="px-4 py-3 align-middle">
                      <span className="text-text dark:text-dark-text">{appointment.patient_name}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-text dark:text-dark-text">{appointment.doctor_name}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted dark:text-dark-muted" />
                        <span className="text-text dark:text-dark-text">{appointment.appointment_date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-text dark:text-dark-text">{appointment.appointment_time}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <StatusChip status={appointment.status} />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleView(appointment)}
                          className="p-1.5 rounded-lg bg-info/10 text-info hover:bg-info hover:text-white transition-all duration-200 group"
                          title="View Appointment Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="p-1.5 rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200 group"
                          title="Edit Appointment"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <select
                          className="border border-input rounded px-2 py-1 text-sm bg-surface dark:bg-dark-surface"
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.appointment_id, e.target.value)}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(appointment.appointment_id)}
                          className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all duration-200 group"
                          title="Cancel Appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </FrostedCard>

      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAppointment(null);
        }}
        appointment={editingAppointment}
        doctors={doctors}
        patients={patients}
      />

      <AppointmentDetails
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingAppointment(null);
        }}
        appointment={viewingAppointment}
      />
    </PageTransition>
  );
}