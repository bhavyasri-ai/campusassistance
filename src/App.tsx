import React, { useState, useRef, useEffect } from 'react';
import { Home, Send } from 'lucide-react';
import { ChatMessage as ChatMessageType, Notification, ChatResponse } from './types/chat';
import { ChatMessage } from './components/ChatMessage';
import { NotificationToast } from './components/NotificationToast';
import { LoadingIndicator } from './components/LoadingIndicator';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessageType = {
      id: '1',
      sender: 'bot',
      message: 'Hello! I am your Smart Campus Assistant. How can I help you today?',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const addMessage = (sender: 'user' | 'bot', message: string) => {
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add user message
    addMessage('user', userMessage);
    setInputValue('');
    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ChatResponse = await response.json();
      addMessage('bot', data.response);

    } catch (error) {
      console.error('Error fetching bot response:', error);
      setShowError(true);
      showNotification('Error sending message. Please try again.', 'error');
      
      // Add a fallback bot response
      addMessage('bot', 'I apologize, but I encountered an error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-8 text-blue-600">
            <Home size={32} />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Smart Campus Assistant
          </h1>
        </div>

        {/* Chat Window */}
        <div 
          ref={chatWindowRef}
          className="h-96 overflow-y-auto p-4 mb-4 border border-gray-200 rounded-2xl bg-gray-50 flex flex-col space-y-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#9ca3af #e5e7eb',
          }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>

        {/* Loading Indicator */}
        <LoadingIndicator isVisible={isLoading} />

        {/* Error Message */}
        {showError && (
          <div className="text-center mt-2 text-red-500">
            <p>Sorry, something went wrong. Please try again later.</p>
          </div>
        )}
      </div>

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .h-96::-webkit-scrollbar {
          width: 8px;
        }
        .h-96::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .h-96::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
        }
        .h-96::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default App;