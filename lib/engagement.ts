import { User } from '@/types/user';
import { Event, EventCategory } from '@/types/event';
import { 
  Star, 
  Calendar, 
  Trophy, 
  Award, 
  Crown, 
  Zap,
  Target,
  Medal,
  Shield,
  Flame
} from 'lucide-react';

// Badge Definitions
export const badges = {
  'first-event': {
    id: 'first-event',
    name: 'First Event',
    description: 'Created your first event',
    icon: Star,
    requirement: 1,
    xpReward: 10,
  },
  'event-cadence': {
    id: 'event-cadence',
    name: 'Event Cadence',
    description: 'Created 5 events',
    icon: Calendar,
    requirement: 5,
    xpReward: 25,
  },
  'super-host': {
    id: 'super-host',
    name: 'Super Host',
    description: 'Created 10 events',
    icon: Trophy,
    requirement: 10,
    xpReward: 50,
  },
  'marathon-poster': {
    id: 'marathon-poster',
    name: 'Marathon Poster',
    description: 'Created 25 events',
    icon: Award,
    requirement: 25,
    xpReward: 100,
  },
  'legendary-curator': {
    id: 'legendary-curator',
    name: 'Legendary Curator',
    description: 'Created 50 events',
    icon: Crown,
    requirement: 50,
    xpReward: 200,
  },
} as const;

// Rank Tiers
export const ranks = {
  'Newbie': {
    name: 'Newbie',
    minXp: 0,
    maxXp: 9,
    color: 'gray',
    icon: Medal,
  },
  'Contributor': {
    name: 'Contributor',
    minXp: 10,
    maxXp: 29,
    color: 'orange',
    icon: Star,
  },
  'Connector': {
    name: 'Connector',
    minXp: 30,
    maxXp: 69,
    color: 'green',
    icon: Target,
  },
  'Community Builder': {
    name: 'Community Builder',
    minXp: 70,
    maxXp: 149,
    color: 'blue',
    icon: Award,
  },
  'Event Champion': {
    name: 'Event Champion',
    minXp: 150,
    maxXp: 299,
    color: 'yellow',
    icon: Trophy,
  },
  'Master Curator': {
    name: 'Master Curator',
    minXp: 300,
    maxXp: Infinity,
    color: 'purple',
    icon: Crown,
  },
} as const;

// Helper function to check if dates are consecutive days
function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Calculate streak based on last post date
export function calculateNewStreak(lastPostDate: Date | null, currentStreakCount: number): number {
  if (!lastPostDate) {
    return 1; // First event
  }

  if (isToday(lastPostDate)) {
    // Already posted today, maintain streak
    return currentStreakCount;
  } else if (isYesterday(lastPostDate)) {
    // Posted yesterday, increment streak
    return currentStreakCount + 1;
  } else {
    // Gap in posting, reset streak
    return 1;
  }
}

// Check if event has high-quality metadata
function hasHighQualityMetadata(event: Partial<Event>): boolean {
  const hasImage = event.imageUrl && event.imageUrl.trim() !== '';
  const hasLocation = event.location && event.location.trim() !== '';
  const hasTags = event.tags && event.tags.length > 0;
  
  return hasImage && hasLocation && hasTags;
}

// Check if this is first event in a new category for user
function isFirstInCategory(category: EventCategory, userCreatedEvents: Event[]): boolean {
  return !userCreatedEvents.some(event => event.category === category);
}

// Award XP based on event creation
export function calculateEventXP(
  event: Partial<Event>, 
  user: User, 
  userCreatedEvents: Event[] = [],
  newStreakCount: number
): {
  baseXP: number;
  bonusXP: number;
  streakBonusXP: number;
  categoryBonusXP: number;
  rsvpBonusXP: number;
  totalXP: number;
  breakdown: string[];
} {
  let baseXP = 10; // Base XP per event
  let bonusXP = 0;
  let streakBonusXP = 0;
  let categoryBonusXP = 0;
  let rsvpBonusXP = 0;
  const breakdown: string[] = [];

  breakdown.push(`+${baseXP} XP for creating event`);

  // High-quality metadata bonus
  if (hasHighQualityMetadata(event)) {
    bonusXP += 5;
    breakdown.push(`+5 XP for high-quality metadata (image, location, tags)`);
  }

  // First event in new category bonus
  if (event.category && isFirstInCategory(event.category, userCreatedEvents)) {
    categoryBonusXP = 25;
    breakdown.push(`+25 XP for first event in ${event.category} category`);
  }

  // Streak bonus (every day streak is extended)
  if (newStreakCount > 1) {
    streakBonusXP = 10;
    breakdown.push(`+10 XP for extending streak to ${newStreakCount} days`);
  }

  // RSVP bonus (if event hits 50+ RSVPs)
  if (event.attendees && event.attendees >= 50) {
    rsvpBonusXP = 50;
    breakdown.push(`+50 XP for event reaching 50+ RSVPs`);
  }

  const totalXP = baseXP + bonusXP + streakBonusXP + categoryBonusXP + rsvpBonusXP;

  return {
    baseXP,
    bonusXP,
    streakBonusXP,
    categoryBonusXP,
    rsvpBonusXP,
    totalXP,
    breakdown
  };
}

