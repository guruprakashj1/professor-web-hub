
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
}
