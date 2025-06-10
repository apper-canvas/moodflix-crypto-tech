import { motion } from 'framer-motion';
import React from 'react';

const SkeletonLoader = ({ count = 3, type = 'default' }) => {
  if (type === 'movie-grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg overflow-hidden shadow-movie-card"
          >
            <div className="aspect-poster bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse" />
            <div className="p-3 md:hidden space-y-2">
              <div className="h-4 bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse rounded" />
              <div className="h-3 bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse rounded w-2/3" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'movie-night') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg overflow-hidden shadow-movie-card"
          >
            <div className="h-48 bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse rounded w-2/3" />
                <div className="h-3 bg-gradient-to-r from-secondary via-surface-300 to-secondary animate-pulse rounded w-1/2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-lg p-6 shadow-movie-card"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gradient-to-r from-secondary via-surface-300 to-secondary rounded w-3/4" />
            <div className="h-4 bg-gradient-to-r from-secondary via-surface-300 to-secondary rounded w-1/2" />
            <div className="h-4 bg-gradient-to-r from-secondary via-surface-300 to-secondary rounded w-2/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;