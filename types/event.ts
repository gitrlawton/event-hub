export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  category: EventCategory;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  imageUrl: string;
  tags: string[];
  isOnline: boolean;
  rsvpStatus: 'not-registered' | 'registered' | 'waitlist';
  featured: boolean;
}

export type EventCategory = 
  | 'conference'
  | 'workshop'
  | 'meetup'
  | 'hackathon'
  | 'webinar'
  | 'networking';

export interface EventFilters {
  category?: EventCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  isOnline?: boolean;
}