export type TrophyColor = "gold" | "silver" | "bronze" | string;

export interface House {
  name: string;
  color: string;
  points: number;
  rank?: number;
}

export interface ModelViewerProps {
  position: number;
  house: string;
}

export interface NumberProps {
  color: TrophyColor;
}

export interface RotatingNumberProps {
  number: string;
  color: TrophyColor;
}
