export interface MoodRating {
  dateStr: string; // YYYY-MM-DD
  rating: number; // 1 to 9
  scaleImage: string; // filename
  timestamp: number; // Date.now()
}
