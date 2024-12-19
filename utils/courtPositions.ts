import { TeamPositions, CourtDimensions, PlayerPosition } from '../types/game';

export function getInitialPositions(isDoublesMode: boolean, courtDimensions: CourtDimensions): TeamPositions {
  const topOffset = courtDimensions.height * -0.02;
  const bottomOffset = courtDimensions.height * 1.02;
  const leftX = courtDimensions.width * 0.4;
  const rightX = courtDimensions.width * 0.6;

  if (isDoublesMode) {
    return {
      team1: [
        { x: leftX, y: topOffset },    // Top left
        { x: rightX, y: topOffset },   // Top right
      ],
      team2: [
        { x: rightX, y: bottomOffset }, // Bottom right
        { x: leftX, y: bottomOffset },  // Bottom left
      ],
    };
  }
  return {
    team1: [{ x: leftX, y: topOffset }],     // Top left
    team2: [{ x: rightX, y: bottomOffset }], // Bottom right
  };
}

export function getInitialShuttle(courtDimensions: CourtDimensions): PlayerPosition {
  return {
    x: courtDimensions.width * 0.5,
    y: courtDimensions.height * 0.5,
  };
} 