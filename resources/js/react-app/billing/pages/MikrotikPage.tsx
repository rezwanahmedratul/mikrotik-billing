import React from 'react';
import { motion } from 'framer-motion';
import MikrotikControlDashboard from '../MikrotikControlDashboard';

export default function MikrotikPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      <MikrotikControlDashboard initialData={{}} />
    </motion.div>
  );
}
