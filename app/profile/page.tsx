'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import { User } from '@/types/user';
import { sampleEvents, getUserCreatedEvents } from '@/lib/events';
import { getFollowing } from '@/lib/following';
import { getAllUsers } from '@/lib/users';
import { Header } from '@/components/layout/header';
import { EventCard } from '@/components/event/event-card';
import { EventDetailModal } from '@/components/event/event-detail-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User as UserIcon,
  Settings,
  LogOut,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Edit3,
  Plus,
  MoreHorizontal,
  Grid3X3,
  List,
  Trophy,
  TrendingUp,
  Heart,
  Share2,
  Camera,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Building2,
  Briefcase,
  ExternalLink,
  X,
  Sparkles,
  Award,
  Crown,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock user data - in a real app, this would come from authentication context
const mockUser = {
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
  eventsAttended: 24,
  eventsCreated: 3,
  totalConnections: 156,
  interests: ['React', 'AI/ML', 'Cloud Computing', 'Startups', 'Product Management'],
};

// Available companies for selection
const availableCompanies = [
  { name: 'Google', description: 'Leading AI and cloud innovation', events: 8 },
  { name: 'Meta', description: 'Social media and VR pioneer', events: 5 },
  { name: 'Microsoft', description: 'Enterprise and developer tools', events: 6 },
  { name: 'Apple', description: 'Consumer technology leader', events: 3 },
  { name: 'Amazon', description: 'Cloud computing and e-commerce', events: 7 },
  { name: 'Netflix', description: 'Streaming and entertainment tech', events: 4 },
  { name: 'Tesla', description: 'Electric vehicles and energy', events: 2 },
  { name: 'Spotify', description: 'Music streaming technology', events: 3 },
];

