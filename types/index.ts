export type TrophyColor = "gold" | "silver" | "bronze" | string;

export interface House {
  name: string;
  color: string;
  points: number;
  layatharang: number;
  chakravyuh: number;
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

export interface LayatharangData {
  event: string;
  firstName: string | null;
  firstHouse: string | null;
  secondName: string | null;
  secondHouse: string | null;
  thirdName: string | null;
  thirdHouse: string | null;
  filteredHouse?: string | null;
  filteredPositions?: string[];
}

export interface ChakravyuhData {
  event: string;
  firstName: string | null;
  firstHouse: string | null;
  secondName: string | null;
  secondHouse: string | null;
  thirdName: string | null;
  thirdHouse: string | null;
  filteredHouse?: string | null;
  filteredPositions?: string[];
}
