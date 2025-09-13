import React, { useEffect, useState } from 'react';
import { Notification } from '../types/chat';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimeout = setTimeout(() => setIsVisible(true), 10);
    
    // Hide animation after 3 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(notification.id), 300);
    }, 3000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [notification.id, onRemove]);

  const baseClasses = 'p-3 rounded-xl shadow-lg text-sm transition-all duration-300 transform';
  const visibilityClasses = isVisible 
    ? 'translate-x-0 opacity-100' 
    : 'translate-x-full opacity-0';
  const typeClasses = notification.type === 'success' 
    ? 'bg-green-500 text-white' 
    : 'bg-red-500 text-white';

  return (
    <div className={`${baseClasses} ${visibilityClasses} ${typeClasses}`}>
      {notification.message}
    </div>
  );
};