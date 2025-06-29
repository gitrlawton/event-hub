import { Event, EventCategory, TechDomain } from '@/types/event';

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'React Summit 2024',
    description: 'The biggest React conference of the year featuring industry leaders sharing insights on the latest React trends, performance optimization, and future developments.',
    date: new Date('2025-01-15'),
    startTime: '09:00',
    endTime: '18:00',
    location: 'San Francisco',
    venue: 'Moscone Center',
    category: 'conference',
    organizer: 'React Community',
    attendees: 847,
    maxAttendees: 1000,
    price: 299,
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    tags: ['React', 'JavaScript', 'Frontend'],
    isOnline: false,
    rsvpStatus: 'not-registered',
    featured: true,
    status: 'approved',
  },
  {
    id: '2',
    title: 'AI/ML Workshop: Building with TensorFlow',
    description: 'Hands-on workshop covering machine learning fundamentals and practical TensorFlow implementation for real-world applications.',
    date: new Date('2025-01-16'),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Virtual',
    venue: 'Virtual Event',
    category: 'workshop',
    organizer: 'TensorFlow Community',
    attendees: 234,
    maxAttendees: 300,
    price: 79,
    imageUrl: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
    tags: ['AI', 'Machine Learning', 'TensorFlow'],
    isOnline: true,
    rsvpStatus: 'registered',
    featured: false,
    status: 'approved',
  },
  {
    id: '3',
    title: 'Tech Startup Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and tech professionals in a relaxed networking environment with refreshments and lightning talks.',
    date: new Date('2025-01-18'),
    startTime: '18:00',
    endTime: '21:00',
    location: 'New York',
    venue: 'WeWork Hudson Yards',
    category: 'networking',
    organizer: 'NYC Tech Meetup',
    attendees: 156,
    maxAttendees: 200,
    price: 0,
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
    tags: ['Networking', 'Startups', 'Business'],
    isOnline: false,
    rsvpStatus: 'not-registered',
    featured: true,
    status: 'approved',
  },
  {
    id: '4',
    title: 'Blockchain Hackathon 2024',
    description: '48-hour intensive hackathon focused on building innovative blockchain solutions with mentorship from industry experts and exciting prizes.',
    date: new Date('2025-01-22'),
    startTime: '09:00',
    endTime: '18:00',
    location: 'Austin',
    venue: 'Austin Convention Center',
    category: 'hackathon',
    organizer: 'Blockchain Association',
    attendees: 89,
    maxAttendees: 150,
    price: 25,
    imageUrl: 'https://images.pexels.com/photos/5952651/pexels-photo-5952651.jpeg',
    tags: ['Blockchain', 'Cryptocurrency', 'Development'],
    isOnline: false,
    rsvpStatus: 'waitlist',
    featured: false,
    status: 'approved',
  },
  {
    id: '5',
    title: 'UX/UI Design Principles Webinar',
    description: 'Learn modern design principles, user research methodologies, and prototyping techniques from senior designers at top tech companies.',
    date: new Date('2025-01-20'),
    startTime: '14:00',
    endTime: '15:30',
    location: 'Online',
    venue: 'Zoom Virtual Event',
    category: 'webinar',
    organizer: 'Design Community',
    attendees: 342,
    maxAttendees: 500,
    price: 0,
    imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    tags: ['UX', 'UI', 'Design'],
    isOnline: true,
    rsvpStatus: 'registered',
    featured: true,
    status: 'approved',
  },
  {
    id: '6',
    title: 'Local JavaScript Meetup',
    description: 'Monthly gathering of JavaScript developers discussing latest frameworks, best practices, and sharing project experiences over pizza and drinks.',
    date: new Date('2025-01-25'),
    startTime: '19:00',
    endTime: '21:30',
    location: 'Seattle',
    venue: 'Microsoft Campus',
    category: 'meetup',
    organizer: 'Seattle JS',
    attendees: 67,
    maxAttendees: 80,
    price: 0,
    imageUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    tags: ['JavaScript', 'Web Development', 'Community'],
    isOnline: false,
    rsvpStatus: 'not-registered',
    featured: false,
    status: 'approved',
  },
  {
    id: '7',
    title: 'Cloud Computing Summit',
    description: 'Explore the latest in cloud technologies, serverless architectures, and DevOps practices with industry experts from AWS, Azure, and Google Cloud.',
    date: new Date('2025-01-28'),
    startTime: '09:00',
    endTime: '17:00',
    location: 'San Francisco',
    venue: 'Salesforce Tower',
    category: 'conference',
    organizer: 'Cloud Native Foundation',
    attendees: 523,
    maxAttendees: 600,
    price: 199,
    imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
    tags: ['Cloud', 'DevOps', 'AWS', 'Azure'],
    isOnline: false,
    rsvpStatus: 'not-registered',
    featured: true,
    status: 'approved',
  },
  {
    id: '8',
    title: 'Data Science Bootcamp',
    description: 'Intensive 3-day bootcamp covering Python, pandas, machine learning, and data visualization techniques for beginners and intermediate practitioners.',
    date: new Date('2025-01-30'),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Boston',
    venue: 'MIT Campus',
    category: 'workshop',
    organizer: 'Data Science Institute',
    attendees: 45,
    maxAttendees: 50,
    price: 399,
    imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    tags: ['Data Science', 'Python', 'Machine Learning'],
    isOnline: false,
    rsvpStatus: 'registered',
    featured: false,
    status: 'approved',
  },
  {
    id: '9',
    title: 'Cybersecurity Workshop: Ethical Hacking',
    description: 'Learn penetration testing, vulnerability assessment, and ethical hacking techniques in this hands-on cybersecurity workshop.',
    date: new Date('2025-02-03'),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Online',
    venue: 'Virtual Lab Environment',
    category: 'workshop',
    organizer: 'CyberSec Academy',
    attendees: 78,
    maxAttendees: 100,
    price: 149,
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
    tags: ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing'],
    isOnline: true,
    rsvpStatus: 'not-registered',
    featured: true,
    status: 'approved',
  },
  {
    id: '10',
    title: 'Product Management Masterclass',
    description: 'Strategic product management session covering roadmap planning, user research, metrics, and stakeholder management for tech products.',
    date: new Date('2025-02-05'),
    startTime: '13:00',
    endTime: '18:00',
    location: 'San Francisco',
    venue: 'Google Campus',
    category: 'workshop',
    organizer: 'Product School',
    attendees: 92,
    maxAttendees: 120,
    price: 249,
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    tags: ['Product Management', 'Strategy', 'User Research'],
    isOnline: false,
    rsvpStatus: 'waitlist',
    featured: false,
    status: 'approved',
  },
  {
    id: '11',
    title: 'Mobile App Development Workshop',
    description: 'Build cross-platform mobile apps using React Native and Flutter. Hands-on coding session with deployment to app stores.',
    date: new Date('2025-02-08'),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Los Angeles',
    venue: 'UCLA Extension',
    category: 'workshop',
    organizer: 'Mobile Dev Community',
    attendees: 134,
    maxAttendees: 150,
    price: 179,
    imageUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
    tags: ['Mobile Development', 'React Native', 'Flutter'],
    isOnline: false,
    rsvpStatus: 'not-registered',
    featured: true,
    status: 'approved',
  },
  {
    id: '12',
    title: 'Fintech Innovation Summit',
    description: 'Explore the future of financial technology, cryptocurrency, DeFi, and digital banking with industry leaders and innovators.',
    date: new Date('2025-02-12'),
    startTime: '09:00',
    endTime: '18:00',
    location: 'New York',
    venue: 'Wall Street Conference Center',
    category: 'conference',
    organizer: 'Fintech Association',
    attendees: 678,
    maxAttendees: 800,
    price: 349,
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
    tags: ['Fintech', 'Cryptocurrency', 'DeFi', 'Banking'],
    isOnline: false,
    rsvpStatus: 'registered',
    featured: true,
    status: 'approved',
  },
];

