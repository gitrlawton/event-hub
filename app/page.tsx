'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import { getAllEvents, filterEvents } from '@/lib/events';
import { Header } from '@/components/layout/header';
import { EventCard } from '@/components/event/event-card';
import { EventDetailModal } from '@/components/event/event-detail-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Users,
  MapPin,
  Code,
  BarChart3,
  Brain,
  Shield,
  Target,
  Dna,
  DollarSign as DollarSignIcon,
  Palette,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const techDisciplines = [
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    icon: Code,
    color: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    description: 'Development, Architecture, DevOps'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: BarChart3,
    color: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
    description: 'Analytics, Visualization, Statistics'
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    icon: Brain,
    color: 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700',
    description: 'Neural Networks, Deep Learning, NLP'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: Shield,
    color: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
    description: 'Security, Privacy, Risk Management'
  },
  {
    id: 'product-management',
    name: 'Product Management',
    icon: Target,
    color: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700',
    description: 'Strategy, UX, Product Development'
  },
  {
    id: 'biotech',
    name: 'Biotech',
    icon: Dna,
    color: 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700',
    description: 'Genomics, Bioinformatics, Healthcare'
  },
  {
    id: 'fintech',
    name: 'Fintech',
    icon: DollarSignIcon,
    color: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700',
    description: 'Banking, Payments, Cryptocurrency'
  },
  {
    id: 'ui-ux',
    name: 'UI / UX',
    icon: Palette,
    color: 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700',
    description: 'Design, User Research, Prototyping'
  },
];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState('');
  const router = useRouter();

  // Get all events (including approved user-created events)
  const allEvents = useMemo(() => {
    return getAllEvents();
  }, []);

  // Simple filtering for homepage - just search and discipline
  const filteredEvents = useMemo(() => {
    let events = allEvents;
    
    // Filter by search
    if (headerSearch) {
      const searchLower = headerSearch.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.company.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by selected discipline
    if (selectedDiscipline) {
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
      events = events.filter(event => 
        keywords.some(keyword => 
          event.title.toLowerCase().includes(keyword) ||
          event.description.toLowerCase().includes(keyword) ||
          event.tags.some(tag => tag.toLowerCase().includes(keyword))
        )
      );
    }
    
    return events;
  }, [allEvents, headerSearch, selectedDiscipline]);

  const featuredEvents = useMemo(() => {
    return allEvents.filter(event => event.featured);
  }, [allEvents]);

  const upcomingEvents = useMemo(() => {
    return allEvents.slice(0, 6); // Show first 6 events
  }, [allEvents]);

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

  const handleDisciplineNavigate = (disciplineId: string) => {
    // Navigate to calendar page with domain filter and grid view
    router.push(`/calendar?domain=${disciplineId}&view=grid`);
  };

  const navigateToCalendar = () => {
    router.push('/calendar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <Header onSearchChange={setHeaderSearch} />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover Amazing
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {' '}Tech Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect with the tech community through conferences, workshops, meetups, and networking events.
            Find your next learning opportunity or career connection.
          </p>

          {/* Tech Discipline Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            {techDisciplines.map((discipline) => (
              <Button
                key={discipline.id}
                onClick={() => handleDisciplineNavigate(discipline.id)}
                variant="outline"
                className={`
                  h-auto p-4 flex flex-col items-center gap-2 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg
                  bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 group
                  hover:${discipline.color.split(' ')[1]} hover:text-white
                `}
              >
                <discipline.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors" />
                <div>
                  <div className="font-semibold text-xs text-gray-900 dark:text-gray-100 group-hover:text-white transition-colors">
                    {discipline.name}
                  </div>
                  <div className="text-xs mt-1 leading-tight text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                    {discipline.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Active Filter Indicator */}
          {selectedDiscipline && (
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                Showing events for: {techDisciplines.find(d => d.id === selectedDiscipline)?.name}
                <button
                  onClick={() => setSelectedDiscipline(null)}
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
        <div className="space-y-12">
          {/* Featured Events */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Events</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <div key={event.id} onClick={() => handleEventSelect(event)}>
                  <EventCard event={event} onRSVP={handleRSVP} />
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedDiscipline ? 'Filtered Events' : 'Upcoming Events'}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedDiscipline ? filteredEvents : upcomingEvents).slice(0, 6).map(event => (
                <div key={event.id} onClick={() => handleEventSelect(event)}>
                  <EventCard event={event} onRSVP={handleRSVP} />
                </div>
              ))}
            </div>
            {selectedDiscipline && filteredEvents.length === 0 && (
              <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p>Try selecting a different discipline or browse all events in the calendar.</p>
                  <Button 
                    onClick={navigateToCalendar}
                    className="mt-4"
                    variant="outline"
                  >
                    Browse All Events
                  </Button>
                </div>
              </Card>
            )}
          </section>
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