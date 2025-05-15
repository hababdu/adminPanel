import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Card = ({ 
  children, 
  title,
  action,
  className = '',
  ...props 
}) => {
  const { colors } = useTheme();
  
  return (
    <div 
      className={`rounded-xl shadow-sm border ${colors.border} ${colors.surface} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between p-4 border-b ${colors.border}`}>
          <h3 className={`text-lg font-semibold ${colors.text}`}>{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;