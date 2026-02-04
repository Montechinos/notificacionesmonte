import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}) => {
  const baseClasses = 'rounded-lg flex-row items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'border-2 border-primary bg-transparent',
    ghost: 'bg-transparent',
  };

  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const textVariantClasses = {
    primary: 'text-textPrimary font-semibold',
    secondary: 'text-textPrimary font-semibold',
    outline: 'text-primary font-semibold',
    ghost: 'text-primary font-semibold',
  };

  const disabledClass = disabled || loading ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#6366F1' : '#F1F5F9'} />
      ) : (
        <Text className={`${textVariantClasses[variant]} ${textSizeClasses[size]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};