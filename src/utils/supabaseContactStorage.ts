
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  message: string;
}

export class SupabaseContactStorageService {
  private static instance: SupabaseContactStorageService;

  private constructor() {}

  static getInstance(): SupabaseContactStorageService {
    if (!this.instance) {
      this.instance = new SupabaseContactStorageService();
    }
    return this.instance;
  }

  async saveMessage(formData: ContactFormData): Promise<ContactMessage> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          title: formData.title || null,
          message: formData.message,
          status: 'unread'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        title: data.title || '',
        message: data.message,
        status: data.status as 'unread' | 'read',
        timestamp: data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error saving contact message:', error);
      throw error;
    }
  }

  async loadMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone || '',
        title: item.title || '',
        message: item.message,
        status: item.status as 'unread' | 'read',
        timestamp: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error loading contact messages:', error);
      throw error;
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}
