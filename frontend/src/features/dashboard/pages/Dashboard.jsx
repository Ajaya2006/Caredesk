import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../../../api/dashboard';
import { StatCard, FrostedCard } from '../../../Components/ui';
import { PageTransition } from '../../../Components/animations/PageTransition';
import { Stethoscope, Users, Calendar, Clock, CheckCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardSummary,
  });

  const stats = [
    { label: 'Total Doctors', value: data?.totalDoctors || 0, icon: Stethoscope, color: 'primary' },
    { label: 'Total Patients', value: data?.totalPatients || 0, icon: Users, color: 'secondary' },
    { label: "Today's Appointments", value: data?.todayAppointments || 0, icon: Calendar, color: 'info' },
    { label: 'Pending', value: data?.pending || 0, icon: Clock, color: 'warning' },
    { label: 'Confirmed', value: data?.confirmed || 0, icon: CheckCircle, color: 'success' },
  ];

  return (
    <PageTransition>
      {/* Hero with Frosted Effect */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 hero-frosted" />
        <div className="absolute inset-0 bg-[url('/illustrations/dashboard-hero.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text dark:text-dark-text">Dashboard</h1>
            <p className="text-muted dark:text-dark-muted">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted dark:text-dark-muted">{new Date().toLocaleDateString()}</span>
            <button className="p-2 rounded-xl bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors">
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={isLoading} delay={idx * 0.05} />
        ))}
      </div>

      {/* Recent Activity & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FrostedCard>
          <h3 className="text-lg font-heading font-semibold text-text dark:text-dark-text mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-background dark:hover:bg-dark-bg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text dark:text-dark-text">New appointment booked</p>
                  <p className="text-xs text-muted dark:text-dark-muted">Dr. Sarah Johnson • Patient: John Doe</p>
                </div>
                <span className="text-xs text-muted dark:text-dark-muted">2 min ago</span>
              </motion.div>
            ))}
          </div>
        </FrostedCard>

        <FrostedCard>
          <h3 className="text-lg font-heading font-semibold text-text dark:text-dark-text mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx + 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-background dark:hover:bg-dark-bg transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-500">2:30</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text dark:text-dark-text">Emily Wilson</p>
                  <p className="text-xs text-muted dark:text-dark-muted">Dr. Michael Chen • Check-up</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">Pending</span>
              </motion.div>
            ))}
          </div>
        </FrostedCard>
      </div>
    </PageTransition>
  );
}