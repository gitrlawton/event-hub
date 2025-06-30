import { User } from '@/types/user';

// Mock users database - in a real app, this would be in a database
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    bio: 'Passionate software engineer and tech community enthusiast. Love attending conferences and workshops to stay updated with the latest trends.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    github: 'johndoe',
    linkedin: 'johndoe',
    twitter: '@johndoe',
    phone: '+1 (555) 123-4567',
    joinDate: new Date('2023-01-15'),
    company: 'Meta',
    role: 'Senior Software Engineer',
    eventsCreated: 3,
    eventsAttended: 24,
    totalConnections: 156,
    interests: ['React', 'AI/ML', 'Cloud Computing', 'Startups', 'Product Management'],
    verified: true,
    
    // Engagement System Fields
    xp: 40,
    rank: 'Connector',
    badges: ['first-event'],
    eventsPosted: 3,
    streakCount: 2,
    lastPostDate: new Date('2025-01-10'),
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@google.com',
    avatar: '',
    bio: 'Machine Learning Engineer at Google with a passion for AI research and education. I organize workshops to help others learn about TensorFlow and deep learning.',
    location: 'Mountain View, CA',
    website: 'https://sarahchen.ai',
    github: 'sarahchen',
    linkedin: 'sarah-chen-ml',
    twitter: '@sarahchen_ai',
    company: 'Google',
    role: 'ML Engineer',
    eventsCreated: 8,
    eventsAttended: 32,
    totalConnections: 289,
    interests: ['Machine Learning', 'TensorFlow', 'AI Research', 'Data Science', 'Python'],
    verified: true,
    joinDate: new Date('2022-03-10'),
    
    // Engagement System Fields
    xp: 115,
    rank: 'Community Builder',
    badges: ['first-event', 'event-cadence'],
    eventsPosted: 8,
    streakCount: 5,
    lastPostDate: new Date('2025-01-12'),
  },
  {
    id: 'user-3',
    name: 'Mike Rodriguez',
    email: 'mike@wework.com',
    avatar: '',
    bio: 'Community Manager at WeWork, passionate about bringing tech professionals together. I love organizing networking events and building connections.',
    location: 'New York, NY',
    website: 'https://mikerodr.com',
    github: 'mikerodriguez',
    linkedin: 'mike-rodriguez-community',
    twitter: '@mike_networks',
    company: 'WeWork',
    role: 'Community Manager',
    eventsCreated: 15,
    eventsAttended: 67,
    totalConnections: 445,
    interests: ['Networking', 'Community Building', 'Startups', 'Real Estate Tech', 'Event Planning'],
    verified: true,
    joinDate: new Date('2021-08-22'),
    
    // Engagement System Fields
    xp: 185,
    rank: 'Event Champion',
    badges: ['first-event', 'event-cadence', 'super-host'],
    eventsPosted: 15,
    streakCount: 8,
    lastPostDate: new Date('2025-01-11'),
  },
  {
    id: 'user-4',
    name: 'Alex Thompson',
    email: 'alex@coinbase.com',
    avatar: '',
    bio: 'Blockchain developer and crypto enthusiast. I organize hackathons and educational events to promote blockchain adoption and innovation.',
    location: 'Austin, TX',
    website: 'https://alexthompson.crypto',
    github: 'alexthompson',
    linkedin: 'alex-thompson-blockchain',
    twitter: '@alex_crypto',
    company: 'Coinbase',
    role: 'Senior Blockchain Developer',
    eventsCreated: 6,
    eventsAttended: 28,
    totalConnections: 198,
    interests: ['Blockchain', 'Cryptocurrency', 'DeFi', 'Smart Contracts', 'Web3'],
    verified: true,
    joinDate: new Date('2022-11-05'),
    
    // Engagement System Fields
    xp: 65,
    rank: 'Connector',
    badges: ['first-event', 'event-cadence'],
    eventsPosted: 6,
    streakCount: 3,
    lastPostDate: new Date('2025-01-09'),
  },
  {
    id: 'user-5',
    name: 'Emma Wilson',
    email: 'emma@adobe.com',
    avatar: '',
    bio: 'Senior UX Designer at Adobe with 8+ years of experience. I conduct design workshops and webinars to share knowledge about user-centered design.',
    location: 'San Jose, CA',
    website: 'https://emmawilson.design',
    github: 'emmawilson',
    linkedin: 'emma-wilson-ux',
    twitter: '@emma_designs',
    company: 'Adobe',
    role: 'Senior UX Designer',
    eventsCreated: 12,
    eventsAttended: 45,
    totalConnections: 334,
    interests: ['UX Design', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    verified: true,
    joinDate: new Date('2020-06-18'),
    
    // Engagement System Fields
    xp: 135,
    rank: 'Community Builder',
    badges: ['first-event', 'event-cadence', 'super-host'],
    eventsPosted: 12,
    streakCount: 4,
    lastPostDate: new Date('2025-01-08'),
  },
];

// Function to get user by name (organizer name)
export function getUserByName(name: string): User | null {
  return mockUsers.find(user => user.name === name) || null;
}

// Function to get user by ID
export function getUserById(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null;
}

// Function to get all users
export function getAllUsers(): User[] {
  return mockUsers;
}

// Function to search users
export function searchUsers(query: string): User[] {
  const queryLower = query.toLowerCase();
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(queryLower) ||
    user.company.toLowerCase().includes(queryLower) ||
    user.role.toLowerCase().includes(queryLower) ||
    user.interests.some(interest => interest.toLowerCase().includes(queryLower))
  );
}