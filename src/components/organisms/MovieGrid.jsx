import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from '@/components/molecules/MovieCard';

const MovieGrid = ({ movies, onMovieClick, showRemoveButton = false, onRemove }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative group"
        >
          <MovieCard 
            movie={movie} 
            onClick={() => onMovieClick(movie)}
            showRemoveButton={showRemoveButton}
            onRemove={() => onRemove(movie.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MovieGrid;