import { City } from './types';

export const ALL_CITIES: City[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', emoji: '🇬🇧' },
  { id: 'new-york', name: 'New York', country: 'USA', timezone: 'America/New_York', emoji: '🗽' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', emoji: '🗼' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', emoji: '🦘' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', emoji: '🐫' },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', emoji: '🥐' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', emoji: '🥨' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', emoji: '🦁' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', emoji: '🐘' },
  { id: 'san-francisco', name: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles', emoji: '🌉' },
  { id: 'chicago', name: 'Chicago', country: 'USA', timezone: 'America/Chicago', emoji: '🍕' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', emoji: '🍁' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', emoji: '⚽' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', emoji: '🥟' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', emoji: '🥢' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', emoji: '🥭' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', emoji: '☕' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', emoji: '🏜️' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', emoji: '🦁' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', emoji: '🌮' },
];

export const DEFAULT_CITIES = ['london', 'new-york', 'tokyo', 'san-francisco'];
