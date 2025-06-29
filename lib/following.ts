import { User } from '@/types/user';
import { getAllUsers } from '@/lib/users';

// Mock following relationships - in a real app, this would be in a database
let followingRelationships: { [userId: string]: string[] } = {
  'user-1': ['user-2', 'user-3'], // John follows Sarah and Mike
};

// Function to follow a user
export function followUser(currentUserId: string, targetUserId: string): void {
  if (!followingRelationships[currentUserId]) {
    followingRelationships[currentUserId] = [];
  }
  
  if (!followingRelationships[currentUserId].includes(targetUserId)) {
    followingRelationships[currentUserId].push(targetUserId);
  }
}

// Function to unfollow a user
export function unfollowUser(currentUserId: string, targetUserId: string): void {
  if (followingRelationships[currentUserId]) {
    followingRelationships[currentUserId] = followingRelationships[currentUserId].filter(
      id => id !== targetUserId
    );
  }
}

// Function to check if user is following another user
export function isFollowing(currentUserId: string, targetUserId: string): boolean {
  return followingRelationships[currentUserId]?.includes(targetUserId) || false;
}

// Function to get users that current user is following
export function getFollowing(userId: string): User[] {
  const followingIds = followingRelationships[userId] || [];
  const allUsers = getAllUsers();
  return allUsers.filter(user => followingIds.includes(user.id));
}

// Function to get followers of a user
export function getFollowers(userId: string): User[] {
  const allUsers = getAllUsers();
  return allUsers.filter(user => 
    followingRelationships[user.id]?.includes(userId) || false
  );
}

// Function to get following count
export function getFollowingCount(userId: string): number {
  return followingRelationships[userId]?.length || 0;
}

// Function to get followers count
export function getFollowersCount(userId: string): number {
  const allUsers = getAllUsers();
  return allUsers.filter(user => 
    followingRelationships[user.id]?.includes(userId) || false
  ).length;
}