"use client";

import { useMemo } from "react";
import { Event } from "@/types/event";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFollowing } from "@/lib/following";
import { getUserById } from "@/lib/users";
import { Users, UserPlus, ExternalLink, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface WhosGoingProps {
  event: Event;
  currentUserId: string;
  compact?: boolean;
}

export function WhosGoing({
  event,
  currentUserId,
  compact = false,
}: WhosGoingProps) {
  const router = useRouter();

  // Get users that current user is following
  const followingUsers = useMemo(() => {
    return getFollowing(currentUserId);
  }, [currentUserId]);

  // Get following users who are attending this event
  const followingAttendees = useMemo(() => {
    if (!event.attendeeIds || event.attendeeIds.length === 0) return [];

    const followingIds = followingUsers.map((user) => user.id);
    const attendingFollowingIds = event.attendeeIds.filter((id) =>
      followingIds.includes(id)
    );

    return attendingFollowingIds
      .map((id) => getUserById(id))
      .filter(Boolean) as User[];
  }, [event.attendeeIds, followingUsers]);

  const navigateToUserProfile = (userName: string) => {
    const encodedName = encodeURIComponent(userName);
    router.push(`/user/${encodedName}`);
  };

  // if (followingAttendees.length === 0) {
  //   return null; // Don't show the section if no following users are attending
  // }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Users className="h-4 w-4 text-blue-500" />
          <span>People you follow going ({followingAttendees.length})</span>
        </div>
        <div className="flex -space-x-2">
          {followingAttendees.slice(0, 3).map((user) => (
            <Avatar
              key={user.id}
              className="h-8 w-8 border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => navigateToUserProfile(user.name)}
            >
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}
          {followingAttendees.length === 0 && (
            <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800 invisible">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">AA</AvatarFallback>
            </Avatar>
          )}
          {followingAttendees.length > 3 && (
            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
              +{followingAttendees.length - 3}
            </div>
          )}
        </div>
        {followingAttendees.length <= 3 && (
          <div className="flex flex-wrap gap-1">
            {followingAttendees.length === 0 ? (
              <span className="text-xs invisible">Hidden User</span>
            ) : (
              followingAttendees.map((user) => (
                <span
                  key={user.id}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors"
                  onClick={() => navigateToUserProfile(user.name)}
                >
                  {user.name}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Who's Going
        </CardTitle>
        <div className="text-sm font-light text-gray-500 mt-1 flex items-center">
          {followingAttendees.length} people you follow
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {followingAttendees.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => navigateToUserProfile(user.name)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    {user.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {user.role} at {user.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {followingAttendees.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Connect with people you follow at this event
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
