import React from 'react';
import { View, StyleSheet, Modal, Text, Switch, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { useEffect, useRef } from 'react';
import Slider from '@react-native-community/slider';
import { useMarkerCustomization, MarkerId } from '../context/MarkerCustomizationContext';

interface ContextMenuProps {
  isVisible: boolean;
  onClose: () => void;
  isDoubles: boolean;
  onToggleDoubles: (value: boolean) => void;
}

const MARKER_LABELS: Record<MarkerId, string> = {
  P1: 'Player 1',
  P2: 'Player 2',
  P3: 'Player 3',
  P4: 'Player 4',
  Shuttle: 'Shuttle',
};

const COLOR_OPTIONS = [
  '#ff4444', '#4444ff', '#44ff44', '#ffff44', 
  '#ff44ff', '#44ffff', '#ff8844', '#8844ff',
  '#44ff88', '#ffffff', '#000000', '#888888'
];

export default function ContextMenu({ 
  isVisible, 
  onClose, 
  isDoubles, 
  onToggleDoubles 
}: ContextMenuProps) {
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width * 0.8)).current;
  const { 
    customizations, 
    updateMarkerCustomization, 
    resetCustomizations,
    selectedMarker,
    setSelectedMarker 
  } = useMarkerCustomization();

  useEffect(() => {
    if (isVisible) {
      // Slide in from left
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      // Slide out to left
      Animated.spring(slideAnim, {
        toValue: -Dimensions.get('window').width * 0.8,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [isVisible]);

  const availableMarkers: MarkerId[] = isDoubles 
    ? ['P1', 'P2', 'P3', 'P4', 'Shuttle'] 
    : ['P1', 'P3', 'Shuttle'];

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            
            <Text style={styles.menuTitle}>Customize Markers</Text>
            
            {/* Game Mode Toggle */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Game Mode</Text>
              <View style={styles.toggleContainer}>
                <Text style={[
                  styles.toggleLabel, 
                  !isDoubles && styles.toggleLabelActive
                ]}>Singles</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isDoubles ? '#2196F3' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={onToggleDoubles}
                  value={isDoubles}
                />
                <Text style={[
                  styles.toggleLabel,
                  isDoubles && styles.toggleLabelActive
                ]}>Doubles</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Marker Selection */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Select Marker</Text>
              <View style={styles.markerGrid}>
                {availableMarkers.map((markerId) => (
                  <TouchableOpacity
                    key={markerId}
                    style={[
                      styles.markerButton,
                      selectedMarker === markerId && styles.markerButtonActive
                    ]}
                    onPress={() => setSelectedMarker(markerId)}
                  >
                    <View 
                      style={[
                        styles.markerPreview,
                        { 
                          backgroundColor: customizations[markerId].color,
                          width: customizations[markerId].size * 0.6,
                          height: customizations[markerId].size * 0.6,
                          borderRadius: customizations[markerId].size * 0.3,
                        }
                      ]}
                    />
                    <Text style={styles.markerLabel}>{MARKER_LABELS[markerId]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Size Customization */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>
                Size: {Math.round(customizations[selectedMarker].size)}px
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={20}
                maximumValue={50}
                value={customizations[selectedMarker].size}
                onValueChange={(value) => 
                  updateMarkerCustomization(selectedMarker, { size: value })
                }
                minimumTrackTintColor="#2196F3"
                maximumTrackTintColor="#CCCCCC"
                thumbTintColor="#2196F3"
              />
            </View>

            <View style={styles.divider} />

            {/* Color Customization */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Color</Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      customizations[selectedMarker].color === color && styles.colorOptionActive
                    ]}
                    onPress={() => 
                      updateMarkerCustomization(selectedMarker, { color })
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Reset Button */}
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetCustomizations}
            >
              <Text style={styles.resetButtonText}>Reset All Customizations</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    width: '80%',
    maxWidth: 350,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    marginBottom: 20,
    alignSelf: 'center',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  settingRow: {
    width: '100%',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
  },
  toggleLabel: {
    fontSize: 16,
    marginHorizontal: 10,
    color: '#666',
  },
  toggleLabelActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  markerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  markerButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    minWidth: 80,
  },
  markerButtonActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  markerPreview: {
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 5,
  },
  markerLabel: {
    fontSize: 12,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 