'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Zap,
  MapPin,
  Search,
  User,
  Settings,
  LogOut,
  Bell,
  Plus,
  Calendar,
  Home,
} from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (search: string) => void;
}

export function Header({ onSearchChange }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in a real app
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleLogin = () => {
    // In a real app, this would open a login modal or redirect to auth page
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear any auth state
  };

  const navigateToHome = () => {
    router.push('/');
  };

  const navigateToCalendar = () => {
    router.push('/calendar');
  };

  const isCalendarPage = pathname === '/calendar';
  const isHomePage = pathname === '/';

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={navigateToHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Happening
              </h1>
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden sm:flex items-center space-x-2 ml-8">
            <Button
              variant={isHomePage ? "default" : "ghost"}
              size="sm"
              onClick={navigateToHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant={isCalendarPage ? "default" : "ghost"}
              size="sm"
              onClick={navigateToCalendar}
              className="flex items-center gap-2"
            >
              Events
            </Button>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events, topics, or organizers..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Location Badge */}
            <Badge variant="outline" className="hidden lg:flex items-center gap-1 px-3 py-1">
              <MapPin className="h-3 w-3" />
              San Francisco Bay Area
            </Badge>

            {/* Mobile Navigation & Search */}
            <div className="sm:hidden flex items-center space-x-2">
              <Button
                variant={isCalendarPage ? "default" : "ghost"}
                size="sm"
                onClick={navigateToCalendar}
                className="h-9 w-9 p-0"
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Authentication Section */}
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="hidden sm:flex h-9 w-9 p-0 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* Create Event Button */}
                <Button size="sm" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="md:hidden cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogin}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Log In
                </Button>
                <Button 
                  size="sm"
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Shown below header on mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}