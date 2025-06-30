'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, ExternalLink } from 'lucide-react';
import { ToastNotification, subscribeToToasts, removeToast } from '@/lib/toast-notifications';
import { getUserById } from '@/lib/users';

interface ToastNotificationProps {
  toast: ToastNotification;
  onClose: (toastId: string) => void;
}

function SingleToast({ toast, onClose }: ToastNotificationProps) {
  const router = useRouter();
  const user = getUserById(toast.userId);

  const handleUserClick = () => {
    const encodedName = encodeURIComponent(toast.userName);
    router.push(`/user/${encodedName}`);
  };

  const handleClose = () => {
    onClose(toast.id);
  };

  return (
    <Card className={`
      relative overflow-hidden p-4 shadow-lg border-0 
      bg-gradient-to-r ${toast.color} 
      transform transition-all duration-300 ease-in-out
      hover:scale-105 hover:shadow-xl
      animate-in slide-in-from-right-full
    `}>
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="absolute top-2 right-2 h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/20"
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="flex items-center gap-3 pr-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm">
          <toast.icon className="h-5 w-5 text-white" />
        </div>

        {/* User Avatar */}
        <Avatar className="h-8 w-8 border-2 border-white/30">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-xs bg-white/20 text-white">
            {toast.userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm leading-tight">
            {toast.message}
          </p>
          <p className="text-white/80 text-xs mt-1">
            {toast.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* View Profile Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUserClick}
          className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/20"
          title="View Profile"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* Progress Bar for Auto-dismiss */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white/40 transition-all duration-[7000ms] ease-linear"
          style={{ width: '0%', animation: 'toast-progress 7s linear forwards' }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </Card>
  );
}

export function ToastNotificationContainer() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts(setToasts);
    return unsubscribe;
  }, []);

  const handleCloseToast = (toastId: string) => {
    removeToast(toastId);
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.slice(-3).map((toast) => (
        <SingleToast
          key={toast.id}
          toast={toast}
          onClose={handleCloseToast}
        />
      ))}
      
      {/* Show count if more than 3 toasts */}
      {toasts.length > 3 && (
        <Card className="p-2 text-center bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <p className="text-white text-xs">
            +{toasts.length - 3} more notifications
          </p>
        </Card>
      )}
    </div>
  );
}