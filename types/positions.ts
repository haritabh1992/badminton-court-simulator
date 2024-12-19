import { TeamPositions, PlayerPosition } from './game';

export interface LastStationaryPositions {
  team1: PlayerPosition[];
  team2: PlayerPosition[];
  shuttle: PlayerPosition;
}

export interface PositionState {
  players: TeamPositions;
  shuttle: PlayerPosition;
  lastStationaryPositions?: LastStationaryPositions;
} 