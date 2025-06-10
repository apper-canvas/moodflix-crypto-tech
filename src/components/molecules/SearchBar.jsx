import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
    return (
        <div className="relative max-w-md">
            <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/50 w-5 h-5" 
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-10 pr-4 py-3"
            />
        </div>
    );
};

export default SearchBar;