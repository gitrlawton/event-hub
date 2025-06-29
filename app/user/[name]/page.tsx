'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { Event } from '@/types/event';
import { getUserByName } from '@/lib/users';
import { getAllEvents } from '@/lib/events';
import { isFollowing, followUser, unfollowUser, getFollowersCount, getFollowingCount } from '@/lib/following';
import { Header } from '@/components/layout/header';
import { EventCard } from '@/components/event/event-card';
import { EventDetailModal } from '@/components/event/event-detail-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  User as UserIcon,
  Calendar,
  MapPin,
  Users,
  Star,
  Share2,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  ArrowLeft,
  Building2,
  Briefcase,
  UserPlus,
  UserMinus,
  MessageCircle,
} from 'lucide-react';

// Mock current user ID - in a real app, this would come from authentication context
const CURRENT_USER_ID = 'user-1';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('created');
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  // Decode the name parameter
  const userName = decodeURIComponent(params.name as string);
  const user = getUserByName(userName);

  // Initialize following state
  useMemo(() => {
    if (user) {
      setIsFollowingUser(isFollowing(CURRENT_USER_ID, user.id));
    }
  }, [user]);

  // Get all events to filter by organizer
  const allEvents = useMemo(() => {
    return getAllEvents();
  }, []);

  // Filter events created by this user
  const userCreatedEvents = useMemo(() => {
    return allEvents.filter(event => event.organizer === userName && event.status === 'approved');
  }, [allEvents, userName]);

  // Mock attended events (in a real app, this would come from user's registration data)
  const userAttendedEvents = useMemo(() => {
    return allEvents.filter(event => event.rsvpStatus === 'registered').slice(0, 6);
  }, [allEvents]);

  // Get follower and following counts
  const followersCount = user ? getFollowersCount(user.id) : 0;
  const followingCount = user ? getFollowingCount(user.id) : 0;

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleRSVP = (eventId: string) => {
    console.log('RSVP to event:', eventId);
  };

  const handleFollowToggle = () => {
    if (!user) return;

    if (isFollowingUser) {
      unfollowUser(CURRENT_USER_ID, user.id);
      setIsFollowingUser(false);
    } else {
      followUser(CURRENT_USER_ID, user.id);
      setIsFollowingUser(true);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center p-8">
            <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              User Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The user profile you're looking for doesn't exist.
            </p>
            <Button onClick={navigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          onClick={navigateBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

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
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {user.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {user.name}
                    </h1>
                    {user.verified && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {user.role}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {user.company}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {user.bio}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {user.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.interests.map(interest => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleFollowToggle}
                  className={isFollowingUser ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  {isFollowingUser ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>

            {/* Stats and Contact */}
            <div className="lg:w-80 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.eventsCreated}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Events Created</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {user.eventsAttended}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Events Attended</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {followersCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {followingCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                </Card>
              </div>

              {/* Contact Info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={user.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {user.website}
                      </a>
                    </div>
                  )}
                  {user.github && (
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-400" />
                      <span>@{user.github}</span>
                    </div>
                  )}
                  {user.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                      <span>{user.linkedin}</span>
                    </div>
                  )}
                  {user.twitter && (
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-gray-400" />
                      <span>{user.twitter}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="created" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created Events ({userCreatedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="attended" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Attended Events ({userAttendedEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Events Created by {user.name}
              </h2>
              {userCreatedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCreatedEvents.map(event => (
                    <div key={event.id} onClick={() => handleEventSelect(event)}>
                      <EventCard event={event} onRSVP={handleRSVP} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No events created yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user.name} hasn't created any public events yet.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attended" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Events Attended by {user.name}
              </h2>
              {userAttendedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAttendedEvents.map(event => (
                    <div key={event.id} onClick={() => handleEventSelect(event)}>
                      <EventCard event={event} onRSVP={handleRSVP} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No attended events
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user.name} hasn't attended any events yet.
                  </p>
                </Card>
              )}
            </div>
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