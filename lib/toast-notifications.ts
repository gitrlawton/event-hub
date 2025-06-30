import { User } from '@/types/user';
import { getBadgeInfo, getRankInfo } from '@/lib/engagement';

export interface ToastNotification {
  id: string;
  type: 'badge' | 'rank' | 'streak' | 'xp';
  userName: string;
  userId: string;
  message: string;
  icon: React.ComponentType<any>;
  color: string;
  timestamp: Date;
  data?: {
    badgeId?: string;
    oldRank?: string;
    newRank?: string;
    streakCount?: number;
    xpGained?: number;
    totalXP?: number;
  };
}

// Global toast queue - in a real app, this would be managed by a state management system
let toastQueue: ToastNotification[] = [];
let toastListeners: ((toasts: ToastNotification[]) => void)[] = [];

// Subscribe to toast updates
export function subscribeToToasts(callback: (toasts: ToastNotification[]) => void) {
  toastListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    toastListeners = toastListeners.filter(listener => listener !== callback);
  };
}

// Notify all listeners of toast updates
function notifyListeners() {
  toastListeners.forEach(listener => listener([...toastQueue]));
}

// Add a new toast to the queue
function addToast(toast: ToastNotification) {
  toastQueue.push(toast);
  notifyListeners();
  
  // Auto-remove after 7 seconds
  setTimeout(() => {
    removeToast(toast.id);
  }, 7000);
}

// Remove a toast from the queue
export function removeToast(toastId: string) {
  toastQueue = toastQueue.filter(toast => toast.id !== toastId);
  notifyListeners();
}

// Clear all toasts
export function clearAllToasts() {
  toastQueue = [];
  notifyListeners();
}

// Generate toast for badge milestone
export function createBadgeToast(userName: string, userId: string, badgeId: string): ToastNotification {
  const badge = getBadgeInfo(badgeId);
  
  return {
    id: `badge-${userId}-${badgeId}-${Date.now()}`,
    type: 'badge',
    userName,
    userId,
    message: `@${userName} earned the "${badge.name}" badge!`,
    icon: badge.icon,
    color: 'from-purple-500 to-pink-500',
    timestamp: new Date(),
    data: { badgeId }
  };
}

// Generate toast for rank up
export function createRankUpToast(
  userName: string, 
  userId: string, 
  oldRank: string, 
  newRank: string, 
  totalXP: number
): ToastNotification {
  const rankInfo = getRankInfo(newRank);
  
  return {
    id: `rank-${userId}-${newRank}-${Date.now()}`,
    type: 'rank',
    userName,
    userId,
    message: `@${userName} just reached ${totalXP} XP and is now a ${newRank}!`,
    icon: rankInfo.icon,
    color: 'from-yellow-500 to-orange-500',
    timestamp: new Date(),
    data: { oldRank, newRank, totalXP }
  };
}

// Generate toast for streak milestone
export function createStreakToast(userName: string, userId: string, streakCount: number): ToastNotification {
  return {
    id: `streak-${userId}-${streakCount}-${Date.now()}`,
    type: 'streak',
    userName,
    userId,
    message: `@${userName} is on fire with a ${streakCount}-day posting streak! 🔥`,
    icon: require('lucide-react').Flame,
    color: 'from-orange-500 to-red-500',
    timestamp: new Date(),
    data: { streakCount }
  };
}

// Generate toast for significant XP milestone
export function createXPMilestoneToast(userName: string, userId: string, totalXP: number): ToastNotification {
  return {
    id: `xp-${userId}-${totalXP}-${Date.now()}`,
    type: 'xp',
    userName,
    userId,
    message: `@${userName} just hit ${totalXP} XP! Amazing contribution to the community! ⚡`,
    icon: require('lucide-react').Zap,
    color: 'from-blue-500 to-cyan-500',
    timestamp: new Date(),
    data: { totalXP }
  };
}

// Main function to trigger toasts based on engagement updates
export function triggerEngagementToasts(
  userName: string,
  userId: string,
  engagementUpdate: {
    xpGained: number;
    newBadges: string[];
    rankUp: { rankUp: boolean; oldRank: string; newRank: string };
    streakExtended: boolean;
    xpBreakdown: string[];
  },
  userStats: { xp: number; streakCount: number }
) {
  // Badge milestone toasts
  engagementUpdate.newBadges.forEach(badgeId => {
    const toast = createBadgeToast(userName, userId, badgeId);
    addToast(toast);
  });

  // Rank up toast
  if (engagementUpdate.rankUp.rankUp) {
    const toast = createRankUpToast(
      userName,
      userId,
      engagementUpdate.rankUp.oldRank,
      engagementUpdate.rankUp.newRank,
      userStats.xp
    );
    addToast(toast);
  }

  // Streak milestone toast (every 5 days)
  if (engagementUpdate.streakExtended && userStats.streakCount % 5 === 0 && userStats.streakCount > 0) {
    const toast = createStreakToast(userName, userId, userStats.streakCount);
    addToast(toast);
  }

  // XP milestone toast (every 100 XP)
  if (userStats.xp % 100 === 0 && userStats.xp > 0 && engagementUpdate.xpGained > 0) {
    const toast = createXPMilestoneToast(userName, userId, userStats.xp);
    addToast(toast);
  }
}

// Get current toast queue
export function getCurrentToasts(): ToastNotification[] {
  return [...toastQueue];
}