
export type Mood = 'Radiant' | 'Happy' | 'Neutral' | 'Sad' | 'Awful' | 'Excited' | 'Party' | 'Loved' | 'Calm';

export interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  time?: string;
  imageUrl: string;
  mood?: Mood;
  type: 'event' | 'location' | 'restaurant';
  tags?: string[];
}

export interface Habit {
  id: string;
  title: string;
  goal: string;
  current: number;
  total: number;
  icon: string;
  color: string;
}

export type AppTab = 'home' | 'journal' | 'live' | 'stats' | 'profile';

export enum Modality {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO'
}
