export interface MoodRating {
  id: string;
  dateStr: string;         // YYYY-MM-DD
  rating: number;          // 1 to 9
  scaleImage: string;      // filename
  timestamp: number;       // Date.now()
}

export interface MoodState {
  usedMoodScales: string[];
  history: MoodRating[];
}
