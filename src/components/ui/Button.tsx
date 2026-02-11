import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantStyles = {
  primary: 'bg-red-600 active:bg-red-700',
  secondary: 'bg-yellow-400 active:bg-yellow-500',
  ghost: 'bg-transparent border border-red-600',
};

const textStyles = {
  primary: 'text-white',
  secondary: 'text-gray-900',
  ghost: 'text-red-600',
};

export function Button({ label, isLoading, variant = 'primary', disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`w-full items-center rounded-xl py-4 ${variantStyles[variant]} ${disabled || isLoading ? 'opacity-60' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#D62300'} />
      ) : (
        <Text className={`text-base font-bold tracking-wide ${textStyles[variant]}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
