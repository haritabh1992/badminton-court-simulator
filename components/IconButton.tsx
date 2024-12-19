import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: string;
  disabled?: boolean;
  active?: boolean;
}

export function IconButton({ onPress, icon, disabled, active }: Omit<IconButtonProps, 'position'>) {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        disabled && styles.disabled,
        active && styles.active
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.buttonText, 
        disabled && styles.disabledText,
        active && styles.activeText
      ]}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#666',
  },
  active: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
  },
  activeText: {
    color: '#2196F3',
  },
}); 