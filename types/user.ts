export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  phone?: string;
  joinDate: Date;
  company: string;
  role: string;
  eventsCreated: number;
  eventsAttended: number;
  totalConnections: number;
  interests: string[];
  verified: boolean;
}