import React from 'react';
import { View, StyleSheet, Modal, Text, Switch, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  isVisible: boolean;
  onClose: () => void;
  isDoubles: boolean;
  onToggleDoubles: (value: boolean) => void;
}

export default function ContextMenu({ 
  isVisible, 
  onClose, 
  isDoubles, 
  onToggleDoubles 
}: ContextMenuProps) {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    if (isVisible) {
      // Slide in
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      // Slide out
      Animated.spring(slideAnim, {
        toValue: Dimensions.get('window').width,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [isVisible]);

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
          <View style={styles.handle} />
          
          <Text style={styles.menuTitle}>Game Settings</Text>
          
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
    width: 300,
    backgroundColor: 'white',
    height: '100%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
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
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    alignSelf: 'flex-start',
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
}); 