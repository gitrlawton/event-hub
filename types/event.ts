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
  company: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  imageUrl: string;
  originalUrl?: string; // URL to the original event listing
  foodAvailable?: boolean; // Whether food is available at the event
  swagAvailable?: boolean; // Whether swag/gifts are available at the event
  tags: string[];
  isOnline: boolean;
  rsvpStatus: "not-registered" | "registered" | "waitlist";
  featured: boolean;
  status: "pending" | "approved" | "rejected";
  attendeeIds: string[]; // Array of user IDs who are attending
}

export type EventCategory =
  | "conference"
  | "workshop"
  | "meetup"
  | "hackathon"
  | "webinar"
  | "networking";

export type TechDomain =
  | "software-engineering"
  | "data-science"
  | "ai-ml"
  | "cybersecurity"
  | "product-management"
  | "biotech"
  | "fintech"
  | "ui-ux";

export interface EventFilters {
  category?: EventCategory;
  domain?: TechDomain;
  company?: string;
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
