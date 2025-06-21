import { Event, EventCategory } from '@/types/event';

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'React Summit 2024',
    description: 'The biggest React conference of the year featuring industry leaders sharing insights on the latest React trends, performance optimization, and future developments.',
    date: new Date('2024-03-15'),
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
  },
  {
    id: '2',
    title: 'AI/ML Workshop: Building with TensorFlow',
    description: 'Hands-on workshop covering machine learning fundamentals and practical TensorFlow implementation for real-world applications.',
    date: new Date('2024-03-16'),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Online',
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
  },
  {
    id: '3',
    title: 'Tech Startup Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and tech professionals in a relaxed networking environment with refreshments and lightning talks.',
    date: new Date('2024-03-18'),
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
  },
  {
    id: '4',
    title: 'Blockchain Hackathon 2024',
    description: '48-hour intensive hackathon focused on building innovative blockchain solutions with mentorship from industry experts and exciting prizes.',
    date: new Date('2024-03-22'),
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
  },
  {
    id: '5',
    title: 'UX/UI Design Principles Webinar',
    description: 'Learn modern design principles, user research methodologies, and prototyping techniques from senior designers at top tech companies.',
    date: new Date('2024-03-20'),
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
  },
  {
    id: '6',
    title: 'Local JavaScript Meetup',
    description: 'Monthly gathering of JavaScript developers discussing latest frameworks, best practices, and sharing project experiences over pizza and drinks.',
    date: new Date('2024-03-25'),
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
  },
];

export const eventCategories: { value: EventCategory; label: string; color: string }[] = [
  { value: 'conference', label: 'Conference', color: 'bg-blue-500' },
  { value: 'workshop', label: 'Workshop', color: 'bg-green-500' },
  { value: 'meetup', label: 'Meetup', color: 'bg-purple-500' },
  { value: 'hackathon', label: 'Hackathon', color: 'bg-red-500' },
  { value: 'webinar', label: 'Webinar', color: 'bg-yellow-500' },
  { value: 'networking', label: 'Networking', color: 'bg-indigo-500' },
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

export function filterEvents(events: Event[], filters: Partial<{ category: EventCategory; isOnline: boolean; search: string }>): Event[] {
  return events.filter(event => {
    if (filters.category && event.category !== filters.category) return false;
    if (filters.isOnline !== undefined && event.isOnline !== filters.isOnline) return false;
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