# Pull Request: Add Context Menu with Marker Customization

## Description

This PR implements a comprehensive context menu with marker customization functionality for the badminton court simulator, as specified in `CONTEXT_MENU_IMPLEMENTATION_PLAN.md`.

## Features Implemented

### 1. Context Menu Component
- ✅ Created a sliding menu that appears from the left when triggered
- ✅ Smooth slide-in/out animations using React Native's Animated API
- ✅ Semi-transparent overlay when menu is open
- ✅ Closes on tap outside

### 2. Marker Selection
- ✅ Row of selectable buttons for each marker (P1, P2, P3, P4, Shuttle)
- ✅ Currently selected marker is highlighted with a border
- ✅ Automatically adjusts available markers based on game mode (singles/doubles)

### 3. Customization Controls
- ✅ **Size Slider**: Adjust marker size from 20px to 50px
- ✅ **Color Picker**: 12 predefined color options including team colors
- ✅ Real-time preview of customizations in the marker selection area

### 4. Reset Functionality
- ✅ "Reset All Customizations" button to restore default values
- ✅ Resets all markers to their original size (30px) and team colors

### 5. State Management
- ✅ Created MarkerCustomizationContext using React Context API
- ✅ Global state management for all marker customizations
- ✅ Customizations persist across the app and update markers in real-time

### 6. Integration
- ✅ Updated PlayerMarker component to accept size and color as props
- ✅ Integrated customizations with BadmintonCourt component
- ✅ Added hamburger menu icon in the top left corner
- ✅ Context menu can be toggled by tapping the hamburger icon

### 7. UX Enhancements
- ✅ Smooth animations for menu transitions
- ✅ Visual feedback for selected markers and colors
- ✅ Responsive design that works across different screen sizes
- ✅ Clean, modern UI with Material Design principles

## Technical Implementation

### New Files Created
- `context/MarkerCustomizationContext.tsx` - React Context for managing marker customizations globally

### Files Modified
- `components/ContextMenu.tsx` - Complete redesign to include marker selection and customization controls
- `components/PlayerMarker.tsx` - Added support for dynamic size prop
- `components/BadmintonCourt.tsx` - Integrated marker customizations and added hamburger menu
- `app/_layout.tsx` - Wrapped app with MarkerCustomizationProvider
- `package.json` - Added @react-native-community/slider dependency

### New Dependencies
- `@react-native-community/slider` (^4.5.5) - For size adjustment slider

## Code Changes Summary

### MarkerCustomizationContext
```typescript
- Defines MarkerId type for all markers
- Manages customizations state with size and color for each marker
- Provides methods to update individual markers and reset all
- Tracks currently selected marker for the UI
```

### ContextMenu Updates
```typescript
- Added marker selection grid with visual previews
- Integrated size slider (20-50px range)
- Added color picker with 12 color options
- Shows only relevant markers based on game mode
- Smooth left-side slide animation
```

### PlayerMarker Updates
```typescript
- Now accepts optional 'size' prop (defaults to 30)
- Dynamically applies size to marker dimensions
```

## Testing Checklist

- [x] Menu slides in/out smoothly from the left
- [x] Hamburger menu icon opens the context menu
- [x] Tapping outside closes the menu
- [x] Marker selection highlights correctly
- [x] Size slider updates markers in real-time
- [x] Color picker updates markers immediately
- [x] Reset button restores all defaults
- [x] Singles mode shows only P1, P3, and Shuttle
- [x] Doubles mode shows all markers
- [x] Customizations persist during marker movements
- [x] Trail colors update with marker color changes

## Visual Changes

- Added hamburger menu icon (☰) in the top-left corner
- Context menu slides in from the left side (80% screen width, max 350px)
- Marker previews show actual size and color
- Selected marker has a blue border highlight
- Active color option shows with a blue border
- Modern, clean UI with proper spacing and visual hierarchy

## Performance Considerations

- Used React Context for efficient state management
- Animations use native driver for better performance
- Color and size updates are immediate with no lag
- Menu lazy-loads only when opened

## Browser/Device Compatibility

- Tested on React Native/Expo environment
- Responsive design adapts to different screen sizes
- Touch interactions work smoothly on mobile devices

## Future Enhancements (Not in scope)

- Custom color picker with full spectrum
- Marker shape customization
- Save/load preset configurations
- Animation speed controls

## Related Issues

- Implements requirements from `CONTEXT_MENU_IMPLEMENTATION_PLAN.md`

## How to Test

1. Run the app with `npm start`
2. Tap the hamburger menu icon in the top-left
3. Select different markers and customize their size/color
4. Verify changes apply immediately to the court
5. Test reset functionality
6. Switch between singles/doubles mode to see marker availability change

## Screenshots

[Screenshots would be added here showing:
1. The hamburger menu icon
2. Context menu open with customization options
3. Marker selection and color picker
4. Size slider in action]