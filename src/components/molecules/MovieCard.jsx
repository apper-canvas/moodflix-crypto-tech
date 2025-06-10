import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { watchlistService } from '@/services';
import { toast } from 'react-toastify';

const MovieCard = ({ movie, onClick, showRemoveButton, onRemove }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(movie.isInWatchlist);
  const [loading, setLoading] = useState(false);

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(movie.id);
        setIsInWatchlist(false);
        toast.success('Removed from watchlist');
        if (onRemove) onRemove();
      } else {
        await watchlistService.addToWatchlist(movie.id);
        setIsInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      toast.error('Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <ApperIcon 
            key={i} 
            name="Star" 
            className="w-3 h-3 text-yellow-400 fill-current" 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <ApperIcon 
            key={i} 
            name="StarHalf" 
            className="w-3 h-3 text-yellow-400 fill-current" 
          />
        );
      } else {
        stars.push(
          <ApperIcon 
            key={i} 
            name="Star" 
            className="w-3 h-3 text-gray-400" 
          />
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-lg shadow-movie-card hover:shadow-movie-card-hover transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      <div className="relative aspect-poster">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(movie.rating)}
              <span className="text-white/80 text-xs ml-1">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Watchlist button */}
        {!showRemoveButton && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWatchlistToggle}
            disabled={loading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isInWatchlist 
                ? 'bg-primary text-white' 
                : 'bg-black/50 text-white hover:bg-primary'
            } ${loading ? 'opacity-50' : ''}`}
          >
            <ApperIcon 
              name={isInWatchlist ? "BookmarkCheck" : "Bookmark"} 
              size={14} 
            />
          </motion.button>
        )}

        {/* Remove button for watchlist */}
        {showRemoveButton && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWatchlistToggle}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <ApperIcon name="X" size={14} />
          </motion.button>
        )}
      </div>

      {/* Movie info (visible on mobile) */}
      <div className="p-3 md:hidden">
        <h3 className="text-accent font-semibold text-sm line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(movie.rating)}
          </div>
          <span className="text-accent/70 text-xs">{movie.year}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;