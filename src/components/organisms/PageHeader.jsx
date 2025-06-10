import React from 'react';

const PageHeader = ({ title, description, actions }) => {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl md:text-4xl font-heading text-accent mb-2">
                    {title}
                </h1>
                {description && <p className="text-accent/80">{description}</p>}
            </div>
            {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
    );
};

export default PageHeader;