// Store for user-created events (in a real app, this would be in a database)
let userCreatedEvents: Event[] = [];

export const eventCategories: { value: EventCategory; label: string; color: string }[] = [
  { value: 'conference', label: 'Conference', color: 'bg-blue-500' },
  { value: 'workshop', label: 'Workshop', color: 'bg-orange-500' },
  { value: 'meetup', label: 'Meetup', color: 'bg-purple-500' },
  { value: 'hackathon', label: 'Hackathon', color: 'bg-red-500' },
  { value: 'webinar', label: 'Webinar', color: 'bg-pink-500' },
  { value: 'networking', label: 'Networking', color: 'bg-teal-500' },
];

export const techDomains: { value: TechDomain; label: string; color: string; icon: string }[] = [
  { value: 'software-engineering', label: 'Software Engineering', color: 'bg-blue-500 hover:bg-blue-600', icon: 'Code' },
  { value: 'data-science', label: 'Data Science', color: 'bg-green-500 hover:bg-green-600', icon: 'BarChart3' },
  { value: 'ai-ml', label: 'AI / Machine Learning', color: 'bg-purple-500 hover:bg-purple-600', icon: 'Brain' },
  { value: 'cybersecurity', label: 'Cybersecurity', color: 'bg-red-500 hover:bg-red-600', icon: 'Shield' },
  { value: 'product-management', label: 'Product Management', color: 'bg-orange-500 hover:bg-orange-600', icon: 'Target' },
  { value: 'biotech', label: 'Biotech', color: 'bg-teal-500 hover:bg-teal-600', icon: 'Dna' },
  { value: 'fintech', label: 'Fintech', color: 'bg-emerald-500 hover:bg-emerald-600', icon: 'DollarSign' },
  { value: 'ui-ux', label: 'UI / UX', color: 'bg-pink-500 hover:bg-pink-600', icon: 'Palette' },
];

