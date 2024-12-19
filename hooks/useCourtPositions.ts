import { useCallback, useState } from 'react';
import { TeamPositions, CourtDimensions, PlayerPosition } from '../types/game';

interface PositionState {
  players: TeamPositions;
  shuttle: PlayerPosition;
}

export function useCourtPositions(courtDimensions: CourtDimensions) {
  const [isDoubles, setIsDoubles] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positionHistory, setPositionHistory] = useState<PositionState[]>([]);
  const [tempPosition, setTempPosition] = useState<PositionState | null>(null);

  const getInitialPositions = useCallback((isDoublesMode: boolean): TeamPositions => {
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
  }, [courtDimensions]);

  // Initialize state with first position
  useState(() => {
    const initialPlayers = getInitialPositions(isDoubles);
    const initialShuttle = {
      x: courtDimensions.width * 0.5,
      y: courtDimensions.height * 0.5,
    };
    setPositionHistory([{ players: initialPlayers, shuttle: initialShuttle }]);
  });

  const addToHistory = (players: TeamPositions, shuttle: PlayerPosition) => {
    setPositionHistory(prev => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { players, shuttle }];
    });
    setCurrentIndex(prev => prev + 1);
  };

  const updatePlayerPosition = (team: 'team1' | 'team2', index: number, newPosition: PlayerPosition) => {
    const newPlayers = {
      ...positionHistory[currentIndex].players,
      [team]: positionHistory[currentIndex].players[team].map((pos, i) => 
        i === index ? newPosition : pos
      ),
    };
    // Just update temp position during movement
    setTempPosition({
      players: newPlayers,
      shuttle: positionHistory[currentIndex].shuttle,
    });
  };

  const updateShuttlePosition = (newPosition: PlayerPosition) => {
    // Just update temp position during movement
    setTempPosition({
      players: positionHistory[currentIndex].players,
      shuttle: newPosition,
    });
  };

  const handlePositionChangeComplete = () => {
    if (tempPosition) {
      // Add to history only when movement ends
      setPositionHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, tempPosition];
      });
      setCurrentIndex(prev => prev + 1);
      setTempPosition(null);
    }
  };

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < positionHistory.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, positionHistory.length]);

  const resetPositions = useCallback(() => {
    const initialPlayers = getInitialPositions(isDoubles);
    const initialShuttle = {
      x: courtDimensions.width * 0.5,
      y: courtDimensions.height * 0.5,
    };
    setPositionHistory([{ players: initialPlayers, shuttle: initialShuttle }]);
    setCurrentIndex(0);
  }, [isDoubles, getInitialPositions, courtDimensions]);

  const toggleGameMode = (value: boolean) => {
    setIsDoubles(value);
    const newPlayers = getInitialPositions(value);
    const initialShuttle = {
      x: courtDimensions.width * 0.5,
      y: courtDimensions.height * 0.5,
    };
    setPositionHistory([{ players: newPlayers, shuttle: initialShuttle }]);
    setCurrentIndex(0);
  };

  return {
    isDoubles,
    playerPositions: tempPosition?.players || positionHistory[currentIndex]?.players || getInitialPositions(isDoubles),
    shuttlePosition: tempPosition?.shuttle || positionHistory[currentIndex]?.shuttle || {
      x: courtDimensions.width * 0.5,
      y: courtDimensions.height * 0.5,
    },
    updatePlayerPosition,
    updateShuttlePosition,
    handlePositionChangeComplete,
    toggleGameMode,
    resetPositions,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < positionHistory.length - 1,
  };
} 