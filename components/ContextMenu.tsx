import React from 'react';
import { View, StyleSheet, Modal, Text, Switch, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { useEffect, useRef } from 'react';
import Slider from '@react-native-community/slider';
import { useMarkerCustomization, MarkerId } from '../context/MarkerCustomizationContext';
import { LinearGradient } from 'expo-linear-gradient';

interface ContextMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const MARKER_LABELS: Record<MarkerId, string> = {
  P1: 'Player 1',
  P2: 'Player 2',
  P3: 'Player 3',
  P4: 'Player 4',
  Shuttle: 'Shuttle',
};

// Color interpolation function to create smooth gradient
const interpolateColor = (value: number): string => {
  // Create a rainbow gradient from 0 to 1
  const hue = value * 360; // Convert to 0-360 degrees
  return `hsl(${hue}, 70%, 50%)`;
};

// Convert HSL to hex for better compatibility
const hslToHex = (h: number, s: number, l: number): string => {
  try {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  } catch (error) {
    return '#ff0000'; // Default to red if conversion fails
  }
};

// Get current color value from hex color
const getColorValue = (hexColor: string): number => {
  try {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return 0;
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;
    
    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    
    h = h * 60;
    if (h < 0) h += 360;
    
    return h / 360; // Return value between 0 and 1
  } catch (error) {
    return 0; // Default to red if conversion fails
  }
};



export default function ContextMenu({ 
  isVisible, 
  onClose
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

  const availableMarkers: MarkerId[] = ['P1', 'P2', 'P3', 'P4', 'Shuttle'];

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
                minimumValue={30}
                maximumValue={60}
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
              <View style={styles.colorLabelRow}>
                <Text style={styles.settingLabel}>Color</Text>
                <View style={styles.currentColorPreviewInline}>
                  <View 
                    style={[
                      styles.colorPreview,
                      { backgroundColor: customizations[selectedMarker].color }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.colorSliderContainer}>
                <View style={styles.gradientTrack}>
                  <LinearGradient
                    colors={['#ff4444', '#ffff44', '#44ff44', '#44ffff', '#4444ff', '#ff44ff', '#ff4444']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
                <Slider
                  style={styles.colorSlider}
                  minimumValue={0}
                  maximumValue={1}
                  value={getColorValue(customizations[selectedMarker].color)}
                  onValueChange={(value) => {
                    const color = hslToHex(value * 360, 70, 50);
                    updateMarkerCustomization(selectedMarker, { color });
                  }}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="white"
                />
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
    borderColor: 'black',
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
  colorSliderContainer: {
    width: '100%',
    marginTop: 10,
  },
  gradientTrack: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    flexDirection: 'row',
  },
  gradientSegment: {
    height: '100%',
  },
  colorSlider: {
    width: '100%',
    height: 40,
    position: 'absolute',
    top: -10,
  },
  currentColorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 10,
  },
  colorValueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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
  colorLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  currentColorPreviewInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
}); 