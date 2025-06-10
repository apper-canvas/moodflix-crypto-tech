import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActionsSection = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {actions.map((action, index) => (
        <Button
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          onClick={action.action}
          className="bg-card p-6 rounded-lg shadow-movie-card hover:shadow-movie-card-hover text-left group"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 8px 24px rgba(229, 9, 20, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
            <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-accent mb-2">{action.title}</h3>
          <p className="text-accent/70">{action.description}</p>
        </Button>
      ))}
    </div>
  );
};

export default QuickActionsSection;