// Check for new badges based on events posted
export function checkForNewBadges(eventsPosted: number, currentBadges: string[]): string[] {
  const newBadges: string[] = [];
  
  Object.values(badges).forEach(badge => {
    if (eventsPosted >= badge.requirement && !currentBadges.includes(badge.id)) {
      newBadges.push(badge.id);
    }
  });
  
  return newBadges;
}

// Determine rank based on XP
export function getRankFromXP(xp: number): string {
  for (const [rankName, rankInfo] of Object.entries(ranks)) {
    if (xp >= rankInfo.minXp && xp <= rankInfo.maxXp) {
      return rankName;
    }
  }
  return 'Newbie';
}

// Check if user crossed into new rank tier
export function checkForRankUp(oldXP: number, newXP: number): { rankUp: boolean; oldRank: string; newRank: string } {
  const oldRank = getRankFromXP(oldXP);
  const newRank = getRankFromXP(newXP);
  
  return {
    rankUp: oldRank !== newRank,
    oldRank,
    newRank
  };
}

// Main function to update user stats when they create an event
export function updateUserStatsOnEventCreation(
  user: User, 
  event: Partial<Event>, 
  userCreatedEvents: Event[] = []
): {
  updatedUser: Partial<User>;
  xpGained: number;
  newBadges: string[];
  rankUp: { rankUp: boolean; oldRank: string; newRank: string };
  streakExtended: boolean;
  xpBreakdown: string[];
} {
  // Calculate new streak
  const newStreakCount = calculateNewStreak(user.lastPostDate, user.streakCount || 0);
  const streakExtended = newStreakCount > (user.streakCount || 0);

  // Calculate XP for this event
  const xpCalculation = calculateEventXP(event, user, userCreatedEvents, newStreakCount);

  // Update events posted count
  const newEventsPosted = (user.eventsPosted || 0) + 1;

  // Check for new badges
  const newBadges = checkForNewBadges(newEventsPosted, user.badges || []);
  const updatedBadges = [...(user.badges || []), ...newBadges];

  // Calculate new total XP
  const oldXP = user.xp || 0;
  const newXP = oldXP + xpCalculation.totalXP;

  // Check for rank up
  const rankUp = checkForRankUp(oldXP, newXP);

  // Create updated user object
  const updatedUser: Partial<User> = {
    eventsPosted: newEventsPosted,
    xp: newXP,
    rank: rankUp.newRank,
    badges: updatedBadges,
    streakCount: newStreakCount,
    lastPostDate: new Date(),
  };

  return {
    updatedUser,
    xpGained: xpCalculation.totalXP,
    newBadges,
    rankUp,
    streakExtended,
    xpBreakdown: xpCalculation.breakdown,
  };
}

// Get badge info by ID
export function getBadgeInfo(badgeId: string) {
  return badges[badgeId as keyof typeof badges];
}

// Get rank info by name
export function getRankInfo(rankName: string) {
  return ranks[rankName as keyof typeof ranks];
}

// Calculate all user engagement stats (for existing users)
export function calculateUserStats(user: User) {
  // Use existing data or fallback to eventsCreated
  const eventsPosted = user.eventsPosted || user.eventsCreated || 0;
  const xp = user.xp || 0;
  const rank = user.rank || getRankFromXP(xp);
  const badges = user.badges || [];
  const streakCount = user.streakCount || 0;
  
  return {
    xp,
    rank,
    badges,
    eventsPosted,
    streakCount,
    lastPostDate: user.lastPostDate || null,
  };
}

// Get next rank info for progress display
export function getNextRankInfo(currentXP: number): { nextRank: string; xpNeeded: number; progress: number } | null {
  const currentRank = getRankFromXP(currentXP);
  const rankEntries = Object.entries(ranks);
  const currentRankIndex = rankEntries.findIndex(([name]) => name === currentRank);
  
  if (currentRankIndex === -1 || currentRankIndex === rankEntries.length - 1) {
    return null; // Already at max rank
  }
  
  const nextRankEntry = rankEntries[currentRankIndex + 1];
  const nextRank = nextRankEntry[0];
  const nextRankInfo = nextRankEntry[1];
  
  const xpNeeded = nextRankInfo.minXp - currentXP;
  const currentRankInfo = ranks[currentRank as keyof typeof ranks];
  const progress = ((currentXP - currentRankInfo.minXp) / (nextRankInfo.minXp - currentRankInfo.minXp)) * 100;
  
  return {
    nextRank,
    xpNeeded,
    progress: Math.min(100, Math.max(0, progress))
  };
}