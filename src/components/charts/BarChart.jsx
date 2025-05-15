import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const CustomBarChart = ({ data, xKey, bars }) => {
  const { colors } = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={colors.border} 
        />
        <XAxis 
          dataKey={xKey} 
          stroke={colors.textSecondary} 
        />
        <YAxis 
          stroke={colors.textSecondary} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
            borderRadius: '8px',
          }}
        />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color || colors.primary}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;