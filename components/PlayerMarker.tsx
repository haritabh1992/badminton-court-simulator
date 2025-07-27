import React, { useState, useEffect } from 'react';
import { View, StyleSheet, GestureResponderEvent, Modal, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Button, Card, Chip, IconButton, Text as PaperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface PlayerMarkerProps {
  position: { x: number; y: number };
  color: string;
  size?: number;
  isLeftHanded?: boolean;
  icon?: string;
  onPositionChange?: (newPosition: { x: number; y: number }) => void;
  onPositionStart?: (newPosition: { x: number; y: number }) => void;
  onPositionChangeComplete?: () => void;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: number) => void;
  onIconChange?: (icon: string) => void;
  initialSize?: number;
}

const availableIcons = [
  'account', 'account-circle', 'account-group', 'badminton', 'sports-tennis',
  'person', 'person-outline', 'face', 'emoji-people', 'sports-soccer',
  'sports-basketball', 'sports-volleyball', 'sports-cricket', 'star', 'favorite'
];

export function PlayerMarker({ 
  position, 
  color, 
  size,
  isLeftHanded,
  icon = 'account',
  onPositionChange, 
  onPositionStart, 
  onPositionChangeComplete,
  onColorChange,
  onSizeChange,
  onIconChange,
  initialSize = 30
}: PlayerMarkerProps) {
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const [isLifted, setIsLifted] = useState(false);
  const [showCustomizationMenu, setShowCustomizationMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const longPressTimeout = React.useRef<NodeJS.Timeout>();
  const [markerSize, setMarkerSize] = useState(size || initialSize);

  const colors = [
    { name: 'Red', value: '#ff4444' },
    { name: 'Green', value: '#44ff44' },
    { name: 'Blue', value: '#4444ff' },
    { name: 'Yellow', value: '#ffff44' },
    { name: 'Purple', value: '#ff44ff' },
    { name: 'Cyan', value: '#44ffff' },
    { name: 'White', value: '#ffffff' },
    { name: 'Orange', value: '#ff8800' },
    { name: 'Pink', value: '#ff88ff' }
  ];

  // Update internal markerSize when size prop changes
  useEffect(() => {
    if (size !== undefined) {
      setMarkerSize(size);
    }
  }, [size]);

  const getAdjustedMenuPosition = (touchX: number, touchY: number) => {
    const screen = Dimensions.get('window');
    const menuWidth = 300;
    const menuHeight = 400;
    const margin = 10;

    let x = touchX - menuWidth / 2;
    let y = touchY - 50;

    if (x + menuWidth > screen.width - margin) {
      x = screen.width - menuWidth - margin;
    }
    if (x < margin) {
      x = margin;
    }

    if (y + menuHeight > screen.height - margin) {
      y = touchY - menuHeight;
    }
    if (y < margin) {
      y = touchY + 20;
    }

    return { x, y };
  };

  return (
    <>
      <View
        style={[
          styles.marker,
          {
            backgroundColor: color,
            borderColor: color === '#ffffff' ? '#000000' : 'white',
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { scale: isLifted ? 1.1 : 1 },
            ],
            shadowOpacity: isLifted ? 0.5 : 0.2,
            shadowRadius: isLifted ? 4 : 2,
            elevation: isLifted ? 8 : 2,
            opacity: 1,
          },
        ]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event: GestureResponderEvent) => {
          const touch = event.nativeEvent;
          setTouchOffset({
            x: touch.pageX - position.x,
            y: touch.pageY - position.y,
          });
          
          longPressTimeout.current = setTimeout(() => {
            const adjustedPosition = getAdjustedMenuPosition(touch.pageX, touch.pageY);
            setMenuPosition(adjustedPosition);
            setShowCustomizationMenu(true);
          }, 500);

          onPositionStart?.(position);
          setIsLifted(true);
        }}
        onResponderMove={(event: GestureResponderEvent) => {
          // Clear long press timeout if movement starts
          if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
          }
          
          const touch = event.nativeEvent;
          const newPosition = {
            x: touch.pageX - touchOffset.x,
            y: touch.pageY - touchOffset.y,
          };
          onPositionChange?.(newPosition);
        }}
        onResponderRelease={() => {
          if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
          }
          onPositionChangeComplete?.();
          setIsLifted(false);
        }}
              >
          <MaterialCommunityIcons
            name={icon as any}
            size={markerSize * 0.6}
            color={color === '#ffffff' ? '#000000' : 'white'}
          />
        </View>

      <Modal
        visible={showCustomizationMenu}
        transparent={true}
        onRequestClose={() => setShowCustomizationMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCustomizationMenu(false)}
        >
          <View
            style={[
              styles.customizationMenu,
              {
                top: menuPosition.y,
                left: menuPosition.x,
              }
            ]}
          >
            <PaperText variant="titleMedium" style={styles.menuTitle}>
              Customize Player
            </PaperText>
            
            <View style={styles.section}>
              <PaperText variant="bodyMedium" style={styles.sectionTitle}>
                Color
              </PaperText>
              <View style={styles.colorGrid}>
                {colors.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.value}
                    style={[
                      styles.colorOption,
                      { 
                        backgroundColor: colorOption.value,
                        borderColor: colorOption.value === '#ffffff' ? '#000000' : 'white'
                      }
                    ]}
                    onPress={() => {
                      onColorChange?.(colorOption.value);
                    }}
                  >
                    {color === colorOption.value && (
                      <MaterialCommunityIcons 
                        name="check" 
                        size={16} 
                        color={colorOption.value === '#ffffff' ? '#000000' : 'white'} 
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <PaperText variant="bodyMedium" style={styles.sectionTitle}>
                Icon
              </PaperText>
              <View style={styles.iconGrid}>
                {availableIcons.map((iconOption) => (
                  <TouchableOpacity
                    key={iconOption}
                    style={[
                      styles.iconOption,
                      icon === iconOption && styles.selectedIconOption
                    ]}
                    onPress={() => {
                      onIconChange?.(iconOption);
                    }}
                  >
                    <MaterialCommunityIcons 
                      name={iconOption as any} 
                      size={24} 
                      color={icon === iconOption ? '#2196F3' : '#666'} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <PaperText variant="bodyMedium" style={styles.sectionTitle}>
                Size
              </PaperText>
              <Slider
                style={styles.slider}
                minimumValue={20}
                maximumValue={60}
                value={markerSize}
                onValueChange={(value: number) => {
                  setMarkerSize(value);
                  onSizeChange?.(value);
                }}
                minimumTrackTintColor="#2196F3"
                maximumTrackTintColor="#000000"
              />
              <PaperText variant="bodySmall" style={styles.sizeValue}>
                {Math.round(markerSize)}px
              </PaperText>
            </View>

            <Button 
              mode="contained" 
              onPress={() => setShowCustomizationMenu(false)}
              style={styles.closeButton}
            >
              Done
            </Button>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  customizationMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: 300,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedIconOption: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sizeValue: {
    textAlign: 'center',
    marginTop: 4,
    color: '#666',
  },
  closeButton: {
    marginTop: 8,
  },

}); 