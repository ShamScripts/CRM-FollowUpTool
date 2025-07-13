import { useState, useEffect } from 'react';
import { Notification } from '../types';

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Follow-up Due',
        message: 'Call scheduled with John Smith in 30 minutes',
        type: 'warning',
        read: false,
        createdAt: new Date(),
        userId
      },
      {
        id: '2',
        title: 'New Lead',
        message: 'Sarah Johnson from TechCorp has been assigned to you',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 3600000),
        userId
      },
      {
        id: '3',
        title: 'Meeting Completed',
        message: 'Demo with ABC Corp marked as completed',
        type: 'success',
        read: true,
        createdAt: new Date(Date.now() - 7200000),
        userId
      }
    ];

    setNotifications(mockNotifications);
  }, [userId]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead
  };
};