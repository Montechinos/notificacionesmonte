import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="mb-1 text-sm font-semibold text-gray-700">{label}</Text>
      )}
      <TextInput
        className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 ${error ? 'border-red-500' : ''} ${className ?? ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
