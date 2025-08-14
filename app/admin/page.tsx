"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getPendingEvents, approveEvent } from "@/lib/events";
import { getBadgeInfo } from "@/lib/engagement";
import { triggerEngagementToasts } from "@/lib/toast-notifications";
import { getUserByName } from "@/lib/users";
import { Header } from "@/components/layout/header";
import { EventReviewModal } from "@/components/admin/event-review-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Trophy,
  Star,
  Zap,
  Flame,
  Eye,
} from "lucide-react";

export default function AdminPage() {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Get pending events
    setPendingEvents(getPendingEvents());
  }, []);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleApproveEvent = (
    eventId: string,
    editedChanges?: Partial<Event>
  ) => {
    // If there are edited changes, apply them to the event first
    if (editedChanges) {
      const eventIndex = pendingEvents.findIndex((e) => e.id === eventId);
      if (eventIndex !== -1) {
        const updatedEvent = { ...pendingEvents[eventIndex], ...editedChanges };
        const updatedEvents = [...pendingEvents];
        updatedEvents[eventIndex] = updatedEvent;
        setPendingEvents(updatedEvents);
      }
    }

    const result = approveEvent(eventId);
    setPendingEvents((prev) => prev.filter((event) => event.id !== eventId));
    setApprovedCount((prev) => prev + 1);
    setMessage(
      "Event approved successfully! It will now appear in the main calendar and remain in the user's created events list."
    );

    // Trigger engagement rewards and community notifications
    if (result.engagementUpdate) {
      const event = pendingEvents.find((e) => e.id === eventId);
      if (event) {
        const user = getUserByName(event.organizer);
        if (user) {
          triggerEngagementToasts(
            event.organizer,
            user.id,
            result.engagementUpdate,
            { xp: user.xp, streakCount: user.streakCount }
          );
        }
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);

    // Close modal if the approved event was being viewed
    if (selectedEvent && selectedEvent.id === eventId) {
      setModalOpen(false);
    }
  };

  const handleRejectEvent = (eventId: string) => {
    // In a real app, this would update the event status to 'rejected'
    setPendingEvents((prev) => prev.filter((event) => event.id !== eventId));
    setMessage("Event rejected. The organizer will be notified.");

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);

    // Close modal if the rejected event was being viewed
    if (selectedEvent && selectedEvent.id === eventId) {
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Review and approve pending event submissions. Click on any event to
            view and edit details before making your decision.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pendingEvents.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pending Events
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {approvedCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Approved Today
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                0
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Rejected Today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <Alert className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Pending Event Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingEvents.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No pending events to review at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-6">
                      {/* Event Image */}
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleEventSelect(event)}
                      />

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3
                              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={() => handleEventSelect(event)}
                            >
                              {event.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{event.date.toLocaleDateString()}</span>
                              <span>
                                {event.startTime} - {event.endTime}
                              </span>
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>

                        {/* Organizer Info */}
                        <div className="mb-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Organizer:{" "}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {event.organizer}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            at {event.company}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleEventSelect(event)}
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review & Edit
                          </Button>
                          <Button
                            onClick={() => handleApproveEvent(event.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quick Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRejectEvent(event.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Event
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Event Review Modal */}
      <EventReviewModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApprove={handleApproveEvent}
        onReject={handleRejectEvent}
      />
    </div>
  );
}
