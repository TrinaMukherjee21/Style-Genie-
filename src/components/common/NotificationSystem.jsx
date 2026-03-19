import React, { useState, useEffect } from 'react';
import { Bell, X, Gift, Star, Zap } from 'lucide-react';
import { inboxService } from '../../services/inboxService';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleNewMessage = (messages, unreadCount) => {
      // Get the latest unread message
      const latestUnread = messages.find(msg => !msg.read);
      
      if (latestUnread && !notifications.find(n => n.id === latestUnread.id)) {
        const notification = {
          id: latestUnread.id,
          title: latestUnread.title,
          content: latestUnread.content,
          type: latestUnread.type,
          timestamp: Date.now()
        };
        
        setNotifications(prev => [notification, ...prev.slice(0, 2)]); // Keep max 3
        setIsVisible(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    };

    inboxService.addListener(handleNewMessage);
    
    return () => {
      inboxService.removeListener(handleNewMessage);
    };
  }, [notifications]);

  const getNotificationIcon = (type) => {
    const icons = {
      flash_sale: <Zap className="w-5 h-5 text-red-500" />,
      new_arrivals: <Star className="w-5 h-5 text-blue-500" />,
      personalized: <Gift className="w-5 h-5 text-purple-500" />
    };
    return icons[type] || <Bell className="w-5 h-5 text-gray-500" />;
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {notification.title}
              </h4>
              <p className="text-xs text-gray-600">
                {notification.content.slice(0, 80)}...
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;