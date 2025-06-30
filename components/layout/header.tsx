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
import { ThemeToggle } from '@/components/theme/theme-toggle';
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
  Shield,
  Trophy,
} from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (search: string) => void;
}

export function Header({ onSearchChange }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Changed from false to true to show Add Event button
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleLogin = () => {
    // Navigate to login page
    router.push('/login');
  };

  const handleSignup = () => {
    // Navigate to signup page
    router.push('/signup');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear any auth state and redirect to home
    router.push('/');
  };

  const navigateToHome = () => {
    router.push('/');
  };

  const navigateToCalendar = () => {
    router.push('/calendar');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToAddEvent = () => {
    router.push('/add-event');
  };

  const navigateToAdmin = () => {
    router.push('/admin');
  };

  const navigateToLeaderboard = () => {
    router.push('/leaderboard');
  };

  const isCalendarPage = pathname === '/calendar';
  const isHomePage = pathname === '/';
  const isProfilePage = pathname === '/profile';
  const isAddEventPage = pathname === '/add-event';
  const isAdminPage = pathname === '/admin';
  const isLeaderboardPage = pathname === '/leaderboard';

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={navigateToHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
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
              <Calendar className="h-4 w-4" />
              Events
            </Button>
            <Button
              variant={isLeaderboardPage ? "default" : "ghost"}
              size="sm"
              onClick={navigateToLeaderboard}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Button>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search events, topics, or organizers..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-blue-200 dark:focus:ring-blue-800"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

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
              <Button
                variant={isLeaderboardPage ? "default" : "ghost"}
                size="sm"
                onClick={navigateToLeaderboard}
                className="h-9 w-9 p-0"
              >
                <Trophy className="h-4 w-4" />
              </Button>
              {isLoggedIn && (
                <Button
                  variant={isProfilePage ? "default" : "ghost"}
                  size="sm"
                  onClick={navigateToProfile}
                  className="h-9 w-9 p-0"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Authentication Section */}
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="hidden sm:flex h-9 w-9 p-0 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* Add Event Button */}
                <Button 
                  size="sm" 
                  onClick={navigateToAddEvent}
                  className={`hidden md:flex items-center gap-2 ${
                    isAddEventPage 
                      ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700' 
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">john@example.com</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={navigateToProfile}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="md:hidden cursor-pointer" onClick={navigateToAddEvent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={navigateToAdmin}>
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
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
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Log In
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSignup}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search events..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </div>
        </div>
      </div>
    </header>
  );
}