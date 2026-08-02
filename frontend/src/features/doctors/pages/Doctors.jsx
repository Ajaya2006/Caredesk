import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctors, deleteDoctor } from '../../../api/doctors';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Button,
  StatusChip,
  EmptyState,
  FrostedCard
} from '../../../Components/ui';
import { PageTransition } from '../../../Components/animations/PageTransition';
import { DoctorForm } from '../components/DoctorForm';
import { DoctorDetails } from '../components/DoctorDetails';
import { Plus, Pencil, Trash2, Stethoscope, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getPatientAvatar, getFallbackColor, preloadPatientAvatars } from '../../../lib/avatarService';

export default function Doctors() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [avatarErrors, setAvatarErrors] = useState({});

  const { data: doctors = [], isLoading, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (doctors.length > 0) {
      preloadPatientAvatars(doctors);
    }
  }, [doctors]);

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
      toast.success('Doctor deleted successfully');
      refetch();
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete doctor');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleView = (doctor) => {
    setViewingDoctor(doctor);
    setIsDetailsOpen(true);
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  const getInitials = (name) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAvatarError = (doctorId) => {
    setAvatarErrors(prev => ({ ...prev, [doctorId]: true }));
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 hero-frosted" />
        <div className="absolute inset-0 bg-[url('/illustrations/doctors-hero.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text dark:text-dark-text">Doctors</h1>
            <p className="text-muted dark:text-dark-muted">Manage your medical team</p>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Doctor
          </Button>
        </div>
      </div>

      <FrostedCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background dark:bg-dark-bg border-b border-border dark:border-dark-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider" style={{ width: '28%' }}>Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider" style={{ width: '22%' }}>Specialization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider" style={{ width: '15%' }}>Experience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider" style={{ width: '15%' }}>Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider" style={{ width: '20%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                    </div>
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8">
                    <EmptyState
                      title="No doctors found"
                      description="Add your first doctor to get started."
                      actionLabel="Add Doctor"
                      onAction={handleAdd}
                      illustration="empty-doctors"
                    />
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => {
                  const avatarUrl = getPatientAvatar(doctor.doctor_id, doctor.doctor_name);
                  const fallbackColor = getFallbackColor(doctor.doctor_id);
                  const hasError = avatarErrors[doctor.doctor_id];

                  return (
                    <motion.tr
                      key={doctor.doctor_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-bg transition-colors"
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            {!hasError ? (
                              <img
                                src={avatarUrl}
                                alt={doctor.doctor_name}
                                className="w-full h-full object-cover"
                                onError={() => handleAvatarError(doctor.doctor_id)}
                                loading="lazy"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: fallbackColor }}
                              >
                                {getInitials(doctor.doctor_name)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-text dark:text-dark-text truncate">{doctor.doctor_name}</p>
                            <p className="text-xs text-muted dark:text-dark-muted">ID: #{String(doctor.doctor_id).slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="text-text dark:text-dark-text">{doctor.specialization}</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="text-text dark:text-dark-text">{doctor.experience || '-'} years</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <StatusChip status={doctor.is_active ? 'Active' : 'Inactive'} />
                      </td>
                      <td className="px-4 py-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleView(doctor)}
                            className="p-1.5 rounded-lg bg-info/10 text-info hover:bg-info hover:text-white transition-all duration-200 group"
                            title="View Doctor Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="p-1.5 rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200 group"
                            title="Edit Doctor"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.doctor_id)}
                            className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all duration-200 group"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </FrostedCard>

      <DoctorForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDoctor(null);
        }}
        doctor={editingDoctor}
      />

      <DoctorDetails
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingDoctor(null);
        }}
        doctor={viewingDoctor}
      />
    </PageTransition>
  );
}