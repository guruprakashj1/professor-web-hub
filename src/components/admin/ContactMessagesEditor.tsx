import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContactStorageService } from '@/utils/contactStorage';
import { ContactMessage } from '@/types/contact';
import { Mail, Phone, User, FileText, Trash2, Eye, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactMessagesEditor = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const contactService = ContactStorageService.getInstance();
    const loadedMessages = await contactService.loadMessages();
    setMessages(loadedMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const handleMarkAsRead = async (id: string) => {
    const contactService = ContactStorageService.getInstance();
    await contactService.markAsRead(id);
    loadMessages();
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const contactService = ContactStorageService.getInstance();
      await contactService.deleteMessage(id);
      loadMessages();
      setSelectedMessage(null);
      toast({
        title: "Message Deleted",
        description: "The contact message has been deleted.",
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">
            Manage messages from your contact form
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Messages ({messages.length})</h3>
          
          {messages.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No messages received yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <Card
                  key={message.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-black' : ''
                  } ${message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'unread') {
                      handleMarkAsRead(message.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{message.name}</h4>
                          {message.status === 'unread' && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        <p className="text-sm font-medium">{message.title || 'No Subject'}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div>
          <h3 className="text-lg font-medium mb-4">Message Details</h3>
          
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedMessage.name}
                    </CardTitle>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedMessage.email}
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedMessage.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedMessage.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      disabled={selectedMessage.status === 'read'}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMessage.title && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Subject</span>
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedMessage.title}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Select a message to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesEditor;
