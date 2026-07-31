import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

const easeOut = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1],
};

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background dark:bg-dark-bg">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={closeMobileMenu} 
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMobileMenuClick={toggleMobileMenu} />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={easeOut}
          className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}