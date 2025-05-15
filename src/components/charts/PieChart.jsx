import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const CustomPieChart = ({ data, colors }) => {
  const { colors: themeColors } = useTheme();
  
  const chartColors = colors || [
    themeColors.primary,
    themeColors.secondary,
    themeColors.success,
    themeColors.warning,
    themeColors.danger,
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={60}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={chartColors[index % chartColors.length]} 
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
            color: themeColors.text,
            borderRadius: '8px',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;