import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import MovieCard from './MovieCard'
import { movieService } from '../services'

export default function CreateMovieNightModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [selectedMovies, setSelectedMovies] = useState([])
  const [availableMovies, setAvailableMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    setLoading(true)
    try {
      const result = await movieService.getAll()
      setAvailableMovies(result)
    } catch (err) {
      toast.error('Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  const filteredMovies = availableMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMovieToggle = (movie) => {
    setSelectedMovies(prev => {
      const isSelected = prev.some(m => m.id === movie.id)
      if (isSelected) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, movie]
      }
    })
  }

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error('Please enter a name for your movie night')
      return
    }
    setStep(2)
  }

  const handleCreate = () => {
    if (selectedMovies.length === 0) {
      toast.error('Please select at least one movie')
      return
    }

    const movieNightData = {
      name: name.trim(),
      movieIds: selectedMovies.map(m => m.id)
    }

    onCreate(movieNightData)
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
        <div className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary">
            <div>
              <h2 className="text-2xl font-heading text-accent">
                Create Movie Night
              </h2>
              <p className="text-accent/70">
                Step {step} of 2: {step === 1 ? 'Name your collection' : 'Select movies'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-accent/50 hover:text-accent transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-accent font-medium mb-2">
                      Movie Night Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Action Movie Marathon, Rom-Com Night..."
                      className="w-full px-4 py-3 bg-background border border-secondary rounded-lg text-accent placeholder-accent/50 focus:border-primary focus:outline-none transition-colors"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="px-6 py-3 bg-card border border-secondary text-accent rounded-lg font-medium hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Search */}
                  <div className="relative">
                    <ApperIcon 
                      name="Search" 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/50 w-5 h-5" 
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="w-full pl-10 pr-4 py-3 bg-background border border-secondary rounded-lg text-accent placeholder-accent/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Selected Movies */}
                  {selectedMovies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-accent mb-3">
                        Selected Movies ({selectedMovies.length})
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedMovies.map(movie => (
                          <motion.div
                            key={movie.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full"
                          >
                            <span className="text-sm">{movie.title}</span>
                            <button
                              onClick={() => handleMovieToggle(movie)}
                              className="hover:bg-primary/20 rounded-full p-1"
                            >
                              <ApperIcon name="X" size={12} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Movies */}
                  <div className="max-h-96 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-accent mb-3">
                      Available Movies
                    </h3>
                    {loading ? (
                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="aspect-poster bg-secondary animate-pulse rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {filteredMovies.map(movie => {
                          const isSelected = selectedMovies.some(m => m.id === movie.id)
                          return (
                            <motion.div
                              key={movie.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMovieToggle(movie)}
                              className={`cursor-pointer relative rounded-lg overflow-hidden ${
                                isSelected ? 'ring-2 ring-primary' : ''
                              }`}
                            >
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full aspect-poster object-cover"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <div className="bg-primary text-white rounded-full p-1">
                                    <ApperIcon name="Check" size={16} />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-card border border-secondary text-accent rounded-lg font-medium hover:bg-secondary transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreate}
                      disabled={selectedMovies.length === 0}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Movie Night
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}