import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArticleNotification } from '../types/article';

interface NotificationStore {
  // Pending notifications
  pendingNotifications: ArticleNotification[];

  // Scheduled Expo notification IDs
  scheduledNotificationIds: string[];

  // Actions
  addPendingNotification: (notification: ArticleNotification) => void;
  removePendingNotification: (id: string) => void;
  markNotificationAsSent: (id: string) => void;
  getPendingNotifications: () => ArticleNotification[];
  getUnsentNotifications: () => ArticleNotification[];

  // Scheduled notification tracking
  addScheduledNotificationId: (id: string) => void;
  removeScheduledNotificationId: (id: string) => void;
  clearAllScheduledNotifications: () => void;

  // Cleanup
  clearSentNotifications: () => void;
  clearAllNotifications: () => void;
}

const initialState = {
  pendingNotifications: [] as ArticleNotification[],
  scheduledNotificationIds: [] as string[],
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Add a pending notification
      addPendingNotification: (notification: ArticleNotification) => {
        set(state => ({
          pendingNotifications: [...state.pendingNotifications, notification],
        }));
        console.log(`Added pending notification: ${notification.id}`);
      },

      // Remove a pending notification
      removePendingNotification: (id: string) => {
        set(state => ({
          pendingNotifications: state.pendingNotifications.filter(n => n.id !== id),
        }));
        console.log(`Removed pending notification: ${id}`);
      },

      // Mark notification as sent
      markNotificationAsSent: (id: string) => {
        set(state => ({
          pendingNotifications: state.pendingNotifications.map(n =>
            n.id === id ? { ...n, sent: true } : n
          ),
        }));
        console.log(`Marked notification as sent: ${id}`);
      },

      // Get all pending notifications
      getPendingNotifications: () => {
        return get().pendingNotifications;
      },

      // Get unsent notifications
      getUnsentNotifications: () => {
        return get().pendingNotifications.filter(n => !n.sent);
      },

      // Add scheduled notification ID (from Expo Notifications)
      addScheduledNotificationId: (id: string) => {
        set(state => ({
          scheduledNotificationIds: [...state.scheduledNotificationIds, id],
        }));
        console.log(`Added scheduled notification ID: ${id}`);
      },

      // Remove scheduled notification ID
      removeScheduledNotificationId: (id: string) => {
        set(state => ({
          scheduledNotificationIds: state.scheduledNotificationIds.filter(nId => nId !== id),
        }));
        console.log(`Removed scheduled notification ID: ${id}`);
      },

      // Clear all scheduled notification IDs
      clearAllScheduledNotifications: () => {
        set({ scheduledNotificationIds: [] });
        console.log('Cleared all scheduled notification IDs');
      },

      // Clear sent notifications
      clearSentNotifications: () => {
        set(state => ({
          pendingNotifications: state.pendingNotifications.filter(n => !n.sent),
        }));
        console.log('Cleared sent notifications');
      },

      // Clear all notifications
      clearAllNotifications: () => {
        set(initialState);
        console.log('Cleared all notifications');
      },
    }),
    {
      name: 'notification-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
