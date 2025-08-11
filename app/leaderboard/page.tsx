"use client";

import { useState, useMemo } from "react";
import { User } from "@/types/user";
import { getAllUsers } from "@/lib/users";
import { getAllEvents } from "@/lib/events";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Crown,
  Target,
  ArrowLeft,
  CheckCircle,
  Flame,
  Clock,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getRankInfo, calculateUserStats } from "@/lib/engagement";

type TimeFilter = "daily" | "weekly" | "monthly" | "all-time";
type LeaderboardType = "xp" | "streak" | "events";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("xp");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all-time");
  const router = useRouter();

  // Get all users and calculate their engagement stats
  const usersWithStats = useMemo(() => {
    const users = getAllUsers();
    return users.map((user) => ({
      ...user,
      ...calculateUserStats(user),
    }));
  }, []);

  // Filter users based on time period for daily/weekly/monthly contributors
  const filteredUsers = useMemo(() => {
    if (timeFilter === "all-time") {
      return usersWithStats;
    }

    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return usersWithStats;
    }

    // Filter users who have posted events in the time period
    return usersWithStats.filter((user) => {
      if (!user.lastPostDate) return false;
      return user.lastPostDate >= startDate;
    });
  }, [usersWithStats, timeFilter]);

  // Sort users based on active tab
  const sortedUsers = useMemo(() => {
    const users = [...filteredUsers];

    switch (activeTab) {
      case "xp":
        return users.sort((a, b) => b.xp - a.xp);
      case "streak":
        return users.sort((a, b) => b.streakCount - a.streakCount);
      case "events":
        return users.sort((a, b) => b.eventsPosted - a.eventsPosted);

      default:
        return users;
    }
  }, [filteredUsers, activeTab]);

  const navigateBack = () => {
    router.back();
  };

  const navigateToUserProfile = (userName: string) => {
    const encodedName = encodeURIComponent(userName);
    router.push(`/user/${encodedName}`);
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Master Curator":
        return <Crown className="h-5 w-5 text-purple-500" />;
      case "Event Champion":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "Community Builder":
        return <Award className="h-5 w-5 text-blue-500" />;
      case "Connector":
        return <Target className="h-5 w-5 text-green-500" />;
      case "Contributor":
        return <Star className="h-5 w-5 text-orange-500" />;
      default:
        return <Medal className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Master Curator":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Event Champion":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Community Builder":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Connector":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Contributor":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-gray-500">#{position}</span>
        );
    }
  };

  const getTabIcon = (tab: LeaderboardType) => {
    switch (tab) {
      case "xp":
        return <Zap className="h-4 w-4" />;
      case "streak":
        return <Flame className="h-4 w-4" />;
      case "events":
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTabLabel = (tab: LeaderboardType) => {
    switch (tab) {
      case "xp":
        return "Total XP";
      case "streak":
        return "Streak Count";
      case "events":
        return "Events Created";
    }
  };

  // Enhanced metallic podium card styles for Top 3
  const getPodiumCardClasses = (position: number) => {
    switch (position) {
      case 1:
        return [
          // Enhanced Gold - HSL-based authentic gold colors
          "bg-gradient-to-br from-[hsl(48,100%,95%)] via-[hsl(45,100%,85%)] to-[hsl(42,100%,75%)]",
          "dark:bg-gradient-to-br dark:from-[hsl(45,80%,15%)] dark:via-[hsl(42,70%,25%)] dark:to-[hsl(38,60%,35%)]",
          "border border-[hsl(45,85%,65%)] dark:border-[hsl(42,70%,45%)]",
          "shadow-lg shadow-[hsl(45,100%,50%)]/15",
          "hover:shadow-2xl hover:shadow-[hsl(45,100%,50%)]/30 transition-all duration-500",
        ].join(" ");
      case 2:
        return [
          // Enhanced Silver - True metallic silver HSL colors
          "bg-gradient-to-br from-[hsl(210,15%,95%)] via-[hsl(210,10%,85%)] to-[hsl(210,8%,75%)]",
          "dark:bg-gradient-to-br dark:from-[hsl(210,15%,20%)] dark:via-[hsl(210,12%,30%)] dark:to-[hsl(210,10%,40%)]",
          "border border-[hsl(210,12%,65%)] dark:border-[hsl(210,15%,55%)]",
          "shadow-lg shadow-[hsl(210,15%,40%)]/15",
          "hover:shadow-xl hover:shadow-[hsl(210,15%,40%)]/25 transition-all duration-500",
        ].join(" ");
      case 3:
        return [
          // Enhanced Bronze - Authentic bronze HSL colors
          "bg-gradient-to-br from-[hsl(30,65%,90%)] via-[hsl(25,70%,80%)] to-[hsl(20,75%,70%)]",
          "dark:bg-gradient-to-br dark:from-[hsl(25,60%,18%)] dark:via-[hsl(20,65%,28%)] dark:to-[hsl(15,70%,38%)]",
          "border border-[hsl(25,70%,60%)] dark:border-[hsl(20,65%,50%)]",
          "shadow-lg shadow-[hsl(25,70%,45%)]/15",
          "hover:shadow-xl hover:shadow-[hsl(25,70%,45%)]/25 transition-all duration-500",
        ].join(" ");
      default:
        return "";
    }
  };

  const getPodiumAccentBarClasses = (position: number) => {
    switch (position) {
      case 1:
        return "from-[hsl(45,100%,60%)] via-[hsl(42,100%,55%)] to-[hsl(38,100%,50%)]";
      case 2:
        return "from-[hsl(210,15%,70%)] via-[hsl(210,12%,60%)] to-[hsl(210,10%,50%)]";
      case 3:
        return "from-[hsl(30,75%,65%)] via-[hsl(25,80%,60%)] to-[hsl(20,85%,55%)]";
      default:
        return "from-blue-400 to-purple-500";
    }
  };

  const getMetallicShineOverlay = (position: number) => {
    const baseShine = "pointer-events-none absolute inset-0";
    switch (position) {
      case 1:
        // Gold shine with warm tones
        return `${baseShine} bg-gradient-to-br from-[hsl(45,100%,95%)]/40 via-transparent to-[hsl(42,100%,85%)]/20 opacity-70`;
      case 2:
        // Silver shine with cool tones
        return `${baseShine} bg-gradient-to-br from-[hsl(210,20%,98%)]/50 via-transparent to-[hsl(210,15%,90%)]/25 opacity-60`;
      case 3:
        // Bronze shine with warm copper tones
        return `${baseShine} bg-gradient-to-br from-[hsl(30,80%,95%)]/45 via-transparent to-[hsl(25,75%,85%)]/20 opacity-65`;
      default:
        return baseShine;
    }
  };

  const getShineAnimation = (position: number) => {
    switch (position) {
      case 1:
        // Gold shine
        return `shine-overlay shine-gold animate-[shine_5s_ease-in-out_infinite]`;
      case 2:
        // Silver shine
        return `shine-overlay shine-silver animate-[shine_5s_ease-in-out_infinite]`;
      case 3:
        // Bronze shine
        return `shine-overlay shine-bronze animate-[shine_5s_ease-in-out_infinite]`;
      default:
        return "shine-overlay";
    }
  };

  const getTimeFilterIcon = (filter: TimeFilter) => {
    switch (filter) {
      case "daily":
        return <Clock className="h-4 w-4" />;
      case "weekly":
        return <CalendarDays className="h-4 w-4" />;
      case "monthly":
        return <Calendar className="h-4 w-4" />;
      case "all-time":
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getPrimaryMetric = (
    user: User & ReturnType<typeof calculateUserStats>
  ) => {
    switch (activeTab) {
      case "xp":
        return `${user.xp} XP`;
      case "streak":
        return `${user.streakCount} day${user.streakCount !== 1 ? "s" : ""}`;
      case "events":
        return `${user.eventsPosted} event${user.eventsPosted !== 1 ? "s" : ""}`;
    }
  };

  const getSecondaryMetrics = (
    user: User & ReturnType<typeof calculateUserStats>
  ) => {
    const metrics = [];
    if (activeTab !== "xp")
      metrics.push({
        icon: Zap,
        value: `${user.xp} XP`,
        color: "text-yellow-500",
      });
    if (activeTab !== "streak")
      metrics.push({
        icon: Flame,
        value: `${user.streakCount}`,
        color: "text-orange-500",
      });
    if (activeTab !== "events")
      metrics.push({
        icon: Calendar,
        value: `${user.eventsPosted}`,
        color: "text-blue-500",
      });

    return metrics.slice(0, 2); // Show max 2 secondary metrics
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* CSS animations for shine effects */}
      <style jsx>{`
        .shine-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .shine-gold {
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 15%,
            rgba(255, 215, 0, 0.2) 20%,
            rgba(255, 215, 0, 0.4) 23%,
            rgba(255, 255, 255, 0.8) 25%,
            rgba(255, 215, 0, 0.4) 27%,
            rgba(255, 215, 0, 0.2) 30%,
            transparent 35%,
            transparent 100%
          );
          background-size: 400% 400%;
          background-repeat: no-repeat;
        }

        .shine-silver {
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 15%,
            rgba(192, 192, 192, 0.2) 20%,
            rgba(192, 192, 192, 0.4) 23%,
            rgba(255, 255, 255, 0.9) 25%,
            rgba(192, 192, 192, 0.4) 27%,
            rgba(192, 192, 192, 0.2) 30%,
            transparent 35%,
            transparent 100%
          );
          background-size: 400% 400%;
          background-repeat: no-repeat;
        }

        .shine-bronze {
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 15%,
            rgba(205, 127, 50, 0.2) 20%,
            rgba(205, 127, 50, 0.4) 23%,
            rgba(255, 255, 255, 0.7) 25%,
            rgba(205, 127, 50, 0.4) 27%,
            rgba(205, 127, 50, 0.2) 30%,
            transparent 35%,
            transparent 100%
          );
          background-size: 400% 400%;
          background-repeat: no-repeat;
        }

        @keyframes shine {
          0% {
            background-position: -100% -100%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Leaderboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how community members rank based on their event curation
            activity and engagement.
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            {(["daily", "weekly", "monthly", "all-time"] as TimeFilter[]).map(
              (filter) => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeFilter(filter)}
                  className="flex items-center gap-2 capitalize"
                >
                  {getTimeFilterIcon(filter)}
                  {filter === "all-time" ? "All Time" : filter}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Top Contributors{" "}
            {timeFilter !== "all-time" &&
              `(${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)})`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sortedUsers.slice(0, 3).map((user, index) => {
              const position = index + 1;

              return (
                <Card
                  key={`podium-${position}`}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${getPodiumCardClasses(position)}`}
                  onClick={() => navigateToUserProfile(user.name)}
                >
                  {/* Enhanced metallic shine overlay */}
                  <div className={getMetallicShineOverlay(position)} />
                  {/* Shine animation overlay */}
                  <div className={getShineAnimation(position)} />
                  {/* Additional highlight for extra metallicness */}
                  <div className="pointer-events-none absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.8),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.4)_50%,transparent_70%)]" />
                  </div>

                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {getPositionIcon(position)}
                    </div>

                    <Avatar className="h-16 w-16 mx-auto mb-4">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {user.name}
                      </h3>
                      {user.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>

                    <Badge className={`mb-3 ${getRankColor(user.rank)}`}>
                      {getRankIcon(user.rank)}
                      <span className="ml-1">{user.rank}</span>
                    </Badge>

                    {/* Primary Metric */}
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {getPrimaryMetric(user)}
                    </div>

                    {/* Secondary Metrics */}
                    <div className="space-y-1 text-sm">
                      {getSecondaryMetrics(user).map((metric, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center gap-2"
                        >
                          <metric.icon className={`h-4 w-4 ${metric.color}`} />
                          <span>{metric.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Streak Display */}
                    {user.streakCount > 0 && (
                      <div className="mt-3 flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400">
                        <Flame className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {user.streakCount} day streak
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as LeaderboardType)}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {(["xp", "streak", "events"] as LeaderboardType[]).map(
                  (tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex items-center gap-2"
                    >
                      {getTabIcon(tab)}
                      <span className="hidden sm:inline">
                        {getTabLabel(tab)}
                      </span>
                    </TabsTrigger>
                  )
                )}
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {sortedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No contributors found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No users have posted events in the selected time period.
                    </p>
                  </div>
                ) : (
                  sortedUsers.map((user, index) => {
                    const position = index + 1;

                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => navigateToUserProfile(user.name)}
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          {position <= 3 ? (
                            getPositionIcon(position)
                          ) : (
                            <span className="text-sm font-medium text-gray-500">
                              #{position}
                            </span>
                          )}
                        </div>

                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {user.name}
                            </h4>
                            {user.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.role} at {user.company}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <Badge className={getRankColor(user.rank)}>
                            {getRankIcon(user.rank)}
                            <span className="ml-1">{user.rank}</span>
                          </Badge>

                          {/* Primary Metric */}
                          <div className="font-medium text-lg">
                            {getPrimaryMetric(user)}
                          </div>

                          {/* Secondary Metrics */}
                          <div className="hidden md:flex items-center gap-3">
                            {getSecondaryMetrics(user).map((metric, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1"
                              >
                                <metric.icon
                                  className={`h-4 w-4 ${metric.color}`}
                                />
                                <span>{metric.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
