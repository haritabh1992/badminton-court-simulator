import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { PlayerMarker } from './PlayerMarker';
import { IconButton } from './IconButton';
import { useCourtPositions } from '../hooks/useCourtPositions';

export default function BadmintonCourt() {
  // Calculate court dimensions
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const COURT_ASPECT_RATIO = 1.935;
  const courtWidth = Math.min(screenWidth * 0.9, screenHeight * COURT_ASPECT_RATIO * 0.9);
  const courtHeight = courtWidth / COURT_ASPECT_RATIO;

  const {
    isDoubles,
    playerPositions,
    shuttlePosition,
    updatePlayerPosition,
    updateShuttlePosition,
    toggleGameMode,
    resetPositions,
  } = useCourtPositions({ width: courtWidth, height: courtHeight });

  return (
    <View style={styles.container}>
      <View style={[styles.court, { width: courtWidth, height: courtHeight }]}>
        <Image
          source={require('../assets/badminton-court.png')}
          style={styles.courtImage}
          resizeMode="contain"
        />

        {playerPositions.team1.map((pos, index) => (
          <PlayerMarker 
            key={`team1-${index}`}
            position={pos}
            color="#ff4444"
            onPositionChange={(newPos) => updatePlayerPosition('team1', index, newPos)}
          />
        ))}
        {playerPositions.team2.map((pos, index) => (
          <PlayerMarker 
            key={`team2-${index}`}
            position={pos}
            color="#4444ff"
            onPositionChange={(newPos) => updatePlayerPosition('team2', index, newPos)}
          />
        ))}

        <PlayerMarker
          position={shuttlePosition}
          color="#ffffff"
          onPositionChange={updateShuttlePosition}
        />
      </View>

      <IconButton
        icon={isDoubles ? "👥" : "👤"}
        position="right"
        onPress={() => toggleGameMode(!isDoubles)}
      />
      <IconButton
        icon="↺"
        position="left"
        onPress={resetPositions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  court: {
    position: 'relative',
  },
  courtImage: {
    width: '100%',
    height: '100%',
  },
}); 