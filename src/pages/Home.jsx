import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

export default function Home() {
  const navigate = useNavigate()

  const quickActions = [
    {
      title: "Discover Movies",
      description: "Find perfect movies for your mood",
      icon: "Search",
      action: () => navigate('/discover'),
      color: "bg-primary"
    },
    {
      title: "My Watchlist",
      description: "Movies saved for later",
      icon: "Bookmark",
      action: () => navigate('/watchlist'),
      color: "bg-info"
    },
    {
      title: "Movie Nights",
      description: "Create themed collections",
      icon: "Users",
      action: () => navigate('/movie-nights'),
      color: "bg-success"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="inline-block mb-6"
        >
          <ApperIcon name="Film" className="w-20 h-20 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-heading text-accent mb-4">
          Welcome to <span className="text-primary">MOODFLIX</span>
        </h1>
        <p className="text-lg md:text-xl text-accent/80 max-w-2xl mx-auto">
          Discover the perfect movie for any mood. From thrilling adventures to heartwarming comedies, 
          find your next favorite film in seconds.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 24px rgba(229, 9, 20, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className="bg-card p-6 rounded-lg shadow-movie-card hover:shadow-movie-card-hover transition-all duration-200 text-left group"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-accent mb-2">{action.title}</h3>
            <p className="text-accent/70">{action.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Get Started */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/discover')}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg transition-all duration-200"
        >
          Start Discovering Movies
        </motion.button>
      </motion.div>
    </div>
  )
}