import React, { useState, useEffect } from 'react';
import { View, StyleSheet, GestureResponderEvent, Animated, Modal, TouchableOpacity, Text, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

interface PlayerMarkerProps {
  position: { x: number; y: number };
  color: string;
  size?: number;
  isLeftHanded?: boolean;
  onPositionChange?: (newPosition: { x: number; y: number }) => void;
  onPositionStart?: (newPosition: { x: number; y: number }) => void;
  onPositionChangeComplete?: () => void;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: number) => void;
  initialSize?: number;
}

export function PlayerMarker({ 
  position, 
  color, 
  size,
  isLeftHanded,
  onPositionChange, 
  onPositionStart, 
  onPositionChangeComplete,
  onColorChange,
  onSizeChange,
  initialSize = 30
}: PlayerMarkerProps) {
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const liftAnim = React.useRef(new Animated.Value(0)).current;
  const positionX = React.useRef(new Animated.Value(position.x)).current;
  const positionY = React.useRef(new Animated.Value(position.y)).current;
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const longPressTimeout = React.useRef<NodeJS.Timeout>();
  const [markerSize, setMarkerSize] = useState(size || initialSize);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

  // Update internal markerSize when size prop changes
  useEffect(() => {
    if (size !== undefined) {
      setMarkerSize(size);
    }
  }, [size]);

  useEffect(() => {
    // Reduced springiness for position changes
    Animated.spring(positionX, {
      toValue: position.x,
      useNativeDriver: true,
      tension: 300,
      friction: 25,
    }).start();
    
    Animated.spring(positionY, {
      toValue: position.y,
      useNativeDriver: true,
      tension: 300,
      friction: 25,
    }).start();
  }, [position]);

  const animateLift = (lifted: boolean) => {
    Animated.spring(liftAnim, {
      toValue: lifted ? 1 : 0,
      useNativeDriver: true,
      tension: 400,
      friction: 35,
    }).start();
  };

  const getAdjustedMenuPosition = (touchX: number, touchY: number) => {
    const screen = Dimensions.get('window');
    const menuWidth = 220;
    const menuHeight = 200; // Increased height to accommodate slider
    const margin = 10; // minimum distance from screen edge

    let x = touchX - menuWidth / 2; // Center menu horizontally on touch point
    let y = touchY - 50; // Show menu above touch point by default

    // Adjust horizontal position if menu would go off screen
    if (x + menuWidth > screen.width - margin) {
      x = screen.width - menuWidth - margin;
    }
    if (x < margin) {
      x = margin;
    }

    // Adjust vertical position if menu would go off screen
    if (y + menuHeight > screen.height - margin) {
      y = touchY - menuHeight; // Show above touch point
    }
    if (y < margin) {
      y = touchY + 20; // Show below touch point
    }

    return { x, y };
  };

  return (
    <>
      <Animated.View
        style={[
          styles.marker,
          {
            backgroundColor: color,
            borderColor: color === '#ffffff' ? '#000000' : 'white',
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            transform: [
              { translateX: positionX },
              { translateY: positionY },
              {
                scale: liftAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
            shadowOpacity: liftAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.5],
            }),
            shadowRadius: liftAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 4],
            }),
            elevation: liftAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 8],
            }),
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
            setShowColorMenu(true);
          }, 500);

          onPositionStart?.(position);
          animateLift(true);
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
          positionX.setValue(newPosition.x);
          positionY.setValue(newPosition.y);
          onPositionChange?.(newPosition);
        }}
        onResponderRelease={() => {
          if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
          }
          onPositionChangeComplete?.();
          animateLift(false);
        }}
      />

      <Modal
        visible={showColorMenu}
        transparent={true}
        onRequestClose={() => setShowColorMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColorMenu(false)}
        >
          <View
            style={[
              styles.colorMenu,
              {
                top: menuPosition.y,
                left: menuPosition.x,
              }
            ]}
          >
            <View style={styles.colorGrid}>
              {colors.map((colorOption) => (
                <TouchableOpacity
                  key={colorOption}
                  style={[
                    styles.colorOption,
                    { 
                      backgroundColor: colorOption,
                      borderColor: colorOption === '#ffffff' ? '#000000' : 'white'
                    }
                  ]}
                  onPress={() => {
                    onColorChange?.(colorOption);
                    setShowColorMenu(false);
                  }}
                />
              ))}
            </View>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Size</Text>
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
            </View>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  colorMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 220,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    margin: 4,
  },
  sliderContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
}); 