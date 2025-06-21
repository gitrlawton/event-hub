'use client';

import { useState } from 'react';
import { EventCategory } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';
import { eventCategories } from '@/lib/events';

interface EventFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category?: EventCategory;
    isOnline?: boolean;
  }) => void;
}

export function EventFilters({ onFiltersChange }: EventFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | undefined>();
  const [onlineOnly, setOnlineOnly] = useState<boolean | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({
      search: value,
      category: selectedCategory,
      isOnline: onlineOnly,
    });
  };

  const handleCategoryChange = (category: EventCategory | undefined) => {
    setSelectedCategory(category);
    onFiltersChange({
      search,
      category,
      isOnline: onlineOnly,
    });
  };

  const handleOnlineToggle = (checked: boolean) => {
    const value = checked ? true : undefined;
    setOnlineOnly(value);
    onFiltersChange({
      search,
      category: selectedCategory,
      isOnline: value,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(undefined);
    setOnlineOnly(undefined);
    onFiltersChange({
      search: '',
      category: undefined,
      isOnline: undefined,
    });
  };

  const hasActiveFilters = search || selectedCategory || onlineOnly;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Events
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events, topics, or organizers..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filters Toggle */}
        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Type</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(undefined)}
                className="h-8"
              >
                All Types
              </Button>
              {eventCategories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.value)}
                  className="h-8"
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${category.color}`} />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Online Only Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="online-only"
              checked={onlineOnly === true}
              onCheckedChange={handleOnlineToggle}
            />
            <Label htmlFor="online-only" className="text-sm font-medium">
              Online events only
            </Label>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {search && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{search}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleSearchChange('')}
                  />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {eventCategories.find(c => c.value === selectedCategory)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategoryChange(undefined)}
                  />
                </Badge>
              )}
              {onlineOnly && (
                <Badge variant="secondary" className="gap-1">
                  Online Only
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleOnlineToggle(false)}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-6 px-2 ml-auto"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}