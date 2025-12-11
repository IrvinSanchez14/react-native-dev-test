import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArticleNotification } from '../types/article';

interface NotificationStore {
  pendingNotifications: ArticleNotification[];

  scheduledNotificationIds: string[];

  addPendingNotification: (notification: ArticleNotification) => void;
  removePendingNotification: (id: string) => void;
  markNotificationAsSent: (id: string) => void;
  getPendingNotifications: () => ArticleNotification[];
  getUnsentNotifications: () => ArticleNotification[];

  addScheduledNotificationId: (id: string) => void;
  removeScheduledNotificationId: (id: string) => void;
  clearAllScheduledNotifications: () => void;

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

      addPendingNotification: (notification: ArticleNotification) => {
        set(state => ({
          pendingNotifications: [...state.pendingNotifications, notification],
        }));
      },

      removePendingNotification: (id: string) => {
        set(state => ({
          pendingNotifications: state.pendingNotifications.filter(n => n.id !== id),
        }));
      },

      markNotificationAsSent: (id: string) => {
        set(state => ({
          pendingNotifications: state.pendingNotifications.map(n =>
            n.id === id ? { ...n, sent: true } : n
          ),
        }));
      },

      getPendingNotifications: () => {
        return get().pendingNotifications;
      },

      getUnsentNotifications: () => {
        return get().pendingNotifications.filter(n => !n.sent);
      },

      addScheduledNotificationId: (id: string) => {
        set(state => ({
          scheduledNotificationIds: [...state.scheduledNotificationIds, id],
        }));
      },

      removeScheduledNotificationId: (id: string) => {
        set(state => ({
          scheduledNotificationIds: state.scheduledNotificationIds.filter(nId => nId !== id),
        }));
      },

      clearAllScheduledNotifications: () => {
        set({ scheduledNotificationIds: [] });
      },


      clearSentNotifications: () => {
        set(state => ({
          pendingNotifications: state.pendingNotifications.filter(n => !n.sent),
        }));
      },

      clearAllNotifications: () => {
        set(initialState);
      },
    }),
    {
      name: 'notification-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
