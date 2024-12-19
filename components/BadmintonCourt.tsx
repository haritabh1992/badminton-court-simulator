import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { PlayerMarker } from './PlayerMarker';
import { IconButton } from './IconButton';
import { useCourtPositions } from '../hooks/useCourtPositions';
import { PositionTrail } from './PositionTrail';

export default function BadmintonCourt() {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const BUTTON_CONTAINER_HEIGHT = 75;
  const BANNER_HEIGHT = 50;
  const availableHeight = screenHeight - 2.2*BUTTON_CONTAINER_HEIGHT - BANNER_HEIGHT;
  
  // Without rotation, use normal width/height mapping
  const courtWidth = screenWidth;      // Container width matches screen width
  const courtHeight = availableHeight; // Container height matches available height

  const {
    isDoubles,
    playerPositions,
    shuttlePosition,
    ghostPositions,
    updatePlayerPosition,
    updateShuttlePosition,
    handlePositionChangeComplete,
    toggleGameMode,
    resetPositions,
    undo,
    redo,
    canUndo,
    canRedo,
    showPlayerTrails,
    showShuttleTrail,
    togglePlayerTrails,
    toggleShuttleTrail,
  } = useCourtPositions({ width: courtWidth, height: courtHeight });

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { height: BANNER_HEIGHT }]}>
        <Text style={styles.bannerText}>Badminton Court Simulator</Text>
      </View>

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
            style={styles.courtImage}
            resizeMode="stretch"
          />

          {showPlayerTrails && playerPositions.team1.map((pos, index) => (
            ghostPositions?.team1[index] && (
              <PositionTrail
                key={`trail-team1-${index}`}
                currentPosition={pos}
                ghostPosition={ghostPositions.team1[index]!}
                color="#ff4444"
              />
            )
          ))}
          {showPlayerTrails && playerPositions.team2.map((pos, index) => (
            ghostPositions?.team2[index] && (
              <PositionTrail
                key={`trail-team2-${index}`}
                currentPosition={pos}
                ghostPosition={ghostPositions.team2[index]!}
                color="#4444ff"
              />
            )
          ))}
          {showShuttleTrail && shuttlePosition && ghostPositions?.shuttle && (
            <PositionTrail
              currentPosition={shuttlePosition}
              ghostPosition={ghostPositions.shuttle}
              color="#ffffff"
            />
          )}

          {playerPositions.team1.map((pos, index) => (
            <PlayerMarker 
              key={`team1-${index}`}
              position={pos}
              color="#ff4444"
              onPositionChange={(newPos) => updatePlayerPosition('team1', index, newPos)}
              onPositionStart={(newPos) => updatePlayerPosition('team1', index, newPos, true)}
              onPositionChangeComplete={handlePositionChangeComplete}
            />
          ))}
          {playerPositions.team2.map((pos, index) => (
            <PlayerMarker 
              key={`team2-${index}`}
              position={pos}
              color="#4444ff"
              onPositionChange={(newPos) => updatePlayerPosition('team2', index, newPos)}
              onPositionStart={(newPos) => updatePlayerPosition('team2', index, newPos, true)}
              onPositionChangeComplete={handlePositionChangeComplete}
            />
          ))}

          <PlayerMarker
            position={shuttlePosition}
            color="#ffffff"
            onPositionChange={updateShuttlePosition}
            onPositionStart={(newPos) => updateShuttlePosition(newPos, true)}
            onPositionChangeComplete={handlePositionChangeComplete}
          />
        </View>
      </View>

      <View style={[styles.buttonContainer, { 
        height: BUTTON_CONTAINER_HEIGHT,
        bottom: 4  // Add some padding from the bottom
      }]}>
        {/* Left group: Game setup */}
        <View>
          <Text style={styles.buttonGroupLabel}>Game Setup</Text>
          <View style={styles.buttonGroup}>
            <IconButton
              icon="↺"
              onPress={resetPositions}
            />
            <IconButton
              icon={isDoubles ? "👥" : "👤"}
              onPress={() => toggleGameMode(!isDoubles)}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Center group: History Navigation */}
        <View>
          <Text style={styles.buttonGroupLabel}>History Navigation</Text>
          <View style={styles.buttonGroup}>
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
          </View>
        </View>

        <View style={styles.divider} />

        {/* Right group: Trail Markers */}
        <View>
          <Text style={styles.buttonGroupLabel}>Trail Markers</Text>
          <View style={styles.buttonGroup}>
            <IconButton
              icon="👟"
              onPress={togglePlayerTrails}
              active={showPlayerTrails}
            />
            <IconButton
              icon="🏸"
              onPress={toggleShuttleTrail}
              active={showShuttleTrail}
            />
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,  // Add rounded corners
    marginHorizontal: 10,  // Add some horizontal padding
    width: '100%',  
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  banner: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroupLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
}); 