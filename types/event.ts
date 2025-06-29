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
  status: 'pending' | 'approved' | 'rejected';
}

export type EventCategory = 
  | 'conference'
  | 'workshop'
  | 'meetup'
  | 'hackathon'
  | 'webinar'
  | 'networking';

export type TechDomain = 
  | 'software-engineering'
  | 'data-science'
  | 'ai-ml'
  | 'cybersecurity'
  | 'product-management'
  | 'biotech'
  | 'fintech'
  | 'ui-ux';

export interface EventFilters {
  category?: EventCategory;
  domain?: TechDomain;
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