export function getEventsByDate(events: Event[], date: Date): Event[] {
  return events.filter(event => 
    event.date.toDateString() === date.toDateString()
  );
}

export function getEventsInDateRange(events: Event[], start: Date, end: Date): Event[] {
  return events.filter(event => 
    event.date >= start && event.date <= end
  );
}

export function filterEvents(events: Event[], filters: Partial<{ 
  category: EventCategory; 
  domain: TechDomain;
  isOnline: boolean; 
  search: string 
}>): Event[] {
  return events.filter(event => {
    if (filters.category && event.category !== filters.category) return false;
    if (filters.isOnline !== undefined && event.isOnline !== filters.isOnline) return false;
    
    // Domain filtering logic
    if (filters.domain) {
      const domainKeywords = {
        'software-engineering': ['react', 'javascript', 'web development', 'frontend', 'backend', 'development', 'programming', 'coding', 'cloud', 'devops', 'mobile development'],
        'data-science': ['data', 'analytics', 'visualization', 'statistics', 'analysis', 'insights', 'metrics', 'data science', 'python', 'machine learning'],
        'ai-ml': ['ai', 'machine learning', 'tensorflow', 'neural', 'deep learning', 'artificial intelligence', 'ml'],
        'cybersecurity': ['security', 'privacy', 'encryption', 'blockchain', 'cyber', 'protection', 'vulnerability', 'cybersecurity', 'ethical hacking', 'penetration testing'],
        'product-management': ['product', 'strategy', 'roadmap', 'management', 'planning', 'growth', 'product management', 'user research'],
        'biotech': ['biotech', 'biotechnology', 'genomics', 'bioinformatics', 'healthcare', 'medical', 'biology', 'pharma'],
        'fintech': ['fintech', 'finance', 'banking', 'payments', 'cryptocurrency', 'blockchain', 'trading', 'investment', 'defi'],
        'ui-ux': ['ux', 'ui', 'design', 'user experience', 'user interface', 'prototyping', 'research', 'usability']
      };
      
      const keywords = domainKeywords[filters.domain] || [];
      const matchesDomain = keywords.some(keyword => 
        event.title.toLowerCase().includes(keyword) ||
        event.description.toLowerCase().includes(keyword) ||
        event.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
      
      if (!matchesDomain) return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });
}

// Function to create a new event
export function createEvent(eventData: Omit<Event, 'id' | 'attendees' | 'rsvpStatus' | 'featured' | 'status'>): Event {
  const newEvent: Event = {
    ...eventData,
    id: `user-event-${Date.now()}`,
    attendees: 0,
    rsvpStatus: 'not-registered',
    featured: false,
    status: 'pending',
  };
  
  userCreatedEvents.push(newEvent);
  return newEvent;
}

// Function to get user's created events
export function getUserCreatedEvents(): Event[] {
  return userCreatedEvents;
}

// Function to approve an event (adds it to main events list but keeps it in user's created list)
export function approveEvent(eventId: string): void {
  const event = userCreatedEvents.find(event => event.id === eventId);
  if (event) {
    // Update the status to approved
    event.status = 'approved';
    // Add to main events list for public visibility
    sampleEvents.push({ ...event });
  }
}

// Function to get all publicly visible events (only approved events)
export function getAllEvents(): Event[] {
  return [...sampleEvents, ...userCreatedEvents.filter(event => event.status === 'approved')];
}

// Function to get pending events for admin
export function getPendingEvents(): Event[] {
  return userCreatedEvents.filter(event => event.status === 'pending');
}