import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import QuickActionsSection from '@/components/organisms/QuickActionsSection';
import Button from '@/components/atoms/Button';
import MainFeatureSection from '@/components/organisms/MainFeatureSection';

const HomePage = () => {
  const navigate = useNavigate();

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
  ];

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
      <QuickActionsSection actions={quickActions} />

      {/* Main Feature / Mood Selector */}
      <div className="mb-12">
        <MainFeatureSection />
      </div>

      {/* Get Started */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={() => navigate('/discover')}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Discovering Movies
        </Button>
      </motion.div>
    </div>
  );
};

export default HomePage;