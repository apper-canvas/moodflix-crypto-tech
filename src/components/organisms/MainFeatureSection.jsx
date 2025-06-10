import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MovieCard from '@/components/molecules/MovieCard';
import MoodButton from '@/components/molecules/MoodButton';
import { movieService } from '@/services';

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-500' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'bg-pink-500' },
  { id: 'thriller', label: 'Thriller', emoji: '😨', color: 'bg-red-500' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', color: 'bg-green-500' }
];

const MainFeatureSection = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = async (moodId) => {
    setSelectedMood(moodId);
    setLoading(true);
    
    try {
      const movies = await movieService.getMoviesByMood(moodId);
      setRecommendations(movies.slice(0, 4)); // Show top 4 recommendations
    } catch (err) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

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
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onClick={handleMoodSelect}
            index={index}
          />
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
  );
};

export default MainFeatureSection;