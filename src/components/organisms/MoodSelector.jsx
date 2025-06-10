import React from 'react';
import MoodButton from '@/components/molecules/MoodButton';
import { motion } from 'framer-motion';

const MoodSelector = ({ moods, selectedMood, onMoodSelect }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-accent mb-4">How are you feeling?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {moods.map((mood, index) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onClick={onMoodSelect}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;