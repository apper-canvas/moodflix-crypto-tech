import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import MoodSelector from '@/components/organisms/MoodSelector';
import MovieGrid from '@/components/organisms/MovieGrid';
import MovieDetailModal from '@/components/organisms/MovieDetailModal';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import { movieService } from '@/services';

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-500' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-500' },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-purple-500' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'bg-pink-500' },
  { id: 'thriller', label: 'Thriller', emoji: '😨', color: 'bg-red-500' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', color: 'bg-green-500' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', color: 'bg-orange-500' },
  { id: 'mystery', label: 'Mystery', emoji: '🔍', color: 'bg-indigo-500' }
];

const DiscoverPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (selectedMood || searchQuery) {
      loadMovies();
    }
  }, [selectedMood, searchQuery]);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (searchQuery) {
        result = await movieService.searchMovies(searchQuery);
      } else if (selectedMood) {
        result = await movieService.getMoviesByMood(selectedMood);
      }
      setMovies(result || []);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedMood(null);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleClearFilters = () => {
    setSelectedMood(null);
    setSearchQuery('');
    setMovies([]); // Clear movies when filters are cleared
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading text-accent mb-4">
          Discover Movies
        </h1>
        <p className="text-accent/80">
          Find the perfect movie for your current mood or search for specific titles
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar 
        value={searchQuery} 
        onChange={(e) => handleSearch(e.target.value)} 
        placeholder="Search movies..."
        className="mb-8"
      />

      {/* Mood Selector */}
      <MoodSelector
        moods={moods}
        selectedMood={selectedMood}
        onMoodSelect={handleMoodSelect}
      />

      {/* Results Section */}
      <div>
        {loading && <SkeletonLoader count={8} type="movie-grid" />}
        
        {error && (
          <ErrorState 
            message={error}
            onRetry={loadMovies}
          />
        )}

        {!loading && !error && movies.length === 0 && (selectedMood || searchQuery) && (
          <EmptyState
            icon="Film"
            title="No movies found"
            description={searchQuery ? "Try a different search term" : "Try selecting a different mood"}
            actionLabel="Clear filters"
            onAction={handleClearFilters}
          />
        )}

        {!loading && !error && movies.length === 0 && !selectedMood && !searchQuery && (
          <EmptyState
            icon="Search"
            title="Ready to discover?"
            description="Select a mood or search for movies to get started"
            actionLabel="Pick a mood"
            onAction={() => handleMoodSelect('happy')}
          />
        )}

        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
        )}
      </div>

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

export default DiscoverPage;