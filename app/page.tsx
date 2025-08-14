"use client";

import { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { Event } from "@/types/event";
import { getAllEvents, filterEvents } from "@/lib/events";
import { Header } from "@/components/layout/header";
import { EventCard } from "@/components/event/event-card";
import { EventDetailModal } from "@/components/event/event-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { useRouter } from "next/navigation";

const techDisciplines = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    icon: Code,
    color:
      "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    description: "Development, Architecture, DevOps",
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: BarChart3,
    color:
      "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    description: "Analytics, Visualization, Statistics",
  },
  {
    id: "ai-ml",
    name: "AI / Machine Learning",
    icon: Brain,
    color:
      "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
    description: "Neural Networks, Deep Learning, NLP",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: Shield,
    color: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    description: "Security, Privacy, Risk Management",
  },
  {
    id: "product-management",
    name: "Product Management",
    icon: Target,
    color:
      "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
    description: "Strategy, UX, Product Development",
  },
  {
    id: "biotech",
    name: "Biotech",
    icon: Dna,
    color:
      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700",
    description: "Genomics, Bioinformatics, Healthcare",
  },
  {
    id: "fintech",
    name: "Fintech",
    icon: DollarSignIcon,
    color:
      "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
    description: "Banking, Payments, Cryptocurrency",
  },
  {
    id: "ui-ux",
    name: "UI / UX",
    icon: Palette,
    color:
      "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700",
    description: "Design, User Research, Prototyping",
  },
];

