import { TeamPositions, CourtDimensions, PlayerPosition } from '../types/game';

export function getInitialPositions(isDoublesMode: boolean, courtDimensions: CourtDimensions): TeamPositions {
  // Calculate center point
  const centerX = courtDimensions.width * 0.5;
  const centerY = courtDimensions.height * 0.5;
  
  // Calculate offset from center (about 50% of the distance to corners)
  const offsetX = courtDimensions.width * 0.25;  // 25% of width from center
  const offsetY = courtDimensions.height * 0.25; // 25% of height from center

  if (isDoublesMode) {
    return {
      team1: [
        { x: centerX - offsetX, y: centerY - offsetY }, // Top left
        { x: centerX - offsetX, y: centerY + offsetY }, // Bottom left
      ],
      team2: [
        { x: centerX + offsetX, y: centerY + offsetY }, // Bottom right
        { x: centerX + offsetX, y: centerY - offsetY }, // Top right
      ],
    };
  }
  return {
    team1: [{ x: centerX - offsetX, y: centerY - offsetY }], // Top left
    team2: [{ x: centerX + offsetX, y: centerY + offsetY }], // Bottom right
  };
}

export function getInitialShuttle(courtDimensions: CourtDimensions): PlayerPosition {
  return {
    x: courtDimensions.width * 0.5,
    y: courtDimensions.height * 0.5,
  };
} 