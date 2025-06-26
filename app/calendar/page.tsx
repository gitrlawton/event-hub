'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Event, TechDomain } from '@/types/event';
import { sampleEvents, filterEvents } from '@/lib/events';
import { Header } from '@/components/layout/header';
import { CalendarView } from '@/components/calendar/calendar-view';
import { EventFilters } from '@/components/event/event-filters';
import { EventDetailModal } from '@/components/event/event-detail-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { EventCard } from '@/components/event/event-card';
import {
  Calendar as CalendarIcon,
  Grid3X3,
} from 'lucide-react';

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [filters, setFilters] = useState<{
    search: string;
    category?: any;
    domain?: TechDomain;
    isOnline?: boolean;
  }>({
    search: '',
  });

  // Get URL parameters for domain and view
  const urlDomain = searchParams.get('domain') as TechDomain | null;
  const urlView = searchParams.get('view') || 'calendar';

  // Set initial tab value based on URL parameter
  const [activeTab, setActiveTab] = useState(urlView);

  // Apply URL parameters on component mount
  useEffect(() => {
    if (urlDomain) {
      setFilters(prev => ({
        ...prev,
        domain: urlDomain,
      }));
    }
    if (urlView) {
      setActiveTab(urlView);
    }
  }, [urlDomain, urlView]);

  // Combine header search with filter search
  const combinedFilters = useMemo(() => ({
    ...filters,
    search: headerSearch || filters.search,
  }), [filters, headerSearch]);

  const filteredEvents = useMemo(() => {
    return filterEvents(sampleEvents, combinedFilters);
  }, [combinedFilters]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleRSVP = (eventId: string) => {
    // In a real app, this would make an API call
    console.log('RSVP to event:', eventId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <Header onSearchChange={setHeaderSearch} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Events
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse and discover tech events in an organized view. Filter by domain and type, search for specific topics, and never miss an important event.
            </p>
          </div>

          {/* Search and Filters */}
          <EventFilters 
            onFiltersChange={setFilters} 
            initialDomain={urlDomain || undefined}
            currentFilters={filters}
          />

          {/* Calendar and Grid Views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Grid View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-0">
              <CalendarView
                events={filteredEvents}
                onEventSelect={handleEventSelect}
              />
            </TabsContent>

            <TabsContent value="grid" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.id} onClick={() => handleEventSelect(event)}>
                    <EventCard event={event} onRSVP={handleRSVP} />
                  </div>
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No events found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
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