export default function ProfilePage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('registered');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [attendedEventsModalOpen, setAttendedEventsModalOpen] = useState(false);
  const [createdEventsModalOpen, setCreatedEventsModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  
  // Highlights state
  const [highlightedCompanies, setHighlightedCompanies] = useState([
    { name: 'Google', description: 'Leading AI and cloud innovation', events: 8, following: true },
    { name: 'Meta', description: 'Social media and VR pioneer', events: 5, following: true },
    { name: 'Microsoft', description: 'Enterprise and developer tools', events: 6, following: false },
  ]);
  const [highlightedUsers, setHighlightedUsers] = useState(['user-2', 'user-3', 'user-4']);
  const [highlightedEvents, setHighlightedEvents] = useState(['1', '2', '3']);
  
  // Modal states for adding highlights
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  
  const [editForm, setEditForm] = useState({
    name: mockUser.name,
    bio: mockUser.bio,
    location: mockUser.location,
    website: mockUser.website,
    github: mockUser.github,
    linkedin: mockUser.linkedin,
    twitter: mockUser.twitter,
    phone: mockUser.phone,
  });
  const router = useRouter();

  // Filter events based on user's registration status
  const registeredEvents = useMemo(() => {
    return sampleEvents.filter(event => event.rsvpStatus === 'registered');
  }, []);

  // Get user's created events (including pending ones)
  const createdEvents = useMemo(() => {
    return getUserCreatedEvents();
  }, []);

  // Get users that current user is following
  const followingUsers = useMemo(() => {
    return getFollowing(mockUser.id);
  }, []);

  // Get all users for selection
  const allUsers = useMemo(() => {
    return getAllUsers().filter(user => user.id !== mockUser.id); // Exclude current user
  }, []);

  // Get highlighted user objects
  const highlightedUserObjects = useMemo(() => {
    return highlightedUsers.map(userId => allUsers.find(user => user.id === userId)).filter(Boolean) as User[];
  }, [highlightedUsers, allUsers]);

  // Get highlighted event objects
  const highlightedEventObjects = useMemo(() => {
    return highlightedEvents.map(eventId => sampleEvents.find(event => event.id === eventId)).filter(Boolean) as Event[];
  }, [highlightedEvents]);

  // Filtered data for search
  const filteredCompanies = useMemo(() => {
    return availableCompanies.filter(company => 
      company.name.toLowerCase().includes(companySearchQuery.toLowerCase()) &&
      !highlightedCompanies.some(hc => hc.name === company.name)
    );
  }, [companySearchQuery, highlightedCompanies]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => 
      (user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
       user.company.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
       user.role.toLowerCase().includes(userSearchQuery.toLowerCase())) &&
      !highlightedUsers.includes(user.id)
    );
  }, [userSearchQuery, highlightedUsers, allUsers]);

  const filteredEvents = useMemo(() => {
    return sampleEvents.filter(event => 
      (event.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
       event.company.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
       event.description.toLowerCase().includes(eventSearchQuery.toLowerCase())) &&
      !highlightedEvents.includes(event.id)
    );
  }, [eventSearchQuery, highlightedEvents]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleRSVP = (eventId: string) => {
    console.log('RSVP to event:', eventId);
  };

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: mockUser.name,
      bio: mockUser.bio,
      location: mockUser.location,
      website: mockUser.website,
      github: mockUser.github,
      linkedin: mockUser.linkedin,
      twitter: mockUser.twitter,
      phone: mockUser.phone,
    });
    setIsEditing(false);
  };

  const navigateToAddEvent = () => {
    router.push('/add-event');
  };

  const navigateToUserProfile = (userName: string) => {
    const encodedName = encodeURIComponent(userName);
    router.push(`/user/${encodedName}`);
  };

  const navigateToCompany = (companyName: string) => {
    const encodedCompany = encodeURIComponent(companyName);
    router.push(`/calendar?company=${encodedCompany}&view=grid`);
  };

  // Highlight management functions
  const addCompanyHighlight = (company: typeof availableCompanies[0]) => {
    if (highlightedCompanies.length < 4) {
      setHighlightedCompanies(prev => [...prev, { ...company, following: false }]);
      setAddCompanyModalOpen(false);
      setCompanySearchQuery('');
    }
  };

  const removeCompanyHighlight = (companyName: string) => {
    setHighlightedCompanies(prev => prev.filter(c => c.name !== companyName));
  };

  const addUserHighlight = (userId: string) => {
    if (highlightedUsers.length < 4) {
      setHighlightedUsers(prev => [...prev, userId]);
      setAddUserModalOpen(false);
      setUserSearchQuery('');
    }
  };

  const removeUserHighlight = (userId: string) => {
    setHighlightedUsers(prev => prev.filter(id => id !== userId));
  };

  const addEventHighlight = (eventId: string) => {
    if (highlightedEvents.length < 4) {
      setHighlightedEvents(prev => [...prev, eventId]);
      setAddEventModalOpen(false);
      setEventSearchQuery('');
    }
  };

  const removeEventHighlight = (eventId: string) => {
    setHighlightedEvents(prev => prev.filter(id => id !== eventId));
  };

  const renderEventsList = (events: Event[], emptyMessage: string) => {
    if (events.length === 0) {
      return (
        <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
            <p className="text-sm">Discover and join amazing tech events!</p>
          </div>
        </Card>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} onClick={() => handleEventSelect(event)}>
              <EventCard event={event} onRSVP={handleRSVP} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id} className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${event.status === 'pending' ? 'opacity-60' : ''}`} onClick={() => handleEventSelect(event)}>
            <div className="flex items-start gap-4">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
                      {event.status === 'pending' && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.startTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.rsvpStatus === 'registered' && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Registered
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderFollowingList = () => {
    if (followingUsers.length === 0) {
      return (
        <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400">
            <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Not following anyone yet</h3>
            <p className="text-sm">Start following other users to see their profiles and events here!</p>
          </div>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followingUsers.map(user => (
          <Card key={user.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateToUserProfile(user.name)}>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg leading-tight text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    {user.name}
                  </h3>
                  {user.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <Briefcase className="h-3 w-3" />
                  <span>{user.role}</span>
                  <span>•</span>
                  <Building2 className="h-3 w-3" />
                  <span>{user.company}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                  {user.bio}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {user.eventsCreated} events
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {user.totalConnections} connections
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    );
  };

// Render placeholder card for adding highlights
  const renderPlaceholderCard = (type: 'company' | 'user' | 'event', onClick: () => void) => (
    <Card 
      className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer group bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full min-h-[120px]">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Add {type}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <Header />

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {mockUser.name}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {mockUser.bio}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {mockUser.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {mockUser.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Display "Events Attended", "Events Created", and "Following" hyperlink text here */}
                        <button
                          onClick={() => setAttendedEventsModalOpen(true)}
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline text-sm"
                        >
                          {mockUser.eventsAttended} Events Attended
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <button
                          onClick={() => setCreatedEventsModalOpen(true)}
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline text-sm"
                        >
                          {createdEvents.length} Events Created
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <button
                          onClick={() => setFollowingModalOpen(true)}
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline text-sm"
                        >
                          {followingUsers.length} Following
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:w-80">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editForm.website}
                        onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={editForm.github}
                        onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={editForm.linkedin}
                        onChange={(e) => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={editForm.twitter}
                        onChange={(e) => setEditForm(prev => ({ ...prev, twitter: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={mockUser.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {mockUser.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-400" />
                      <span>@{mockUser.github}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                      <span>{mockUser.linkedin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-gray-400" />
                      <span>{mockUser.twitter}</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              Highlights
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              My top companies, connections, and favorite events
            </p>
          </div>

          <div className="space-y-8">
            {/* Top Companies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Top Companies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlightedCompanies.map((company, index) => (
                  <Card 
                    key={company.name} 
                    className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    onClick={() => navigateToCompany(company.name)}
                  >
                    {index === 0 && (
                      <div className="absolute top-2 right-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCompanyHighlight(company.name);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {company.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {company.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                          {company.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {company.events} events
                          </span>
                          {company.following && (
                            <Badge variant="secondary" className="text-xs">
                              Following
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {/* Placeholder cards for remaining slots */}
                {Array.from({ length: 4 - highlightedCompanies.length }).map((_, index) => (
                  <div key={`company-placeholder-${index}`}>
                    {renderPlaceholderCard('company', () => setAddCompanyModalOpen(true))}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Connections */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Top Connections
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlightedUserObjects.map((user, index) => (
                  <Card 
                    key={user.id} 
                    className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                    onClick={() => navigateToUserProfile(user.name)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUserHighlight(user.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="text-center">
                      <div className="relative inline-block mb-3">
                        <Avatar className="h-16 w-16 mx-auto">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                            <Award className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {user.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {user.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                        {user.role}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.company}
                      </p>
                    </div>
                  </Card>
                ))}
                {/* Placeholder cards for remaining slots */}
                {Array.from({ length: 4 - highlightedUsers.length }).map((_, index) => (
                  <div key={`user-placeholder-${index}`}>
                    {renderPlaceholderCard('user', () => setAddUserModalOpen(true))}
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Events */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Favorite Events
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlightedEventObjects.map((event, index) => (
                  <Card 
                    key={event.id} 
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                    onClick={() => handleEventSelect(event)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/20 hover:bg-black/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEventHighlight(event.id);
                      }}
                    >
                      <X className="h-3 w-3 text-white" />
                    </Button>
                    <div className="relative h-32">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-yellow-500 rounded-full p-1">
                          <Trophy className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <h4 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Calendar className="h-3 w-3" />
                          {event.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {/* Placeholder cards for remaining slots */}
                {Array.from({ length: 4 - highlightedEvents.length }).map((_, index) => (
                  <div key={`event-placeholder-${index}`}>
                    {renderPlaceholderCard('event', () => setAddEventModalOpen(true))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="registered" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Registered ({registeredEvents.length})
              </TabsTrigger>
              <TabsTrigger value="created" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Created ({createdEvents.length})
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Following ({followingUsers.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-9 w-9 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-9 w-9 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="registered" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Registered Events
              </h2>
              {renderEventsList(registeredEvents, 'No registered events yet')}
            </div>
          </TabsContent>

          <TabsContent value="created" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Created Events
              </h2>
              <Button onClick={navigateToAddEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </div>
            {renderEventsList(createdEvents, 'No events created yet')}
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Following
              </h2>
              {renderFollowingList()}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Company Modal */}
      <Dialog open={addCompanyModalOpen} onOpenChange={setAddCompanyModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              Add Company to Highlights
            </DialogTitle>
            <DialogDescription>
              Search and select a company to add to your highlights
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={companySearchQuery}
                onChange={(e) => setCompanySearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="overflow-y-auto max-h-[50vh] space-y-2">
              {filteredCompanies.map(company => (
                <Card 
                  key={company.name}
                  className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addCompanyHighlight(company)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {company.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{company.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{company.description}</p>
                      <p className="text-xs text-gray-400">{company.events} events</p>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredCompanies.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No companies found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={addUserModalOpen} onOpenChange={setAddUserModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Add Connection to Highlights
            </DialogTitle>
            <DialogDescription>
              Search and select a user to add to your highlights
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="overflow-y-auto max-h-[50vh] space-y-2">
              {filteredUsers.map(user => (
                <Card 
                  key={user.id}
                  className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addUserHighlight(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h4>
                        {user.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.role} at {user.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{user.bio}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Modal */}
      <Dialog open={addEventModalOpen} onOpenChange={setAddEventModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Add Event to Highlights
            </DialogTitle>
            <DialogDescription>
              Search and select an event to add to your highlights
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={eventSearchQuery}
                onChange={(e) => setEventSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="overflow-y-auto max-h-[50vh] space-y-2">
              {filteredEvents.map(event => (
                <Card 
                  key={event.id}
                  className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addEventHighlight(event.id)}
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{event.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.company}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {event.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No events found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Events Attended Modal */}
      <Dialog open={attendedEventsModalOpen} onOpenChange={setAttendedEventsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                Events Attended ({mockUser.eventsAttended})
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAttendedEventsModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Events you have attended or registered for
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] space-y-4">
            {registeredEvents.map(event => (
              <Card key={event.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                handleEventSelect(event);
                setAttendedEventsModalOpen(false);
              }}>
                <div className="flex items-start gap-4">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight mb-1">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Registered
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Events Created Modal */}
      <Dialog open={createdEventsModalOpen} onOpenChange={setCreatedEventsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                Events Created ({createdEvents.length})
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreatedEventsModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Events you have organized and created
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] space-y-4">
            {createdEvents.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No events created yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start organizing events to build your community!
                </p>
                <Button onClick={() => {
                  setCreatedEventsModalOpen(false);
                  navigateToAddEvent();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Button>
              </div>
            ) : (
              createdEvents.map(event => (
                <Card key={event.id} className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${event.status === 'pending' ? 'opacity-60' : ''}`} onClick={() => {
                  handleEventSelect(event);
                  setCreatedEventsModalOpen(false);
                }}>
                  <div className="flex items-start gap-4">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
                        {event.status === 'pending' && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Modal */}
      <Dialog open={followingModalOpen} onOpenChange={setFollowingModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-500" />
                Following ({followingUsers.length})
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFollowingModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              People you are following in the community
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] space-y-4">
            {followingUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Not following anyone yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start following other users to see their profiles and events here!
                </p>
              </div>
            ) : (
              followingUsers.map(user => (
                <Card key={user.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                  navigateToUserProfile(user.name);
                  setFollowingModalOpen(false);
                }}>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg leading-tight text-blue-600 dark:text-blue-400">
                          {user.name}
                        </h3>
                        {user.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <Briefcase className="h-3 w-3" />
                        <span>{user.role}</span>
                        <span>•</span>
                        <Building2 className="h-3 w-3" />
                        <span>{user.company}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                        {user.bio}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {user.eventsCreated} events
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {user.totalConnections} connections
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onRSVP={handleRSVP}
      />
    </div>
  );
}