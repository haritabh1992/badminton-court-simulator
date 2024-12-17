export interface PlayerPosition {
  x: number;
  y: number;
}

export interface TeamPositions {
  team1: PlayerPosition[];
  team2: PlayerPosition[];
}

export interface CourtDimensions {
  width: number;
  height: number;
} 