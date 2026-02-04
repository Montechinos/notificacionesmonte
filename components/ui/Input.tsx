import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-textPrimary font-medium mb-2 text-sm">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-surface text-textPrimary px-4 py-3 rounded-lg border ${
          error ? 'border-error' : 'border-border'
        }`}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && (
        <Text className="text-error text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};