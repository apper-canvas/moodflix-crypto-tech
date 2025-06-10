import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MovieCard from '../components/MovieCard'
import MovieDetailModal from '../components/MovieDetailModal'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { watchlistService } from '../services'
import { useNavigate } from 'react-router-dom'

export default function Watchlist() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await watchlistService.getWatchlistMovies()
      setMovies(result)
    } catch (err) {
      setError(err.message || 'Failed to load watchlist')
      toast.error('Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistService.removeFromWatchlist(movieId)
      setMovies(movies.filter(movie => movie.id !== movieId))
      toast.success('Removed from watchlist')
    } catch (err) {
      toast.error('Failed to remove from watchlist')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading text-accent mb-4">
            My Watchlist
          </h1>
        </div>
        <SkeletonLoader count={8} type="movie-grid" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading text-accent mb-4">
            My Watchlist
          </h1>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadWatchlist}
        />
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading text-accent mb-4">
            My Watchlist
          </h1>
        </div>
        <EmptyState
          icon="Bookmark"
          title="Your watchlist is empty"
          description="Start adding movies you want to watch later"
          actionLabel="Discover Movies"
          onAction={() => navigate('/discover')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-accent mb-2">
            My Watchlist
          </h1>
          <p className="text-accent/80">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/discover')}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Movies</span>
        </motion.button>
      </div>

      {/* Movie Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <MovieCard 
              movie={movie} 
              onClick={() => handleMovieClick(movie)}
              showRemoveButton
              onRemove={() => handleRemoveFromWatchlist(movie.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}