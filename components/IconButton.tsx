import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton as PaperIconButton } from 'react-native-paper';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  size?: number;
}

export function IconButton({ 
  icon, 
  onPress, 
  disabled = false, 
  active = false,
  size = 24 
}: IconButtonProps) {
  return (
    <PaperIconButton
      icon={icon}
      size={size}
      onPress={onPress}
      disabled={disabled}
      mode={active ? 'contained' : 'outlined'}
      style={[
        styles.button,
        active && styles.activeButton
      ]}
      mode="contained"
      iconColor={active ? '#ffffff' : '#666666'}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 2,
    borderRadius: 50,
    width: 48,
    height: 48,
  },
  activeButton: {
    backgroundColor: '#2196F3',
  },
}); 