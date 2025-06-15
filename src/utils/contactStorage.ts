
import { ContactMessage } from '@/types/contact';

const CONTACT_FILE_URL = '/data/contact-messages.json';

export class ContactStorageService {
  private static instance: ContactStorageService;
  private cachedMessages: ContactMessage[] | null = null;
  
  public static getInstance(): ContactStorageService {
    if (!ContactStorageService.instance) {
      ContactStorageService.instance = new ContactStorageService();
    }
    return ContactStorageService.instance;
  }

  public async saveMessage(message: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>): Promise<ContactMessage> {
    const messages = await this.loadMessages();
    const newMessage: ContactMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    
    messages.push(newMessage);
    this.saveAllMessages(messages);
    return newMessage;
  }

  public async loadMessages(): Promise<ContactMessage[]> {
    try {
      if (this.cachedMessages) {
        return this.cachedMessages;
      }

      const response = await fetch(CONTACT_FILE_URL);
      if (!response.ok) {
        console.warn('Could not load contact messages file');
        this.cachedMessages = [];
        return [];
      }
      
      const messages = await response.json();
      this.cachedMessages = messages;
      return messages;
    } catch (error) {
      console.error('Error loading contact messages:', error);
      this.cachedMessages = [];
      return [];
    }
  }

  private saveAllMessages(messages: ContactMessage[]): void {
    this.cachedMessages = messages;
    console.log('Contact messages updated in memory. Download the updated JSON file to replace public/data/contact-messages.json');
    this.createDownloadableJSON(messages);
  }

  private createDownloadableJSON(messages: ContactMessage[]): void {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contact-messages.json';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  public async markAsRead(id: string): Promise<void> {
    const messages = await this.loadMessages();
    const message = messages.find(m => m.id === id);
    if (message) {
      message.status = 'read';
      this.saveAllMessages(messages);
    }
  }

  public async deleteMessage(id: string): Promise<void> {
    const messages = await this.loadMessages();
    const filteredMessages = messages.filter(m => m.id !== id);
    this.saveAllMessages(filteredMessages);
  }

  public clearCache(): void {
    this.cachedMessages = null;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
