import React from 'react';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend = 'up',
  color = 'primary'
}) => {
  const { colors } = useTheme();
  
  const trendColors = {
    up: colors.success,
    down: colors.danger,
    neutral: colors.warning,
  };
  
  return (
    <div className={`p-4 rounded-lg border ${colors.border} ${colors.surface} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm ${colors.textSecondary}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>{value}</p>
          <p 
            className={`text-sm mt-2 flex items-center`}
            style={{ color: trendColors[trend] }}
          >
            {change}
            <span className="ml-1">
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          </p>
        </div>
        <div 
          className={`p-2 rounded-full`}
          style={{ 
            backgroundColor: `${colors[color]}20`,
            color: colors[color]
          }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;