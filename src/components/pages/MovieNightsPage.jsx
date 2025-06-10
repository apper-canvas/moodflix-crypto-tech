import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MovieNightCard from '@/components/molecules/MovieNightCard';
import CreateMovieNightModal from '@/components/organisms/CreateMovieNightModal';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/organisms/PageHeader';
import Button from '@/components/atoms/Button';
import { movieNightService } from '@/services';

const MovieNightsPage = () => {
  const [movieNights, setMovieNights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMovieNights();
  }, []);

  const loadMovieNights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await movieNightService.getAll();
      setMovieNights(result);
    } catch (err) {
      setError(err.message || 'Failed to load movie nights');
      toast.error('Failed to load movie nights');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovieNight = async (movieNightData) => {
    try {
      const newMovieNight = await movieNightService.create(movieNightData);
      setMovieNights([newMovieNight, ...movieNights]);
      setShowCreateModal(false);
      toast.success('Movie night created successfully!');
    } catch (err) {
      toast.error('Failed to create movie night');
    }
  };

  const handleDeleteMovieNight = async (id) => {
    try {
      await movieNightService.delete(id);
      setMovieNights(movieNights.filter(night => night.id !== id));
      toast.success('Movie night deleted');
    } catch (err) {
      toast.error('Failed to delete movie night');
    }
  };

  const handleShareMovieNight = (movieNight) => {
    const shareUrl = `${window.location.origin}/movie-nights/${movieNight.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const createButton = (
    <Button
      onClick={() => setShowCreateModal(true)}
      className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ApperIcon name="Plus" size={16} />
      <span>Create Movie Night</span>
    </Button>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader title="Movie Nights" />
        <SkeletonLoader count={4} type="movie-night" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader title="Movie Nights" />
        <ErrorState 
          message={error}
          onRetry={loadMovieNights}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <PageHeader 
        title="Movie Nights" 
        description="Create themed collections to share with friends" 
        actions={createButton} 
      />

      {/* Movie Nights List */}
      {movieNights.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No movie nights yet"
          description="Create your first themed movie collection to share with friends"
          actionLabel="Create Movie Night"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {movieNights.map((movieNight, index) => (
            <motion.div
              key={movieNight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MovieNightCard
                movieNight={movieNight}
                onShare={() => handleShareMovieNight(movieNight)}
                onDelete={() => handleDeleteMovieNight(movieNight.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Movie Night Modal */}
      {showCreateModal && (
        <CreateMovieNightModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMovieNight}
        />
      )}
    </div>
  );
};

export default MovieNightsPage;