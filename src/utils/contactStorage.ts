
import { ContactMessage } from '@/types/contact';

const STORAGE_KEY = 'contact_messages';

export class ContactStorageService {
  private static instance: ContactStorageService;
  
  public static getInstance(): ContactStorageService {
    if (!ContactStorageService.instance) {
      ContactStorageService.instance = new ContactStorageService();
    }
    return ContactStorageService.instance;
  }

  public saveMessage(message: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>): ContactMessage {
    const messages = this.loadMessages();
    const newMessage: ContactMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    
    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return newMessage;
  }

  public loadMessages(): ContactMessage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading contact messages:', error);
      return [];
    }
  }

  public markAsRead(id: string): void {
    const messages = this.loadMessages();
    const message = messages.find(m => m.id === id);
    if (message) {
      message.status = 'read';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }

  public deleteMessage(id: string): void {
    const messages = this.loadMessages();
    const filteredMessages = messages.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMessages));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
