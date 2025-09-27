// TypeScript types for Event model

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  category: string;
  imageUrl?: string;
  price?: number;
  organizer: string;
  attendeeCount: number;
  maxAttendees?: number;
  tags: string[];
  ageRestriction?: string; // Optional age restriction like "18+", "21+", etc.
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}