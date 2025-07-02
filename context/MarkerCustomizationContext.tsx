import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MarkerId = 'P1' | 'P2' | 'P3' | 'P4' | 'Shuttle';

export type MarkerCustomization = {
  size: number;
  color: string;
  isLeftHanded: boolean;
};

export type Customizations = {
  [key in MarkerId]: MarkerCustomization;
};

interface MarkerCustomizationContextType {
  customizations: Customizations;
  updateMarkerCustomization: (markerId: MarkerId, customization: Partial<MarkerCustomization>) => void;
  resetCustomizations: () => void;
  selectedMarker: MarkerId;
  setSelectedMarker: (markerId: MarkerId) => void;
}

const defaultCustomizations: Customizations = {
  P1: { size: 40, color: '#ff4444', isLeftHanded: false },
  P2: { size: 40, color: '#ff4444', isLeftHanded: false },
  P3: { size: 40, color: '#4444ff', isLeftHanded: false },
  P4: { size: 40, color: '#4444ff', isLeftHanded: false },
  Shuttle: { size: 40, color: '#ffffff', isLeftHanded: false },
};

const MarkerCustomizationContext = createContext<MarkerCustomizationContextType | undefined>(undefined);

export function MarkerCustomizationProvider({ children }: { children: ReactNode }) {
  const [customizations, setCustomizations] = useState<Customizations>(defaultCustomizations);
  const [selectedMarker, setSelectedMarker] = useState<MarkerId>('P1');

  const updateMarkerCustomization = (markerId: MarkerId, customization: Partial<MarkerCustomization>) => {
    setCustomizations(prev => ({
      ...prev,
      [markerId]: {
        ...prev[markerId],
        ...customization,
      },
    }));
  };

  const resetCustomizations = () => {
    setCustomizations(defaultCustomizations);
  };

  return (
    <MarkerCustomizationContext.Provider
      value={{
        customizations,
        updateMarkerCustomization,
        resetCustomizations,
        selectedMarker,
        setSelectedMarker,
      }}
    >
      {children}
    </MarkerCustomizationContext.Provider>
  );
}

export function useMarkerCustomization() {
  const context = useContext(MarkerCustomizationContext);
  if (!context) {
    throw new Error('useMarkerCustomization must be used within a MarkerCustomizationProvider');
  }
  return context;
}