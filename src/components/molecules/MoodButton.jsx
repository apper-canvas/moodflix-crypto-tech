import React from 'react';
import { motion } from 'framer-motion';

const MoodButton = ({ mood, isSelected, onClick, index }) => {
    return (
        <motion.button
            key={mood.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 20px ${mood.color.replace('bg-', 'rgba(').replace('-500', ', 0.3)')}`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(mood.id)}
            className={`p-4 rounded-lg transition-all duration-200 text-center ${
                isSelected
                    ? `${mood.color} shadow-lg`
                    : 'bg-card hover:bg-secondary'
            }`}
        >
            <div className="text-2xl mb-2">{mood.emoji}</div>
            <div className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-accent'
            }`}>
                {mood.label}
            </div>
        </motion.button>
    );
};

export default MoodButton;