import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import MovieGrid from '@/components/organisms/MovieGrid';
import MovieDetailModal from '@/components/organisms/MovieDetailModal';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/organisms/PageHeader';
import Button from '@/components/atoms/Button';
import { watchlistService } from '@/services';

const WatchlistPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await watchlistService.getWatchlistMovies();
      setMovies(result);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistService.removeFromWatchlist(movieId);
      setMovies(movies.filter(movie => movie.id !== movieId));
      toast.success('Removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove from watchlist');
    }
  };

  const addMoviesButton = (
    <Button
      onClick={() => navigate('/discover')}
      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ApperIcon name="Plus" size={16} />
      <span>Add Movies</span>
    </Button>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader title="My Watchlist" />
        <SkeletonLoader count={8} type="movie-grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader title="My Watchlist" />
        <ErrorState 
          message={error}
          onRetry={loadWatchlist}
        />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader title="My Watchlist" />
        <EmptyState
          icon="Bookmark"
          title="Your watchlist is empty"
          description="Start adding movies you want to watch later"
          actionLabel="Discover Movies"
          onAction={() => navigate('/discover')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <PageHeader 
        title="My Watchlist" 
        description={`${movies.length} movie${movies.length !== 1 ? 's' : ''} saved for later`}
        actions={addMoviesButton}
      />

{/* Movie Grid */}
      <MovieGrid 
        movies={movies} 
        onMovieClick={handleMovieClick} 
        showRemoveButton={true} 
        onRemove={(movieId) => handleRemoveFromWatchlist(movieId)}
      />

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WatchlistPage;