import { TeamPositions, PlayerPosition } from '../types/game';
import { PositionState } from '../types/positions';

interface PositionChanges {
  team1: boolean[];
  team2: boolean[];
  shuttle: boolean;
}

export function createLastStationaryPositions(players: TeamPositions, shuttle: PlayerPosition) {
  return {
    team1: [...players.team1],
    team2: [...players.team2],
    shuttle: { ...shuttle },
  };
}

export function findChangedPositions(newState: PositionState, currentState: PositionState): PositionChanges {
  return {
    team1: newState.players.team1.map((pos, idx) => 
      pos !== currentState.players.team1[idx]),
    team2: newState.players.team2.map((pos, idx) => 
      pos !== currentState.players.team2[idx]),
    shuttle: newState.shuttle !== currentState.shuttle,
  };
} 