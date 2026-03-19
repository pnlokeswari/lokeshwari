export interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
  emoji: string;
}

export interface WorldClockState {
  addedCities: City[];
  baseTime: Date;
  isConverterActive: boolean;
}
