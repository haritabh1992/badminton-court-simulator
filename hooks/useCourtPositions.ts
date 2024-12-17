import { useCallback, useState } from 'react';
import { TeamPositions, CourtDimensions, PlayerPosition } from '../types/game';

export function useCourtPositions(courtDimensions: CourtDimensions) {
  const [isDoubles, setIsDoubles] = useState(false);
  const [shuttlePosition, setShuttlePosition] = useState<PlayerPosition>({
    x: courtDimensions.width * 0.5,
    y: courtDimensions.height * 0.5,
  });
  
  const getInitialPositions = useCallback((isDoublesMode: boolean): TeamPositions => {
    const leftOffset = courtDimensions.width * 0.25;
    const rightOffset = courtDimensions.width * 0.75;
    const frontY = courtDimensions.height * 0.3;
    const backY = courtDimensions.height * 0.7;

    if (isDoublesMode) {
      return {
        team1: [
          { x: leftOffset, y: frontY },  // Left front
          { x: leftOffset, y: backY },   // Left back
        ],
        team2: [
          { x: rightOffset, y: backY },  // Right back
          { x: rightOffset, y: frontY }, // Right front
        ],
      };
    }
    return {
      team1: [{ x: leftOffset, y: frontY }],  // Left front
      team2: [{ x: rightOffset, y: backY }],  // Right back
    };
  }, [courtDimensions]);

  const [playerPositions, setPlayerPositions] = useState<TeamPositions>(() => 
    getInitialPositions(isDoubles)
  );

  const resetPositions = useCallback(() => {
    setPlayerPositions(getInitialPositions(isDoubles));
    setShuttlePosition({
      x: courtDimensions.width * 0.5,
      y: courtDimensions.height * 0.5,
    });
  }, [isDoubles, getInitialPositions, courtDimensions]);

  const updatePlayerPosition = (team: 'team1' | 'team2', index: number, newPosition: PlayerPosition) => {
    setPlayerPositions(prev => ({
      ...prev,
      [team]: prev[team].map((pos, i) => i === index ? newPosition : pos),
    }));
  };

  const updateShuttlePosition = (newPosition: PlayerPosition) => {
    setShuttlePosition(newPosition);
  };

  const toggleGameMode = (value: boolean) => {
    setIsDoubles(value);
    setPlayerPositions(getInitialPositions(value));
  };

  return {
    isDoubles,
    playerPositions,
    shuttlePosition,
    updatePlayerPosition,
    updateShuttlePosition,
    toggleGameMode,
    resetPositions,
  };
} 