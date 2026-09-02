// frontend/src/features/patients/pages/Patients.jsx

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getPatients, deletePatient } from '../../../api/patients';
import {
  Button,
  StatusChip,
  EmptyState,
  FrostedCard,
  Input,
  Select
} from '../../../Components/ui';
import { PageTransition } from '../../../Components/animations/PageTransition';
import { PatientForm } from '../components/PatientForm';
import { PatientDetails } from '../components/PatientDetails';
import { Plus, Pencil, Trash2, Users, Phone, Mail, MapPin, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getAvatar, getFallbackColor, preloadAvatars } from '../../../lib/avatarService';

export default function Patients() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [avatarErrors, setAvatarErrors] = useState({});

  // Fetch patients from API
  const { data: patients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: 1000 * 60,
    retry: 2,
  });

  // Preload avatars when patients load
  useEffect(() => {
    if (patients.length > 0) {
      preloadAvatars(patients, 'patient');
    }
  }, [patients]);

  // Log data for debugging
  useEffect(() => {
    console.log('📋 Patients data from API:', patients);
  }, [patients]);

  // Show error if API fails
  useEffect(() => {
    if (error) {
      console.error('❌ Error fetching patients:', error);
      toast.error('Failed to load patients. Please refresh the page.');
    }
  }, [error]);

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      toast.success('Patient deleted successfully');
      refetch();
    },
    onError: (error) => {
      console.error('❌ Delete error:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete patient');
    },
  });

  // Filter patients by search term
  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      patient.patient_name?.toLowerCase().includes(search) ||
      patient.phone?.includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.address?.toLowerCase().includes(search)
    );
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleView = (patient) => {
    setViewingPatient(patient);
    setIsDetailsOpen(true);
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  // Calculate stats from real data
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.is_active !== false).length;
  const malePatients = patients.filter(p => p.gender?.toLowerCase() === 'male').length;
  const femalePatients = patients.filter(p => p.gender?.toLowerCase() === 'female').length;

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAvatarError = (patientId) => {
    setAvatarErrors(prev => ({ ...prev, [patientId]: true }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#234EC8] mx-auto"></div>
            <p className="mt-4 text-muted dark:text-dark-muted">Loading patients...</p>
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
            backgroundImage: `url(${import.meta.env.BASE_URL}illustrations/patients-hero.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text dark:text-dark-text">Patients</h1>
            <p className="text-muted dark:text-dark-muted">Manage patient records and medical history</p>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Patients', value: totalPatients, icon: Users, color: 'primary' },
          { label: 'Active', value: activePatients, icon: Users, color: 'success' },
          { label: 'Male', value: malePatients, icon: Users, color: 'info' },
          { label: 'Female', value: femalePatients, icon: Users, color: 'secondary' },
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
            placeholder="Search patients by name, phone, or email..."
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[22%]">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[30%]">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[10%]">Age</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[12%]">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[12%]">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted dark:text-dark-muted uppercase tracking-wider w-[14%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#234EC8]" />
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8">
                    <EmptyState
                      title={searchTerm ? 'No matching patients found' : 'No patients registered'}
                      description={searchTerm ? 'Try adjusting your search terms' : 'Register your first patient to get started.'}
                      actionLabel="Add Patient"
                      onAction={handleAdd}
                      illustration="empty-patients"
                    />
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => {
                  const avatarUrl = getAvatar(patient.patient_id, patient.patient_name, 'patient');
                  const fallbackColor = getFallbackColor(patient.patient_id);
                  const hasError = avatarErrors[patient.patient_id];

                  return (
                    <motion.tr
                      key={patient.patient_id}
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
                                alt={patient.patient_name}
                                className="w-full h-full object-cover"
                                onError={() => handleAvatarError(patient.patient_id)}
                                loading="lazy"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: fallbackColor }}
                              >
                                {getInitials(patient.patient_name)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-text dark:text-dark-text truncate">{patient.patient_name}</p>
                            <p className="text-xs text-muted dark:text-dark-muted">ID: #{String(patient.patient_id).slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <div className="space-y-1">
                          {patient.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-muted dark:text-dark-muted flex-shrink-0" />
                              <span className="text-text dark:text-dark-text truncate">{patient.phone}</span>
                            </div>
                          )}
                          {patient.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3.5 h-3.5 text-muted dark:text-dark-muted flex-shrink-0" />
                              <span className="text-muted dark:text-dark-muted truncate max-w-[120px]">{patient.email}</span>
                            </div>
                          )}
                          {patient.address && (
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-muted dark:text-dark-muted flex-shrink-0" />
                              <span className="text-muted dark:text-dark-muted truncate max-w-[120px]">{patient.address}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-numbers font-bold text-text dark:text-dark-text">
                            {patient.age || '—'}
                          </span>
                          {patient.age && <span className="text-sm text-muted dark:text-dark-muted">yrs</span>}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span className="text-sm capitalize text-text dark:text-dark-text">{patient.gender || '—'}</span>
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <StatusChip status={patient.is_active !== false ? 'Active' : 'Inactive'} />
                      </td>

                      <td className="px-4 py-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleView(patient)}
                            className="p-1.5 rounded-lg bg-info/10 text-info hover:bg-info hover:text-white transition-all duration-200 group"
                            title="View Patient Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(patient)}
                            className="p-1.5 rounded-lg bg-[#234EC8]/10 text-[#234EC8] hover:bg-[#234EC8] hover:text-white transition-all duration-200 group"
                            title="Edit Patient"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient.patient_id)}
                            className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all duration-200 group"
                            title="Delete Patient"
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

      <PatientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPatient(null);
        }}
        patient={editingPatient}
      />

      <PatientDetails
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingPatient(null);
        }}
        patient={viewingPatient}
      />
    </PageTransition>
  );
}