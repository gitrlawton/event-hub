'use client';

import { Event } from '@/types/event';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { WhosGoing } from '@/components/event/whos-going';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Globe,
  Star,
  Share2,
  BookmarkPlus,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { eventCategories } from '@/lib/events';
import { useRouter } from 'next/navigation';

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRSVP?: (eventId: string) => void;
  currentUserId?: string;
}

// Mock current user ID - in a real app, this would come from authentication context
const DEFAULT_CURRENT_USER_ID = 'user-1';

export function EventDetailModal({ event, open, onOpenChange, onRSVP, currentUserId = DEFAULT_CURRENT_USER_ID }: EventDetailModalProps) {
  const router = useRouter();

  if (!event) return null;

  const category = eventCategories.find(cat => cat.value === event.category);

  const getRSVPButton = () => {
    switch (event.rsvpStatus) {
      case 'registered':
        return (
          <Button className="w-full bg-green-600 hover:bg-green-700">
            ✓ You're Registered
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => onRSVP?.(event.id)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            RSVP Now
          </Button>
        );
    }
  };

  const handleOrganizerClick = () => {
    const encodedName = encodeURIComponent(event.organizer);
    router.push(`/user/${encodedName}`);
    onOpenChange(false); // Close the modal
  };

  const handleCompanyClick = () => {
    const encodedCompany = encodeURIComponent(event.company);
    router.push(`/calendar?company=${encodedCompany}&view=grid`);
    onOpenChange(false); // Close the modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Event Image */}
        <div className="relative -m-6 mb-6 h-64 overflow-hidden rounded-t-lg">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge className={`${category?.color} text-white border-0`}>
              {category?.label}
            </Badge>
            {event.featured && (
              <Badge className="bg-yellow-500 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            {event.isOnline && (
              <Badge className="bg-green-500 text-white border-0">
                <Globe className="h-3 w-3 mr-1" />
                Virtual
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl leading-tight mb-3">
                {event.title}
              </DialogTitle>
              
              {/* Company - Right beneath title - Clickable */}
              <div 
                className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300 mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 -mx-3 transition-colors"
                onClick={handleCompanyClick}
              >
                <Building2 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  {event.company}
                </span>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
              
              <DialogDescription className="text-base leading-relaxed">
                {event.description}
              </DialogDescription>
            </div>
            <div className="text-right flex-shrink-0">
              {event.price === 0 ? (
                <div className="text-2xl font-bold text-green-600">Free</div>
              ) : (
                <div className="text-2xl font-bold">${event.price}</div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium">{event.date.toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">Event Date</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium">{event.startTime} - {event.endTime}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium">{event.location}</div>
                  <div className="text-sm text-gray-500">{event.venue}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium">{event.attendees}</div>
                  <div className="text-sm text-gray-500">Attendees</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Organizer - Now clickable */}
            <div>
              <h3 className="font-semibold mb-3">Organizer</h3>
              <div 
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={handleOrganizerClick}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {event.organizer.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    {event.organizer}
                  </div>
                  <div className="text-sm text-gray-500">Event Organizer • Click to view profile</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Actions */}
            <div className="space-y-3">
              {getRSVPButton()}
            </div>

            {/* Who's Going */}
            <WhosGoing event={event} currentUserId={currentUserId} />

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}