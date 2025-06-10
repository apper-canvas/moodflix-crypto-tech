import { motion } from 'framer-motion'
import { useState } from 'react'
import ApperIcon from './ApperIcon'
import { watchlistService } from '../services'
import { toast } from 'react-toastify'

export default function MovieDetailModal({ movie, onClose }) {
  const [isInWatchlist, setIsInWatchlist] = useState(movie.isInWatchlist)
  const [loading, setLoading] = useState(false)

  const handleWatchlistToggle = async () => {
    setLoading(true)
    
    try {
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(movie.id)
        setIsInWatchlist(false)
        toast.success('Removed from watchlist')
      } else {
        await watchlistService.addToWatchlist(movie.id)
        setIsInWatchlist(true)
        toast.success('Added to watchlist')
      }
    } catch (err) {
      toast.error('Failed to update watchlist')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating / 2)
    const hasHalfStar = rating % 2 >= 1
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <ApperIcon 
            key={i} 
            name="Star" 
            className="w-5 h-5 text-yellow-400 fill-current" 
          />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <ApperIcon 
            key={i} 
            name="StarHalf" 
            className="w-5 h-5 text-yellow-400 fill-current" 
          />
        )
      } else {
        stars.push(
          <ApperIcon 
            key={i} 
            name="Star" 
            className="w-5 h-5 text-gray-400" 
          />
        )
      }
    }
    return stars
  }

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <div className="md:flex">
            {/* Poster */}
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto object-cover md:rounded-l-lg"
              />
            </div>

            {/* Content */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-2xl md:text-3xl font-heading text-accent mb-2">
                {movie.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(movie.rating)}
                  <span className="text-accent/80 ml-2">
                    {movie.rating.toFixed(1)}/10
                  </span>
                </div>
                <span className="text-accent/60">•</span>
                <span className="text-accent/80">{movie.year}</span>
                <span className="text-accent/60">•</span>
                <span className="text-accent/80">{formatRuntime(movie.runtime)}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-accent/80 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-accent/80 leading-relaxed mb-6">
                {movie.synopsis}
              </p>

              {/* Trailer */}
              {movie.trailerUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-accent mb-3">Trailer</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={movie.trailerUrl}
                      title={`${movie.title} Trailer`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWatchlistToggle}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isInWatchlist
                      ? 'bg-success text-white hover:bg-success/90'
                      : 'bg-primary text-white hover:bg-primary/90'
                  } ${loading ? 'opacity-50' : ''}`}
                >
                  <ApperIcon 
                    name={isInWatchlist ? "BookmarkCheck" : "Bookmark"} 
                    size={16} 
                  />
                  <span>
                    {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </span>
                </motion.button>

                {movie.trailerUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const trailerElement = document.querySelector('iframe')
                      if (trailerElement) {
                        trailerElement.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-card border border-secondary text-accent rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    <ApperIcon name="Play" size={16} />
                    <span>Watch Trailer</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}