// Recommendation component for horizontal scrolling
function RecommendationRow({
  title,
  events,
  onEventSelect,
}: {
  title: string;
  events: Event[];
  onEventSelect: (event: Event) => void;
}) {
  const scrollContainerRef = useState<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef[0]) {
      const scrollAmount = 320; // Width of one card plus gap
      scrollContainerRef[0].scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (events.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          {title}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={(el) => scrollContainerRef[1](el)}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="flex-shrink-0 w-80"
            onClick={() => onEventSelect(event)}
          >
            <EventCard event={event} onRSVP={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(
    null
  );
  const [headerSearch, setHeaderSearch] = useState("");
  const { theme, resolvedTheme } = useTheme();
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
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.company.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by selected discipline
    if (selectedDiscipline) {
      const disciplineKeywords = {
        "software-engineering": [
          "react",
          "javascript",
          "web development",
          "frontend",
          "backend",
          "development",
          "programming",
          "coding",
        ],
        "data-science": [
          "data",
          "analytics",
          "visualization",
          "statistics",
          "analysis",
          "insights",
          "metrics",
        ],
        "ai-ml": [
          "ai",
          "machine learning",
          "tensorflow",
          "neural",
          "deep learning",
          "artificial intelligence",
          "ml",
        ],
        cybersecurity: [
          "security",
          "privacy",
          "encryption",
          "blockchain",
          "cyber",
          "protection",
          "vulnerability",
        ],
        "product-management": [
          "product",
          "strategy",
          "roadmap",
          "management",
          "planning",
          "growth",
        ],
        biotech: [
          "biotech",
          "biotechnology",
          "genomics",
          "bioinformatics",
          "healthcare",
          "medical",
          "biology",
          "pharma",
        ],
        fintech: [
          "fintech",
          "finance",
          "banking",
          "payments",
          "cryptocurrency",
          "blockchain",
          "trading",
          "investment",
        ],
        "ui-ux": [
          "ux",
          "ui",
          "design",
          "user experience",
          "user interface",
          "prototyping",
          "research",
          "usability",
        ],
      };

      const keywords =
        disciplineKeywords[
          selectedDiscipline as keyof typeof disciplineKeywords
        ] || [];
      events = events.filter((event) =>
        keywords.some(
          (keyword) =>
            event.title.toLowerCase().includes(keyword) ||
            event.description.toLowerCase().includes(keyword) ||
            event.tags.some((tag) => tag.toLowerCase().includes(keyword))
        )
      );
    }

    return events;
  }, [allEvents, headerSearch, selectedDiscipline]);

  const featuredEvents = useMemo(() => {
    return allEvents.filter((event) => event.featured);
  }, [allEvents]);

  const upcomingEvents = useMemo(() => {
    return allEvents.slice(0, 6); // Show first 6 events
  }, [allEvents]);

  // Get user's registered events to generate recommendations
  const registeredEvents = useMemo(() => {
    return allEvents.filter((event) => event.rsvpStatus === "registered");
  }, [allEvents]);

  // Generate recommendations based on user's registered events
  const recommendations = useMemo(() => {
    if (registeredEvents.length === 0) return null;

    // Get unique companies, domains, and categories from registered events
    const companies = [
      ...new Set(registeredEvents.map((event) => event.company)),
    ];
    const categories = [
      ...new Set(registeredEvents.map((event) => event.category)),
    ];

    // Determine domains based on event content
    const getDomainFromEvent = (event: Event) => {
      const content =
        `${event.title} ${event.description} ${event.tags.join(" ")}`.toLowerCase();

      if (
        content.includes("ai") ||
        content.includes("machine learning") ||
        content.includes("tensorflow")
      )
        return "ai-ml";
      if (
        content.includes("data") ||
        content.includes("analytics") ||
        content.includes("python")
      )
        return "data-science";
      if (
        content.includes("react") ||
        content.includes("javascript") ||
        content.includes("development")
      )
        return "software-engineering";
      if (
        content.includes("security") ||
        content.includes("cyber") ||
        content.includes("blockchain")
      )
        return "cybersecurity";
      if (
        content.includes("product") ||
        content.includes("strategy") ||
        content.includes("management")
      )
        return "product-management";
      if (
        content.includes("ux") ||
        content.includes("ui") ||
        content.includes("design")
      )
        return "ui-ux";
      if (
        content.includes("fintech") ||
        content.includes("finance") ||
        content.includes("crypto")
      )
        return "fintech";
      if (
        content.includes("biotech") ||
        content.includes("bio") ||
        content.includes("healthcare")
      )
        return "biotech";

      return "software-engineering"; // default
    };

    const domains = [...new Set(registeredEvents.map(getDomainFromEvent))];

    // Get events for recommendations (excluding already registered events)
    const availableEvents = allEvents.filter(
      (event) =>
        event.rsvpStatus !== "registered" && event.status === "approved"
    );

    // Company-based recommendations
    const companyRecommendations =
      companies.length > 0
        ? availableEvents
            .filter((event) => companies.includes(event.company))
            .slice(0, 6)
        : [];

    // Domain-based recommendations
    const domainRecommendations =
      domains.length > 0
        ? availableEvents
            .filter((event) => {
              const eventDomain = getDomainFromEvent(event);
              return domains.includes(eventDomain);
            })
            .slice(0, 6)
        : [];

    // Category-based recommendations
    const categoryRecommendations =
      categories.length > 0
        ? availableEvents
            .filter((event) => categories.includes(event.category))
            .slice(0, 6)
        : [];

    return {
      company: {
        name: companies[0], // Use first company for display
        events: companyRecommendations,
      },
      domain: {
        name:
          techDisciplines.find((d) => d.id === domains[0])?.name ||
          "Software Engineering",
        events: domainRecommendations,
      },
      category: {
        name:
          categories[0]?.charAt(0).toUpperCase() + categories[0]?.slice(1) ||
          "Conference",
        events: categoryRecommendations,
      },
    };
  }, [registeredEvents, allEvents]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleRSVP = (eventId: string) => {
    // In a real app, this would make an API call
    console.log("RSVP to event:", eventId);
  };

  const handleDisciplineSelect = (disciplineId: string) => {
    setSelectedDiscipline(
      selectedDiscipline === disciplineId ? null : disciplineId
    );
  };

  const handleDisciplineNavigate = (disciplineId: string) => {
    // Navigate to calendar page with domain filter and grid view
    router.push(`/calendar?domain=${disciplineId}&view=grid`);
  };

  const navigateToCalendar = () => {
    router.push("/calendar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <Header onSearchChange={setHeaderSearch} />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Discover Amazing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {" "}
                Tech Events
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect with the tech community through conferences, workshops,
            meetups, and networking events. Find your next learning opportunity
            or career connection.
          </p>

          {/* Tech Discipline Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            {techDisciplines.map((discipline) => (
              <Button
                key={discipline.id}
                onClick={() => handleDisciplineNavigate(discipline.id)}
                variant="outline"
                className={`
                  h-auto p-4 flex flex-col items-center gap-2 text-center whitespace-normal break-words transition-all duration-300 hover:scale-105 hover:shadow-lg
                  bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 group
                  hover:${discipline.color.split(" ")[1]}
                `}
              >
                <discipline.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-colors" />
                <div>
                  <div className="font-semibold text-xs text-gray-900 dark:text-gray-100 transition-colors">
                    {discipline.name}
                  </div>
                  <div className="text-xs mt-1 leading-tight text-gray-500 dark:text-gray-400 transition-colors whitespace-normal break-words">
                    {discipline.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Active Filter Indicator */}
          {selectedDiscipline && (
            <div className="flex justify-center mb-6">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800"
              >
                Showing events for:{" "}
                {techDisciplines.find((d) => d.id === selectedDiscipline)?.name}
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Featured Events
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="h-full"
                  onClick={() => handleEventSelect(event)}
                >
                  <EventCard event={event} onRSVP={handleRSVP} />
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Events */}
          {recommendations && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Recommended for You
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Based on your event preferences and interests
                </p>
              </div>

              {/* Company-based recommendations */}
              {recommendations.company.events.length > 0 && (
                <RecommendationRow
                  title={`Recommended because you're interested in ${recommendations.company.name}`}
                  events={recommendations.company.events}
                  onEventSelect={handleEventSelect}
                />
              )}

              {/* Domain-based recommendations */}
              {recommendations.domain.events.length > 0 && (
                <RecommendationRow
                  title={`Recommended because you're interested in ${recommendations.domain.name}`}
                  events={recommendations.domain.events}
                  onEventSelect={handleEventSelect}
                />
              )}

              {/* Category-based recommendations */}
              {recommendations.category.events.length > 0 && (
                <RecommendationRow
                  title={`Recommended because you're interested in ${recommendations.category.name} events`}
                  events={recommendations.category.events}
                  onEventSelect={handleEventSelect}
                />
              )}
            </section>
          )}

          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedDiscipline ? "Filtered Events" : "Upcoming Events"}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {(selectedDiscipline ? filteredEvents : upcomingEvents)
                .slice(0, 6)
                .map((event) => (
                  <div
                    key={event.id}
                    className="h-full"
                    onClick={() => handleEventSelect(event)}
                  >
                    <EventCard event={event} onRSVP={handleRSVP} />
                  </div>
                ))}
            </div>
            {selectedDiscipline && filteredEvents.length === 0 && (
              <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p>
                    Try selecting a different discipline or browse all events in
                    the calendar.
                  </p>
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
