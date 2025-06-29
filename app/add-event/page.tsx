'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
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
  ArrowLeft,
  Loader2,
  Plus,
  X,
  Check,
  Code,
  BarChart3,
  Brain,
  Shield,
  Target,
  Dna,
  Palette,
  Utensils,
  Gift,
} from 'lucide-react';
import { EventCategory, TechDomain } from '@/types/event';
import { eventCategories, techDomains, createEvent } from '@/lib/events';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  state: string;
  country: string;
  venue: string;
  companyName: string;
  domains: TechDomain[];
  categories: EventCategory[];
  originalUrl: string;
  price: string;
  maxAttendees: string;
  imageUrl: string;
  foodAvailable: boolean;
  swagAvailable: boolean;
  isOnline: boolean;
  tags: string[];
}

const domainIcons = {
  'software-engineering': Code,
  'data-science': BarChart3,
  'ai-ml': Brain,
  'cybersecurity': Shield,
  'product-management': Target,
  'biotech': Dna,
  'fintech': DollarSign,
  'ui-ux': Palette,
};

export default function AddEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    state: '',
    country: '',
    venue: '',
    companyName: '',
    domains: [],
    categories: [],
    originalUrl: '',
    price: '0',
    maxAttendees: '',
    imageUrl: '',
    foodAvailable: false,
    swagAvailable: false,
    isOnline: false,
    tags: [],
  });

  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleDomainToggle = (domain: TechDomain) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  const handleCategoryToggle = (category: EventCategory) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Event title is required';
    if (!formData.description.trim()) return 'Event description is required';
    if (!formData.date) return 'Event date is required';
    if (!formData.startTime) return 'Start time is required';
    if (!formData.endTime) return 'End time is required';
    if (!formData.companyName.trim()) return 'Company name is required';
    if (formData.domains.length === 0) return 'At least one domain must be selected';
    if (formData.categories.length === 0) return 'At least one event type must be selected';
    if (!formData.originalUrl.trim()) return 'Original listing URL is required';
    if (!formData.originalUrl.startsWith('http')) return 'Please enter a valid URL';
    
    if (!formData.isOnline) {
      if (!formData.city.trim()) return 'City is required for in-person events';
      if (!formData.state.trim()) return 'State is required for in-person events';
      if (!formData.country.trim()) return 'Country is required for in-person events';
      if (!formData.venue.trim()) return 'Venue is required for in-person events';
    }

    if (formData.maxAttendees && parseInt(formData.maxAttendees) <= 0) {
      return 'Maximum attendees must be a positive number';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create the event with pending status
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.isOnline ? 'Virtual' : `${formData.city}, ${formData.state}`,
        venue: formData.isOnline ? 'Virtual Event' : formData.venue,
        category: formData.categories[0], // Use first selected category
        organizer: formData.companyName,
        company: formData.companyName, // Use company name as the company field
        maxAttendees: parseInt(formData.maxAttendees) || 100,
        price: parseFloat(formData.price) || 0,
        imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        tags: formData.tags,
        isOnline: formData.isOnline,
      };

      const newEvent = createEvent(eventData);
      console.log('Created event:', newEvent);
      
      setSuccess(true);
      
      // Redirect to profile page after success
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center p-8 shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Event Submitted Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your event has been submitted for review and will appear in your profile as "Pending". Once approved, it will be visible to all users on the platform.
            </p>
            <Button onClick={() => router.push('/profile')}>
              View My Events
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={navigateBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Add New Event
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your amazing tech event with the community. Fill out the details below to get started.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about your event and what makes it special
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Event Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., React Summit 2024"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Event Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, what attendees will learn, and why they should attend..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company/Organization Name *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="companyName"
                    placeholder="e.g., Tech Corp, React Community"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalUrl" className="text-sm font-medium">
                  Original Event Listing URL *
                </Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="originalUrl"
                    type="url"
                    placeholder="https://example.com/event"
                    value={formData.originalUrl}
                    onChange={(e) => handleInputChange('originalUrl', e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date and Time */}
          <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Date & Time
              </CardTitle>
              <CardDescription>
                When will your event take place?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Event Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="h-11"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="h-11"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium">
                    End Time *
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="h-11"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location
              </CardTitle>
              <CardDescription>
                Where will your event be held?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => handleInputChange('isOnline', checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="isOnline" className="text-sm font-medium">
                  This is a virtual/online event
                </Label>
              </div>

              {!formData.isOnline && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="San Francisco"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="h-11"
                        disabled={isLoading}
                        required={!formData.isOnline}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State/Province *
                      </Label>
                      <Input
                        id="state"
                        placeholder="California"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="h-11"
                        disabled={isLoading}
                        required={!formData.isOnline}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country *
                      </Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="h-11"
                        disabled={isLoading}
                        required={!formData.isOnline}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue" className="text-sm font-medium">
                      Venue Name *
                    </Label>
                    <Input
                      id="venue"
                      placeholder="e.g., Moscone Center, WeWork, University Campus"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      className="h-11"
                      disabled={isLoading}
                      required={!formData.isOnline}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Domains */}
          <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                Tech Domains *
              </CardTitle>
              <CardDescription>
                Select the technology domains that best describe your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {techDomains.map((domain) => {
                  const IconComponent = domainIcons[domain.value];
                  const isSelected = formData.domains.includes(domain.value);
                  
                  return (
                    <button
                      key={domain.value}
                      type="button"
                      onClick={() => handleDomainToggle(domain.value)}
                      disabled={isLoading}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div>
                          <div className={`font-medium text-sm ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                            {domain.label}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Event Types *
              </CardTitle>
              <CardDescription>
                What type of event are you organizing?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {eventCategories.map((category) => {
                  const isSelected = formData.categories.includes(category.value);
                  
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleCategoryToggle(category.value)}
                      disabled={isLoading}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 text-center
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                      `}
                    >
                      <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${category.color}`} />
                      <div className={`font-medium text-xs ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                        {category.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Additional Details
              </CardTitle>
              <CardDescription>
                Optional information to make your event more appealing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amenities */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Event Amenities</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Utensils className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="foodAvailable" className="text-sm font-medium cursor-pointer">
                        Food Available
                      </Label>
                      <p className="text-xs text-gray-500">Meals, snacks, or refreshments provided</p>
                    </div>
                    <Switch
                      id="foodAvailable"
                      checked={formData.foodAvailable}
                      onCheckedChange={(checked) => handleInputChange('foodAvailable', checked)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Gift className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <Label htmlFor="swagAvailable" className="text-sm font-medium cursor-pointer">
                        Swag Available
                      </Label>
                      <p className="text-xs text-gray-500">T-shirts, stickers, or other giveaways</p>
                    </div>
                    <Switch
                      id="swagAvailable"
                      checked={formData.swagAvailable}
                      onCheckedChange={(checked) => handleInputChange('swagAvailable', checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Ticket Price (USD)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter 0 for free events</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees" className="text-sm font-medium">
                    Maximum Attendees
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="maxAttendees"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Event Image */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-medium">
                  Event Image URL
                </Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/event-image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">Optional: Add a banner image for your event</p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 h-11"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    disabled={!newTag.trim() || isLoading}
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">Add relevant keywords to help people find your event</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={navigateBack}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}