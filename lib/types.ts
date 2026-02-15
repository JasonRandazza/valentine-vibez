export type UserMood = 'Chill' | 'Adventurous' | 'Romantic' | 'Funny';
export type PartnerMood = 'Chill' | 'Adventurous' | 'Romantic' | 'Funny';
export type Weather = 'Sunny' | 'Rainy' | 'Cold' | 'Snowy';

export interface DatePlan {
  title: string;
  description: string;
  location_vibe: string;
  music_link: string;
  food_suggestion: string;
  vibeCheck: string;
}
