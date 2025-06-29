'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import { sampleEvents, getUserCreatedEvents } from '@/lib/events';
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
  User,
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

export default function ProfilePage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('registered');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
                        {mockUser.interests.map(interest => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
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

            {/* Stats Cards */}
            <div className="lg:w-80">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {mockUser.eventsAttended}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Events Attended</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {createdEvents.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Events Created</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {mockUser.totalConnections}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Connections</div>
                </Card>
              </div>

              {/* Contact Info */}
              <Card className="mt-4 p-4">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={mockUser.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
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
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{mockUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{mockUser.phone}</span>
                    </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="registered" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Registered ({registeredEvents.length})
              </TabsTrigger>
              <TabsTrigger value="created" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Created ({createdEvents.length})
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
        </Tabs>
      </main>

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