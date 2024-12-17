import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: string;
  position: 'left' | 'right';
}

export function IconButton({ onPress, icon, position }: IconButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[position]]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  left: {
    left: 20,
  },
  right: {
    right: 20,
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
  },
}); 