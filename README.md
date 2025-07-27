# Badminton Court Simulator

A React Native app for simulating badminton court positions and movements with enhanced UI using React Native Paper.

## Features

### Core Functionality
- **Interactive Court**: Drag and drop players and shuttle on a badminton court
- **Game Modes**: Switch between singles and doubles play
- **Position History**: Undo/redo functionality for position changes
- **Trail Markers**: Visual trails showing player and shuttle movement
- **Real-time Updates**: Smooth animations and position tracking

### Enhanced UI with React Native Paper
- **Modern Design**: Clean, material design interface
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Enhanced visual feedback and transitions
- **Professional Components**: Using React Native Paper for consistent UI

### Player Customization
- **Icon Selection**: Choose from 15+ different player icons including:
  - Account icons (account, account-circle, account-group)
  - Sports icons (badminton, sports-tennis, sports-soccer, etc.)
  - Person icons (person, person-outline, face, emoji-people)
  - Decorative icons (star, favorite)
- **Color Customization**: 9 different color options for each player
- **Size Adjustment**: Adjustable marker size (20-60px range)
- **Real-time Preview**: See changes immediately as you customize

### Settings Panel
- **Comprehensive Overview**: View all player customizations in one place
- **Quick Actions**: Reset all customizations or close panel
- **Visual Indicators**: See current icon, color, and size for each player
- **Organized Layout**: Grouped by teams for easy management

## How to Use

### Basic Navigation
1. **Move Players**: Tap and drag players to reposition them on the court
2. **Move Shuttle**: Drag the shuttle to track its position
3. **Toggle Game Mode**: Use the account/account-group button to switch between singles and doubles
4. **Reset Positions**: Use the refresh button to reset all positions

### Player Customization
1. **Long Press**: Long press on any player marker to open customization menu
2. **Choose Icon**: Select from the available icon options
3. **Pick Color**: Choose from the color palette
4. **Adjust Size**: Use the slider to change marker size
5. **Apply Changes**: Changes are applied immediately

### Settings Panel
1. **Open Settings**: Tap the menu icon in the top-left corner
2. **View Customizations**: See all current player settings
3. **Quick Reset**: Use "Reset All" to restore default settings
4. **Close Panel**: Tap "Close" or the menu icon again

### Trail Features
- **Player Trails**: Toggle player movement trails with the foot-print icon
- **Shuttle Trails**: Toggle shuttle movement trails with the badminton icon
- **History Navigation**: Use undo/redo buttons to navigate position history

## Technical Details

### Dependencies
- **React Native Paper**: Modern UI components and theming
- **Expo Vector Icons**: Material Community Icons for player markers
- **React Native Gesture Handler**: Smooth touch interactions
- **React Native Slider**: Size adjustment controls

### Architecture
- **Context API**: Centralized state management for customizations
- **Custom Hooks**: Reusable logic for court positions and history
- **Component Composition**: Modular, reusable components
- **TypeScript**: Full type safety throughout the application

### Performance
- **Optimized Animations**: Smooth 60fps animations using native driver
- **Efficient Rendering**: Minimal re-renders with proper state management
- **Memory Management**: Proper cleanup of timeouts and listeners

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Customization Options

### Available Icons
- `account` - Default player icon
- `account-circle` - Circular player icon
- `account-group` - Group player icon
- `badminton` - Badminton-specific icon
- `sports-tennis` - Tennis player icon
- `person` - Simple person icon
- `person-outline` - Outlined person icon
- `face` - Face icon
- `emoji-people` - Emoji person icon
- `sports-soccer` - Soccer player icon
- `sports-basketball` - Basketball player icon
- `sports-volleyball` - Volleyball player icon
- `sports-cricket` - Cricket player icon
- `star` - Star icon
- `favorite` - Heart icon

### Available Colors
- Red (#ff4444)
- Green (#44ff44)
- Blue (#4444ff)
- Yellow (#ffff44)
- Purple (#ff44ff)
- Cyan (#44ffff)
- White (#ffffff)
- Orange (#ff8800)
- Pink (#ff88ff)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
