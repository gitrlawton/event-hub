'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import { sampleEvents, filterEvents } from '@/lib/events';
import { CalendarView } from '@/components/calendar/calendar-view';
import { EventCard } from '@/components/event/event-card';
import { EventFilters } from '@/components/event/event-filters';
import { EventDetailModal } from '@/components/event/event-detail-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar as CalendarIcon,
  Grid3X3,
  TrendingUp,
  Star,
  Users,
  MapPin,
  Zap,
  Code,
  BarChart3,
  Brain,
  Shield,
  Target,
  Dna,
  DollarSign,
  Palette,
} from 'lucide-react';

const techDisciplines = [
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    icon: Code,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Development, Architecture, DevOps'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: BarChart3,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Analytics, Visualization, Statistics'
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    icon: Brain,
    color: 'bg-purple-500 hover:bg-purple-600',
    description: 'Neural Networks, Deep Learning, NLP'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: Shield,
    color: 'bg-red-500 hover:bg-red-600',
    description: 'Security, Privacy, Risk Management'
  },
  {
    id: 'product-management',
    name: 'Product Management',
    icon: Target,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Strategy, UX, Product Development'
  },
  {
    id: 'biotech',
    name: 'Biotech',
    icon: Dna,
    color: 'bg-teal-500 hover:bg-teal-600',
    description: 'Genomics, Bioinformatics, Healthcare'
  },
  {
    id: 'fintech',
    name: 'Fintech',
    icon: DollarSign,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    description: 'Banking, Payments, Cryptocurrency'
  },
  {
    id: 'ui-ux',
    name: 'UI / UX',
    icon: Palette,
    color: 'bg-pink-500 hover:bg-pink-600',
    description: 'Design, User Research, Prototyping'
  },
];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search: string;
    category?: any;
    isOnline?: boolean;
  }>({
    search: '',
  });

  const filteredEvents = useMemo(() => {
    let events = filterEvents(sampleEvents, filters);
    
    // Filter by selected discipline (this would be enhanced with proper tagging in a real app)
    if (selectedDiscipline) {
      events = events.filter(event => {
        const disciplineKeywords = {
          'software-engineering': ['react', 'javascript', 'web development', 'frontend', 'backend', 'development', 'programming', 'coding'],
          'data-science': ['data', 'analytics', 'visualization', 'statistics', 'analysis', 'insights', 'metrics'],
          'ai-ml': ['ai', 'machine learning', 'tensorflow', 'neural', 'deep learning', 'artificial intelligence', 'ml'],
          'cybersecurity': ['security', 'privacy', 'encryption', 'blockchain', 'cyber', 'protection', 'vulnerability'],
          'product-management': ['product', 'strategy', 'roadmap', 'management', 'planning', 'growth'],
          'biotech': ['biotech', 'biotechnology', 'genomics', 'bioinformatics', 'healthcare', 'medical', 'biology', 'pharma'],
          'fintech': ['fintech', 'finance', 'banking', 'payments', 'cryptocurrency', 'blockchain', 'trading', 'investment'],
          'ui-ux': ['ux', 'ui', 'design', 'user experience', 'user interface', 'prototyping', 'research', 'usability']
        };
        
        const keywords = disciplineKeywords[selectedDiscipline as keyof typeof disciplineKeywords] || [];
        return keywords.some(keyword => 
          event.title.toLowerCase().includes(keyword) ||
          event.description.toLowerCase().includes(keyword) ||
          event.tags.some(tag => tag.toLowerCase().includes(keyword))
        );
      });
    }
    
    return events;
  }, [filters, selectedDiscipline]);

  const featuredEvents = useMemo(() => {
    return sampleEvents.filter(event => event.featured);
  }, []);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleRSVP = (eventId: string) => {
    // In a real app, this would make an API call
    console.log('RSVP to event:', eventId);
  };

  const handleDisciplineSelect = (disciplineId: string) => {
    setSelectedDiscipline(selectedDiscipline === disciplineId ? null : disciplineId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Happening
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                <MapPin className="h-3 w-3 mr-1" />
                San Francisco Bay Area
              </Badge>
              <Button variant="outline" size="sm">
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Tech Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with the tech community through conferences, workshops, meetups, and networking events.
            Find your next learning opportunity or career connection.
          </p>

          {/* Tech Discipline Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            {techDisciplines.map((discipline) => (
              <Button
                key={discipline.id}
                onClick={() => handleDisciplineSelect(discipline.id)}
                variant={selectedDiscipline === discipline.id ? "default" : "outline"}
                className={`
                  h-auto p-4 flex flex-col items-center gap-2 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg
                  ${selectedDiscipline === discipline.id 
                    ? `${discipline.color} text-white shadow-lg scale-105` 
                    : 'bg-white hover:bg-gray-50 border-2 hover:border-gray-300'
                  }
                `}
              >
                <discipline.icon className={`h-6 w-6 ${
                  selectedDiscipline === discipline.id ? 'text-white' : 'text-gray-600'
                }`} />
                <div>
                  <div className={`font-semibold text-xs ${
                    selectedDiscipline === discipline.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {discipline.name}
                  </div>
                  <div className={`text-xs mt-1 leading-tight ${
                    selectedDiscipline === discipline.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {discipline.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Active Filter Indicator */}
          {selectedDiscipline && (
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Showing events for: {techDisciplines.find(d => d.id === selectedDiscipline)?.name}
                <button
                  onClick={() => setSelectedDiscipline(null)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {/* Featured Events */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-900">Featured Events</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <div key={event.id} onClick={() => handleEventSelect(event)}>
                  <EventCard event={event} onRSVP={handleRSVP} />
                </div>
              ))}
            </div>
          </section>

          {/* Search and Filters */}
          <EventFilters onFiltersChange={setFilters} />

          {/* Main Event Display */}
          <Tabs defaultValue="calendar" className="space-y-6">
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