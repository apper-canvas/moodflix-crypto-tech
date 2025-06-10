import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

export default function ErrorState({ 
  message = 'Something went wrong', 
  onRetry 
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <ApperIcon 
          name="AlertTriangle" 
          className="w-20 h-20 text-error mx-auto" 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-accent mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-accent/70 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}