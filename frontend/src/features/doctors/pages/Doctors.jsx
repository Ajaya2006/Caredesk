// frontend/src/features/doctors/pages/Doctors.jsx

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getDoctors, deleteDoctor } from '../../../api/doctors';
import {
  Button,
  StatusChip,
  EmptyState,
  FrostedCard,
  Input,
  Select
} from '../../../Components/ui';
import { PageTransition } from '../../../Components/animations/PageTransition';
import { DoctorForm } from '../components/DoctorForm';
import { DoctorDetails } from '../components/DoctorDetails';
import { Plus, Pencil, Trash2, Stethoscope, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAvatar, getFallbackColor, preloadAvatars } from '../../../lib/avatarService';

export default function Doctors() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [avatarErrors, setAvatarErrors] = useState({});

  // Fetch doctors from API
  const { data: doctors = [], isLoading, error, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    staleTime: 1000 * 60,
    retry: 2,
  });

  // Preload avatars when doctors load
  useEffect(() => {
    if (doctors.length > 0) {
      preloadAvatars(doctors, 'doctor');
    }
  }, [doctors]);

  // Log data for debugging
  useEffect(() => {
    console.log('📋 Doctors data from API:', doctors);
  }, [doctors]);

  // Show error if API fails
  useEffect(() => {
    if (error) {
      console.error('❌ Error fetching doctors:', error);
      toast.error('Failed to load doctors. Please refresh the page.');
    }
  }, [error]);

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
      toast.success('Doctor deleted successfully');
      refetch();
    },
    onError: (error) => {
      console.error('❌ Delete error:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete doctor');
    },
  });

  // Filter doctors by search term
  const filteredDoctors = doctors.filter((doctor) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      doctor.doctor_name?.toLowerCase().includes(search) ||
      doctor.specialization?.toLowerCase().includes(search) ||
      doctor.phone?.includes(search)
    );
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

  // Calculate stats from real data
  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter(d => d.is_active !== false).length;
  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const getInitials = (name) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAvatarError = (doctorId) => {
    setAvatarErrors(prev => ({ ...prev, [doctorId]: true }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#234EC8] mx-auto"></div>
            <p className="mt-4 text-muted dark:text-dark-muted">Loading doctors...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 hero-frosted" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}illustrations/doctors-hero.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Doctors', value: totalDoctors, icon: Stethoscope, color: 'primary' },
          { label: 'Active', value: activeDoctors, icon: Stethoscope, color: 'success' },
          { label: 'Specializations', value: specializations.length, icon: Stethoscope, color: 'info' },
          { label: 'Departments', value: specializations.length > 0 ? Math.ceil(specializations.length / 2) : 0, icon: Stethoscope, color: 'secondary' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/70 dark:bg-dark-surface/70 backdrop-blur-md rounded-2xl border border-white/30 dark:border-dark-border/30 shadow-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted dark:text-dark-muted">{stat.label}</p>
                <p className="text-2xl font-numbers font-bold text-text dark:text-dark-text">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted dark:text-dark-muted" />
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 rounded-xl border border-input bg-surface dark:bg-dark-surface pl-10 pr-4 text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:ring-2 focus:ring-[#234EC8]/50 focus:border-[#234EC8] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <FrostedCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background dark:bg-dark-bg border-b border-border dark:border-dark-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[28%]">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[22%]">Specialization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[15%]">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[15%]">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#234EC8]" />
                    </div>
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8">
                    <EmptyState
                      title={searchTerm ? 'No matching doctors found' : 'No doctors added yet'}
                      description={searchTerm ? 'Try adjusting your search terms' : 'Add your first doctor to get started.'}
                      actionLabel="Add Doctor"
                      onAction={handleAdd}
                      illustration="empty-doctors"
                    />
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor, index) => {
                  const avatarUrl = getAvatar(doctor.doctor_id, doctor.doctor_name, 'doctor');
                  const fallbackColor = getFallbackColor(doctor.doctor_id);
                  const hasError = avatarErrors[doctor.doctor_id];

                  return (
                    <motion.tr
                      key={doctor.doctor_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-t border-border dark:border-dark-border hover:bg-background dark:hover:bg-dark-bg transition-colors"
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
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
                          <div className="min-w-0 flex-1">
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
                            className="p-1.5 rounded-lg bg-[#234EC8]/10 text-[#234EC8] hover:bg-[#234EC8] hover:text-white transition-all duration-200 group"
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