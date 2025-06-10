import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { movieService } from '@/services';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';

const MovieNightCard = ({ movieNight, onShare, onEdit, onDelete }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, [movieNight.movieIds]);

  const loadMovies = async () => {
    try {
      const moviePromises = movieNight.movieIds.map(id => movieService.getById(id));
      const movieResults = await Promise.all(moviePromises);
      setMovies(movieResults.filter(Boolean));
    } catch (err) {
      console.error('Failed to load movies for movie night:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRuntime = movies.reduce((total, movie) => total + (movie.runtime || 0), 0);
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-lg shadow-movie-card hover:shadow-movie-card-hover transition-all duration-200 overflow-hidden"
    >
{/* Movie Posters Preview */}
      <div className="relative h-48 bg-secondary">
        {!loading && movies.length > 0 ? (
          <div className="flex h-full">
            {movies.slice(0, 3).map((movie, index) => (
              <div
                key={movie.id}
                className={`relative flex-1 ${index > 0 ? 'border-l border-background/20' : ''}`}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <ApperIcon name="Film" className="w-8 h-8 text-accent/30" />
                  </div>
                )}
                {index === 2 && movies.length > 3 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{movies.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <ApperIcon name="Film" className="w-12 h-12 text-accent/30" />
          </div>
        )}
        {/* Actions */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            onClick={onShare}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-primary"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Share2" size={14} />
          </Button>
          <Button
            onClick={onDelete}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-red-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-accent mb-2 line-clamp-1">
          {movieNight.name}
        </h3>
        
        <div className="space-y-2 text-sm text-accent/70">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Film" size={16} />
            <span>{movies.length} movie{movies.length !== 1 ? 's' : ''}</span>
          </div>
          
          {totalRuntime > 0 && (
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" size={16} />
              <span>{formatRuntime(totalRuntime)}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={16} />
            <span>{format(new Date(movieNight.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Movie Titles */}
        {movies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-secondary">
            <div className="space-y-1">
              {movies.slice(0, 2).map(movie => (
                <div key={movie.id} className="text-sm text-accent/80 line-clamp-1">
                  {movie.title}
                </div>
              ))}
              {movies.length > 2 && (
                <div className="text-sm text-accent/60">
                  and {movies.length - 2} more...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieNightCard;