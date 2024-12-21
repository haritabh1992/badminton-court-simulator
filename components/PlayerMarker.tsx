import React, { useState, useEffect } from 'react';
import { View, StyleSheet, GestureResponderEvent, Animated } from 'react-native';

interface PlayerMarkerProps {
  position: { x: number; y: number };
  color: string;
  onPositionChange?: (newPosition: { x: number; y: number }) => void;
  onPositionStart?: (newPosition: { x: number; y: number }) => void;
  onPositionChangeComplete?: () => void;
}

export function PlayerMarker({ 
  position, 
  color, 
  onPositionChange, 
  onPositionStart, 
  onPositionChangeComplete 
}: PlayerMarkerProps) {
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const liftAnim = React.useRef(new Animated.Value(0)).current;
  const positionX = React.useRef(new Animated.Value(position.x)).current;
  const positionY = React.useRef(new Animated.Value(position.y)).current;

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

  return (
    <Animated.View
      style={[
        styles.marker,
        {
          backgroundColor: color,
          borderColor: color === '#ffffff' ? '#000000' : 'white',
          transform: [
            {
              translateX: positionX,
            },
            {
              translateY: positionY,
            },
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
        onPositionStart?.(position);
        animateLift(true);
      }}
      onResponderMove={(event: GestureResponderEvent) => {
        const touch = event.nativeEvent;
        const newPosition = {
          x: touch.pageX - touchOffset.x,
          y: touch.pageY - touchOffset.y,
        };
        // Directly update animated values for smoother dragging
        positionX.setValue(newPosition.x);
        positionY.setValue(newPosition.y);
        onPositionChange?.(newPosition);
      }}
      onResponderRelease={() => {
        onPositionChangeComplete?.();
        animateLift(false);
      }}
    />
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
}); 