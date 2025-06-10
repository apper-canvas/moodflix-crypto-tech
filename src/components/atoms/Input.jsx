import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', autoFocus = false, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-background border border-secondary rounded-lg text-accent placeholder-accent/50 focus:border-primary focus:outline-none transition-colors ${className}`}
            autoFocus={autoFocus}
            {...props}
        />
    );
};

export default Input;