
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ContactMessage } from '@/types/contact';

const CONTACT_COLLECTION = 'contact-messages';

export class FirebaseContactStorageService {
  private static instance: FirebaseContactStorageService;
  private cachedMessages: ContactMessage[] | null = null;
  
  public static getInstance(): FirebaseContactStorageService {
    if (!FirebaseContactStorageService.instance) {
      FirebaseContactStorageService.instance = new FirebaseContactStorageService();
    }
    return FirebaseContactStorageService.instance;
  }

  public async saveMessage(message: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>): Promise<ContactMessage> {
    try {
      const newMessage: Omit<ContactMessage, 'id'> = {
        ...message,
        timestamp: new Date().toISOString(),
        status: 'unread'
      };
      
      const docRef = await addDoc(collection(db, CONTACT_COLLECTION), newMessage);
      const savedMessage = { ...newMessage, id: docRef.id } as ContactMessage;
      
      // Update cache
      if (this.cachedMessages) {
        this.cachedMessages.push(savedMessage);
      }
      
      console.log('Contact message saved to Firebase:', savedMessage);
      return savedMessage;
    } catch (error) {
      console.error('Error saving contact message:', error);
      throw error;
    }
  }

  public async loadMessages(): Promise<ContactMessage[]> {
    try {
      if (this.cachedMessages) {
        return this.cachedMessages;
      }

      const q = query(collection(db, CONTACT_COLLECTION), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messages: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      
      this.cachedMessages = messages;
      return messages;
    } catch (error) {
      console.error('Error loading contact messages:', error);
      this.cachedMessages = [];
      return [];
    }
  }

  public async markAsRead(id: string): Promise<void> {
    try {
      const messageRef = doc(db, CONTACT_COLLECTION, id);
      await updateDoc(messageRef, { status: 'read' });
      
      // Update cache
      if (this.cachedMessages) {
        const message = this.cachedMessages.find(m => m.id === id);
        if (message) {
          message.status = 'read';
        }
      }
      
      console.log('Message marked as read:', id);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  public async deleteMessage(id: string): Promise<void> {
    try {
      const messageRef = doc(db, CONTACT_COLLECTION, id);
      await deleteDoc(messageRef);
      
      // Update cache
      if (this.cachedMessages) {
        this.cachedMessages = this.cachedMessages.filter(m => m.id !== id);
      }
      
      console.log('Message deleted:', id);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  public clearCache(): void {
    this.cachedMessages = null;
  }
}
