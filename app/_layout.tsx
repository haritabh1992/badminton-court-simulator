import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { MarkerCustomizationProvider } from '../context/MarkerCustomizationContext';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider>
      <MarkerCustomizationProvider>
        <View style={styles.container}>
          <Stack 
            screenOptions={{
              headerShown: false,
              orientation: 'portrait'
            }} 
          />
        </View>
      </MarkerCustomizationProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
