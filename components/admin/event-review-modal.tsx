"use client";

import { useState } from "react";
import { Event, EventCategory, TechDomain } from "@/types/event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Link as LinkIcon,
  Users,
  Tag,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
  Save,
  X,
  Utensils,
  Gift,
} from "lucide-react";
import { eventCategories, techDomains } from "@/lib/events";

interface EventReviewModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (eventId: string, editedEvent?: Partial<Event>) => void;
  onReject: (eventId: string) => void;
}

export function EventReviewModal({
  event,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: EventReviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [newTag, setNewTag] = useState("");

  if (!event) return null;

  // Initialize edited event when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !editedEvent) {
      setEditedEvent({ ...event });
    } else if (!newOpen) {
      setIsEditing(false);
      setEditedEvent(null);
    }
    onOpenChange(newOpen);
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (!editedEvent) {
      setEditedEvent({ ...event });
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update the display with edited values
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEvent({ ...event });
  };

  const handleInputChange = (field: keyof Event, value: any) => {
    if (editedEvent) {
      setEditedEvent((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      editedEvent &&
      !editedEvent.tags.includes(newTag.trim())
    ) {
      setEditedEvent((prev) =>
        prev
          ? {
              ...prev,
              tags: [...prev.tags, newTag.trim()],
            }
          : null
      );
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (editedEvent) {
      setEditedEvent((prev) =>
        prev
          ? {
              ...prev,
              tags: prev.tags.filter((tag) => tag !== tagToRemove),
            }
          : null
      );
    }
  };

  const handleApproveWithEdits = () => {
    if (editedEvent && editedEvent !== event) {
      // Pass the edited changes
      const changes: Partial<Event> = {};
      Object.keys(editedEvent).forEach((key) => {
        const eventKey = key as keyof Event;
        if (editedEvent[eventKey] !== event[eventKey]) {
          (changes as any)[eventKey] = editedEvent[eventKey];
        }
      });
      onApprove(event.id, changes);
    } else {
      onApprove(event.id);
    }
  };

  const displayEvent = editedEvent || event;
  const category = eventCategories.find(
    (cat) => cat.value === displayEvent.category
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                Review Event Submission
              </DialogTitle>
              <DialogDescription className="mt-2">
                Review the event details below. You can edit any information
                before approving.
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Image</Label>
            <div className="relative h-48 overflow-hidden rounded-lg border">
              <img
                src={displayEvent.imageUrl}
                alt={displayEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className={`${category?.color} text-white border-0`}>
                  {category?.label}
                </Badge>
                {displayEvent.isOnline && (
                  <Badge className="bg-green-500 text-white border-0">
                    Virtual
                  </Badge>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="url"
                  placeholder="https://example.com/event-image.jpg"
                  value={displayEvent.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Event Title</Label>
                    {isEditing ? (
                      <Input
                        value={displayEvent.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {displayEvent.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    {isEditing ? (
                      <Textarea
                        value={displayEvent.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg leading-relaxed">
                        {displayEvent.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Company/Organization
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={displayEvent.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {displayEvent.company}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Original Event URL
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="url"
                          value={displayEvent.originalUrl || ""}
                          onChange={(e) =>
                            handleInputChange("originalUrl", e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <a
                          href={displayEvent.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                        >
                          <LinkIcon className="h-4 w-4" />
                          View Original Listing
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Date & Time
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={displayEvent.date.toISOString().split("T")[0]}
                        onChange={(e) =>
                          handleInputChange("date", new Date(e.target.value))
                        }
                      />
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {displayEvent.date.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Start Time</Label>
                    {isEditing ? (
                      <Input
                        type="time"
                        value={displayEvent.startTime}
                        onChange={(e) =>
                          handleInputChange("startTime", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {displayEvent.startTime}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">End Time</Label>
                    {isEditing ? (
                      <Input
                        type="time"
                        value={displayEvent.endTime}
                        onChange={(e) =>
                          handleInputChange("endTime", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {displayEvent.endTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Location & Details */}
            <div className="space-y-6">
              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Location
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={displayEvent.isOnline}
                      onCheckedChange={(checked) =>
                        isEditing && handleInputChange("isOnline", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label className="text-sm font-medium">
                      Virtual/Online Event
                    </Label>
                  </div>

                  {!displayEvent.isOnline && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Location</Label>
                        {isEditing ? (
                          <Input
                            value={displayEvent.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            placeholder="City, State"
                          />
                        ) : (
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            {displayEvent.location}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Venue</Label>
                        {isEditing ? (
                          <Input
                            value={displayEvent.venue}
                            onChange={(e) =>
                              handleInputChange("venue", e.target.value)
                            }
                            placeholder="Venue name"
                          />
                        ) : (
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            {displayEvent.venue}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-blue-500" />
                  Additional Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Price (USD)</Label>
                      {isEditing ? (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={displayEvent.price}
                            onChange={(e) =>
                              handleInputChange(
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="pl-10"
                          />
                        </div>
                      ) : (
                        <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {displayEvent.price === 0
                            ? "Free"
                            : `$${displayEvent.price}`}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Max Attendees
                      </Label>
                      {isEditing ? (
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            min="1"
                            value={displayEvent.maxAttendees}
                            onChange={(e) =>
                              handleInputChange(
                                "maxAttendees",
                                parseInt(e.target.value) || 100
                              )
                            }
                            className="pl-10"
                          />
                        </div>
                      ) : (
                        <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {displayEvent.maxAttendees}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Amenities</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <Utensils className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">
                            Food Available
                          </span>
                        </div>
                        <Switch
                          checked={displayEvent.foodAvailable || false}
                          onCheckedChange={(checked) =>
                            isEditing &&
                            handleInputChange("foodAvailable", checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <Gift className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">
                            Swag Available
                          </span>
                        </div>
                        <Switch
                          checked={displayEvent.swagAvailable || false}
                          onCheckedChange={(checked) =>
                            isEditing &&
                            handleInputChange("swagAvailable", checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tags</Label>
                    {isEditing && (
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          disabled={!newTag.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {displayEvent.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          {tag}
                          {isEditing && (
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Organizer Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Organizer:</span>{" "}
                {displayEvent.organizer}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Submitted:</span>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onReject(event.id)}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Event
            </Button>
            <Button
              onClick={handleApproveWithEdits}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
