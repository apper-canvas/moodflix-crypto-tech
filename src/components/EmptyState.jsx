import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

export default function EmptyState({ 
  icon = 'Inbox', 
  title = 'Nothing here yet', 
  description = 'Get started by adding some content',
  actionLabel,
  onAction 
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
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <ApperIcon 
          name={icon} 
          className="w-20 h-20 text-accent/30 mx-auto" 
        />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-accent mb-2">
        {title}
      </h3>
      <p className="text-accent/70 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}