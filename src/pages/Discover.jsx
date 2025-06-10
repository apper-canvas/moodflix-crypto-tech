import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MovieCard from '../components/MovieCard'
import MovieDetailModal from '../components/MovieDetailModal'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { movieService } from '../services'

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-500' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-500' },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-purple-500' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'bg-pink-500' },
  { id: 'thriller', label: 'Thriller', emoji: '😨', color: 'bg-red-500' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', color: 'bg-green-500' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', color: 'bg-orange-500' },
  { id: 'mystery', label: 'Mystery', emoji: '🔍', color: 'bg-indigo-500' }
]

export default function Discover() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    if (selectedMood || searchQuery) {
      loadMovies()
    }
  }, [selectedMood, searchQuery])

  const loadMovies = async () => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (searchQuery) {
        result = await movieService.searchMovies(searchQuery)
      } else if (selectedMood) {
        result = await movieService.getMoviesByMood(selectedMood)
      }
      setMovies(result || [])
    } catch (err) {
      setError(err.message || 'Failed to load movies')
      toast.error('Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId)
    setSearchQuery('')
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setSelectedMood(null)
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

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
      <div className="mb-8">
        <div className="relative max-w-md">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/50 w-5 h-5" 
          />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-secondary rounded-lg text-accent placeholder-accent/50 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Mood Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-accent mb-4">How are you feeling?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 20px ${mood.color.replace('bg-', 'rgba(').replace('-500', ', 0.3)')}`
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood.id)}
              className={`p-4 rounded-lg transition-all duration-200 text-center ${
                selectedMood === mood.id
                  ? `${mood.color} shadow-lg`
                  : 'bg-card hover:bg-secondary'
              }`}
            >
              <div className="text-2xl mb-2">{mood.emoji}</div>
              <div className={`text-sm font-medium ${
                selectedMood === mood.id ? 'text-white' : 'text-accent'
              }`}>
                {mood.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

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
            onAction={() => {
              setSelectedMood(null)
              setSearchQuery('')
            }}
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
              >
                <MovieCard 
                  movie={movie} 
                  onClick={() => handleMovieClick(movie)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

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