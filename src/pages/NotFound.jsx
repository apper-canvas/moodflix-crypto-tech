import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="mb-8"
        >
          <ApperIcon name="FilmX" className="w-24 h-24 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-heading text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-accent mb-4">
          Scene Not Found
        </h2>
        <p className="text-accent/70 mb-8 max-w-md mx-auto">
          Looks like this page went missing from our film reel. 
          Let's get you back to the main feature.
        </p>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/discover')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors mx-2"
          >
            Discover Movies
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-card hover:bg-secondary text-accent px-6 py-3 rounded-lg font-medium transition-colors mx-2"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}