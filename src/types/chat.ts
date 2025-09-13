export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
}

export type NotificationType = 'success' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}