import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { PlayerMarker } from './PlayerMarker';
import { IconButton } from './IconButton';
import { useCourtPositions } from '../hooks/useCourtPositions';

export default function BadmintonCourt() {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const BUTTON_CONTAINER_HEIGHT = 60;
  const availableHeight = screenHeight - BUTTON_CONTAINER_HEIGHT;
  
  // For a 90-degree rotated image, we want the container's width to be the screen height
  // and the container's height to be the screen width
  const courtWidth = availableHeight;  // Container width matches available height
  const courtHeight = screenWidth;     // Container height matches screen width

  const {
    isDoubles,
    playerPositions,
    shuttlePosition,
    updatePlayerPosition,
    updateShuttlePosition,
    handlePositionChangeComplete,
    toggleGameMode,
    resetPositions,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCourtPositions({ width: courtWidth, height: courtHeight });

  return (
    <View style={styles.container}>
      <View style={[styles.courtWrapper, { marginBottom: BUTTON_CONTAINER_HEIGHT }]}>
        <View 
          style={[
            styles.courtContainer, 
            { 
              width: courtWidth, 
              height: courtHeight,
            }
          ]}
        >
          <Image
            source={require('../assets/badminton-court.png')}
            style={[styles.courtImage, { transform: [{ rotate: '90deg' }] }]}
            resizeMode="stretch"
          />

          {playerPositions.team1.map((pos, index) => (
            <PlayerMarker 
              key={`team1-${index}`}
              position={pos}
              color="#ff4444"
              onPositionChange={(newPos) => updatePlayerPosition('team1', index, newPos)}
              onPositionChangeComplete={handlePositionChangeComplete}
            />
          ))}
          {playerPositions.team2.map((pos, index) => (
            <PlayerMarker 
              key={`team2-${index}`}
              position={pos}
              color="#4444ff"
              onPositionChange={(newPos) => updatePlayerPosition('team2', index, newPos)}
              onPositionChangeComplete={handlePositionChangeComplete}
            />
          ))}

          <PlayerMarker
            position={shuttlePosition}
            color="#ffffff"
            onPositionChange={updateShuttlePosition}
            onPositionChangeComplete={handlePositionChangeComplete}
          />
        </View>
      </View>

      <View style={[styles.buttonContainer, { height: BUTTON_CONTAINER_HEIGHT }]}>
        <IconButton
          icon="↺"
          onPress={resetPositions}
        />
        <IconButton
          icon="◀"
          onPress={undo}
          disabled={!canUndo}
        />
        <IconButton
          icon="▶"
          onPress={redo}
          disabled={!canRedo}
        />
        <IconButton
          icon={isDoubles ? "👥" : "👤"}
          onPress={() => toggleGameMode(!isDoubles)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  courtContainer: {
    position: 'relative',
  },
  courtImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
}); 