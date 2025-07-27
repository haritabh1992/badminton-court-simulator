import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PlayerPosition } from '../types/game';

interface PositionTrailProps {
  currentPosition: PlayerPosition;
  ghostPosition: PlayerPosition;
  color: string;
}

export function PositionTrail({ currentPosition, ghostPosition, color }: PositionTrailProps) {
  // Trails are always visible - no complex state management needed

  // Calculate the angle and length of the line
  const dx = currentPosition.x - ghostPosition.x;
  const dy = currentPosition.y - ghostPosition.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);

  // Create dots for the trail
  const DOT_SIZE = 4;
  const DOT_SPACING = 10;
  const numberOfDots = Math.floor(length / DOT_SPACING);
  const dots = Array.from({ length: numberOfDots }, (_, i) => (
    <View
      key={i}
      style={[
        styles.dot,
        {
          left: ghostPosition.x + 10 + (i * DOT_SPACING * Math.cos(angle * Math.PI / 180)),
          top: ghostPosition.y + 10 + (i * DOT_SPACING * Math.sin(angle * Math.PI / 180)),
          backgroundColor: color,
          width: DOT_SIZE,
          height: DOT_SIZE,
          opacity: 0.7,
        },
      ]}
    />
  ));

  return (
    <>
      {dots}
      <View
        style={[
          styles.ghostMarker,
          {
            left: ghostPosition.x,
            top: ghostPosition.y,
            backgroundColor: color,
            borderColor: color === '#ffffff' ? '#000000' : 'white',
            opacity: 0.5,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ghostMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
}); 