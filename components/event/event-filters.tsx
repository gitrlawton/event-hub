'use client';

import { useState, useEffect } from 'react';
import { EventCategory, TechDomain } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, Code, BarChart3, Brain, Shield, Target, Dna, DollarSign, Palette, Building2 } from 'lucide-react';
import { eventCategories, techDomains, getUniqueCompanies, getAllEvents } from '@/lib/events';

interface EventFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category?: EventCategory;
    domain?: TechDomain;
    company?: string;
    isOnline?: boolean;
  }) => void;
  initialDomain?: TechDomain;
  currentFilters?: {
    search: string;
    category?: EventCategory;
    domain?: TechDomain;
    company?: string;
    isOnline?: boolean;
  };
}

const domainIcons = {
  'Code': Code,
  'BarChart3': BarChart3,
  'Brain': Brain,
  'Shield': Shield,
  'Target': Target,
  'Dna': Dna,
  'DollarSign': DollarSign,
  'Palette': Palette,
};

export function EventFilters({ onFiltersChange, initialDomain, currentFilters }: EventFiltersProps) {
  const [search, setSearch] = useState(currentFilters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | undefined>(currentFilters?.category);
  const [selectedDomain, setSelectedDomain] = useState<TechDomain | undefined>(currentFilters?.domain || initialDomain);
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(currentFilters?.company);
  const [onlineOnly, setOnlineOnly] = useState<boolean | undefined>(currentFilters?.isOnline);
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);

  // Get unique companies for the dropdown
  useEffect(() => {
    const allEvents = getAllEvents();
    setCompanies(getUniqueCompanies(allEvents));
  }, []);

  // Update state when currentFilters change (from parent component)
  useEffect(() => {
    if (currentFilters) {
      setSearch(currentFilters.search || '');
      setSelectedCategory(currentFilters.category);
      setSelectedDomain(currentFilters.domain);
      setSelectedCompany(currentFilters.company);
      setOnlineOnly(currentFilters.isOnline);
    }
  }, [currentFilters]);

  // Update selectedDomain when initialDomain changes
  useEffect(() => {
    if (initialDomain && !selectedDomain) {
      setSelectedDomain(initialDomain);
    }
  }, [initialDomain, selectedDomain]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({
      search: value,
      category: selectedCategory,
      domain: selectedDomain,
      company: selectedCompany,
      isOnline: onlineOnly,
    });
  };

  const handleCategoryChange = (category: EventCategory | undefined) => {
    setSelectedCategory(category);
    onFiltersChange({
      search,
      category,
      domain: selectedDomain,
      company: selectedCompany,
      isOnline: onlineOnly,
    });
  };

  const handleDomainChange = (domain: string) => {
    const domainValue = domain === 'all' ? undefined : domain as TechDomain;
    setSelectedDomain(domainValue);
    onFiltersChange({
      search,
      category: selectedCategory,
      domain: domainValue,
      company: selectedCompany,
      isOnline: onlineOnly,
    });
  };

  const handleCompanyChange = (company: string) => {
    const companyValue = company === 'all' ? undefined : company;
    setSelectedCompany(companyValue);
    onFiltersChange({
      search,
      category: selectedCategory,
      domain: selectedDomain,
      company: companyValue,
      isOnline: onlineOnly,
    });
  };

  const handleOnlineToggle = (checked: boolean) => {
    const value = checked ? true : undefined;
    setOnlineOnly(value);
    onFiltersChange({
      search,
      category: selectedCategory,
      domain: selectedDomain,
      company: selectedCompany,
      isOnline: value,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(undefined);
    setSelectedDomain(undefined);
    setSelectedCompany(undefined);
    setOnlineOnly(undefined);
    onFiltersChange({
      search: '',
      category: undefined,
      domain: undefined,
      company: undefined,
      isOnline: undefined,
    });
  };

  const hasActiveFilters = search || selectedCategory || selectedDomain || selectedCompany || onlineOnly;

  const selectedDomainData = techDomains.find(d => d.value === selectedDomain);

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

      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events, topics, companies, or organizers..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filters Toggle */}
        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Filter Row 1: Domain and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Domain Filter Dropdown */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tech Domain</Label>
              <Select value={selectedDomain || 'all'} onValueChange={handleDomainChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedDomain ? (
                      <div className="flex items-center gap-2">
                        {selectedDomainData && (
                          <>
                            {(() => {
                              const IconComponent = domainIcons[selectedDomainData.icon as keyof typeof domainIcons];
                              return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                            })()}
                            <span>{selectedDomainData.label}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      'All Domains'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <span>All Domains</span>
                    </div>
                  </SelectItem>
                  {techDomains.map((domain) => {
                    const IconComponent = domainIcons[domain.icon as keyof typeof domainIcons];
                    return (
                      <SelectItem key={domain.value} value={domain.value}>
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <span>{domain.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter Dropdown */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Company</Label>
              <Select value={selectedCompany || 'all'} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedCompany ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{selectedCompany}</span>
                      </div>
                    ) : (
                      'All Companies'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <span>All Companies</span>
                    </div>
                  </SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{company}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
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
              Virtual events only
            </Label>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{search}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSearchChange('')}
                    />
                  </Badge>
                )}
                {selectedDomain && (
                  <Badge variant="secondary" className="gap-1">
                    {techDomains.find(d => d.value === selectedDomain)?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleDomainChange('all')}
                    />
                  </Badge>
                )}
                {selectedCompany && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCompany}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCompanyChange('all')}
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
                    Virtual Only
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleOnlineToggle(false)}
                    />
                  </Badge>
                )}
              </div>
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