"use client";

import { Event } from "@/types/event";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WhosGoing } from "@/components/event/whos-going";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Globe,
  Star,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Building2,
} from "lucide-react";
import { eventCategories } from "@/lib/events";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  compact?: boolean;
  onRSVP?: (eventId: string) => void;
  currentUserId?: string;
}

// Mock current user ID - in a real app, this would come from authentication context
const DEFAULT_CURRENT_USER_ID = "user-1";

export function EventCard({
  event,
  compact = false,
  onRSVP,
  currentUserId = DEFAULT_CURRENT_USER_ID,
}: EventCardProps) {
  const category = eventCategories.find((cat) => cat.value === event.category);
  const isPending = event.status === "pending";
  const isApproved = event.status === "approved";
  const router = useRouter();

  const getRSVPButton = () => {
    switch (event.rsvpStatus) {
      case "registered":
        return (
          <Button
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            ✓ Registered
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => onRSVP?.(event.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            RSVP Now
          </Button>
        );
    }
  };

  const handleOrganizerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click
    const encodedName = encodeURIComponent(event.organizer);
    router.push(`/user/${encodedName}`);
  };

  const handleCompanyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click
    const encodedCompany = encodeURIComponent(event.company);
    router.push(`/calendar?company=${encodedCompany}&view=grid`);
  };

  if (compact) {
    return (
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${isPending ? "opacity-60" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-2 ${category?.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{event.title}</h4>
                {isPending && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              {/* Company - Right beneath title - Clickable */}
              <div
                className="inline-flex items-center gap-1 mb-2 cursor-pointer rounded pl-0 pr-1 py-0.5 transition-colors w-fit group/company"
                onClick={handleCompanyClick}
              >
                <Building2 className="h-3 w-3 text-blue-500 group-hover/company:text-blue-800 dark:group-hover/company:text-blue-300" />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium transition-colors group-hover/company:text-blue-800 dark:group-hover/company:text-blue-300">
                  {event.company}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {event.startTime}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {category?.label}
                </Badge>
                {event.featured && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
              </div>

              {/* Who's Going - Compact Version */}
              <div className="mt-2">
                <WhosGoing
                  event={event}
                  currentUserId={currentUserId}
                  compact
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group ${isPending ? "relative" : ""}`}
    >
      {/* Pending Overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Pending Approval
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your event is being reviewed
            </div>
          </div>
        </div>
      )}

      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={`${category?.color} text-white border-0`}>
            {category?.label}
          </Badge>
          {event.featured && (
            <Badge className="bg-yellow-500 text-white border-0">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          {isPending && (
            <Badge className="bg-yellow-500 text-white border-0">
              <AlertCircle className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
        {event.isOnline && (
          <Badge className="absolute top-4 right-4 bg-green-500 text-white border-0">
            <Globe className="h-3 w-3 mr-1" />
            Virtual
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold leading-tight group-hover:text-blue-600 transition-colors mb-2">
              {event.title}
            </h3>

            {/* Company - Right beneath title - Clickable */}
            <div
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2 cursor-pointer rounded-lg ml-0 mr-2 my-1 transition-colors w-fit self-start group/company"
              onClick={handleCompanyClick}
            >
              <Building2 className="h-4 w-4 text-blue-500 group-hover/company:text-blue-800 dark:group-hover/company:text-blue-300" />
              <span className="font-medium text-blue-600 dark:text-blue-400 transition-colors group-hover/company:text-blue-800 dark:group-hover/company:text-blue-300">
                {event.company}
              </span>
            </div>
          </div>

          <div className="text-right text-sm text-gray-500 flex-shrink-0">
            {event.price === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              <span className="font-medium">${event.price}</span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-gray-600 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-blue-500" />
            {event.date.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 text-blue-500" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 text-blue-500" />
            {event.attendees} attendees
          </div>
        </div>

        {/* Who's Going Section */}
        {!isPending && (
          <WhosGoing event={event} currentUserId={currentUserId} compact />
        )}
      </CardContent>

      {/* Bottom section anchored: tags, organizer, and actions */}
      <CardFooter className="flex-col items-stretch gap-3 mt-auto">
        {/* Organizer - Now clickable */}
        <div
          className="flex items-center gap-3 pt-2 border-t border-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
          onClick={handleOrganizerClick}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
              {event.organizer.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              {event.organizer}
            </p>
            <p className="text-xs text-gray-500">Event Organizer</p>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400" />
        </div>

        {/* Action Buttons - Only show for approved events */}
        {!isPending && (
          <div className="flex gap-2 pt-2">
            {getRSVPButton()}
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
