import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import MovieCard from './MovieCard'
import { movieService } from '../services'

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-500' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'bg-pink-500' },
  { id: 'thriller', label: 'Thriller', emoji: '😨', color: 'bg-red-500' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', color: 'bg-green-500' }
]

export default function MainFeature() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const handleMoodSelect = async (moodId) => {
    setSelectedMood(moodId)
    setLoading(true)
    
    try {
      const movies = await movieService.getMoviesByMood(moodId)
      setRecommendations(movies.slice(0, 4)) // Show top 4 recommendations
    } catch (err) {
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-heading text-accent mb-4">
          How are you feeling tonight?
        </h2>
        <p className="text-accent/80">
          Select your mood and discover the perfect movie
        </p>
      </motion.div>

      {/* Mood Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 0 20px ${mood.color.replace('bg-', 'rgba(').replace('-500', ', 0.3)')}`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(mood.id)}
            className={`p-6 rounded-lg transition-all duration-200 ${
              selectedMood === mood.id
                ? `${mood.color} shadow-lg`
                : 'bg-card hover:bg-secondary'
            }`}
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className={`font-medium ${
              selectedMood === mood.id ? 'text-white' : 'text-accent'
            }`}>
              {mood.label}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Recommendations */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-poster bg-secondary animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-accent">
            Perfect for your {moods.find(m => m.id === selectedMood)?.label.toLowerCase()} mood
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}