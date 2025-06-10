import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', disabled = false, whileHover, whileTap, ...props }) => {
    // Filter out props that are not standard HTML attributes, assuming they are for motion
    const motionProps = { whileHover, whileTap };
    const cleanProps = Object.keys(props).reduce((acc, key) => {
        if (!['name', 'size'].includes(key)) { // Exclude ApperIcon specific props if they somehow get here
            acc[key] = props[key];
        }
        return acc;
    }, {});

    return (
        <motion.button
            onClick={onClick}
            className={`transition-all duration-200 ${className}`}
            disabled={disabled}
            {...motionProps}
            {...cleanProps}
        >
            {children}
        </motion.button>
    );
};

export default Button;