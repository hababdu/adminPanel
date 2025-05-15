import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  ...props 
}) => {
  const { colors } = useTheme();
  
  const baseClasses = 'rounded-lg font-medium transition-all flex items-center justify-center';
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  const variantClasses = {
    primary: `bg-${colors.primary} hover:bg-${colors.primaryHover} text-white`,
    secondary: `bg-${colors.secondary} hover:bg-opacity-90 text-white`,
    outline: `border ${colors.border} hover:bg-${colors.surface} text-${colors.text}`,
    ghost: `hover:bg-${colors.surface} text-${colors.text}`,
    danger: `bg-${colors.danger} hover:bg-opacity-90 text-white`,
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      {...props}
    >
      {Icon && <Icon className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;