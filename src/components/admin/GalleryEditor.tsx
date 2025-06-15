
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, MapPin, Calendar, Camera, Video } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import { useToast } from '@/hooks/use-toast';
import { GalleryItem } from '@/types/portalData';
import FileUploadPreview from './FileUploadPreview';

const GalleryEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    description: '',
    mediaType: 'photo',
    photo: '',
    video: '',
    uploadType: 'url',
    date: '',
    eventType: 'Meeting',
    location: {
      name: '',
      latitude: undefined,
      longitude: undefined
    },
    tags: []
  });

  const gallery = data?.gallery || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields based on media type
    const mediaUrl = formData.mediaType === 'photo' ? formData.photo : formData.video;
    if (!mediaUrl) {
      toast({
        title: "Missing Media",
        description: `Please provide a ${formData.mediaType} URL or upload a file.`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingId) {
        updateItem<GalleryItem>('gallery', editingId, formData);
        toast({
          title: "Gallery Item Updated",
          description: "The gallery item has been successfully updated.",
        });
      } else {
        createItem<GalleryItem>('gallery', formData);
        toast({
          title: "Gallery Item Added",
          description: "A new gallery item has been successfully added.",
        });
      }
      
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save gallery item.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      mediaType: item.mediaType,
      photo: item.photo || '',
      video: item.video || '',
      uploadType: item.uploadType || 'url',
      date: item.date,
      eventType: item.eventType,
      location: item.location,
      tags: item.tags
    });
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        deleteItem('gallery', id);
        toast({
          title: "Gallery Item Deleted",
          description: "The gallery item has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete gallery item.",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mediaType: 'photo',
      photo: '',
      video: '',
      uploadType: 'url',
      date: '',
      eventType: 'Meeting',
      location: {
        name: '',
        latitude: undefined,
        longitude: undefined
      },
      tags: []
    });
    setEditingId(null);
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  const handleMediaTypeChange = (mediaType: 'photo' | 'video') => {
    setFormData({ 
      ...formData, 
      mediaType,
      photo: mediaType === 'photo' ? formData.photo : '',
      video: mediaType === 'video' ? formData.video : ''
    });
  };

  const handleMediaChange = (value: string | undefined) => {
    if (formData.mediaType === 'photo') {
      setFormData({ ...formData, photo: value || '' });
    } else {
      setFormData({ ...formData, video: value || '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery Management</h3>
        <Button onClick={resetForm} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Gallery Item' : 'Add New Gallery Item'}</CardTitle>
          <CardDescription>
            Add photos or videos from conferences, meetings, workshops, and other academic events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Annual AI Conference 2024"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type</label>
                <Select value={formData.eventType} onValueChange={(value: any) => setFormData({ ...formData, eventType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Session">Session</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Media Type</label>
              <Select value={formData.mediaType} onValueChange={handleMediaTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Media Upload Section using FileUploadPreview */}
            <FileUploadPreview
              label={formData.mediaType === 'photo' ? 'Photo' : 'Video'}
              value={formData.mediaType === 'photo' ? formData.photo : formData.video}
              onChange={handleMediaChange}
              accept={formData.mediaType === 'photo' ? 'image/*' : 'video/*'}
              maxSize={formData.mediaType === 'photo' ? 10 : 100}
              showUrlInput={true}
              previewClassName="w-full h-48"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the event..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Name</label>
                <Input
                  value={formData.location.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, name: e.target.value }
                  })}
                  placeholder="e.g., Stanford University, CA"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude (optional)</label>
                <Input
                  type="number"
                  step="any"
                  value={formData.location.latitude || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, latitude: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  placeholder="37.4419"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude (optional)</label>
                <Input
                  type="number"
                  step="any"
                  value={formData.location.longitude || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, longitude: e.target.value ? parseFloat(e.target.value) : undefined }
                  })}
                  placeholder="-122.1430"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="machine learning, AI, research"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Update Item' : 'Add Item'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="space-y-4">
        <h4 className="font-medium">Existing Gallery Items ({gallery.length})</h4>
        {gallery.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No gallery items yet. Add your first event media above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {gallery.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Preview thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {item.mediaType === 'photo' && item.photo ? (
                          <img 
                            src={item.photo} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : item.mediaType === 'video' && item.video ? (
                          <video 
                            src={item.video}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <div className="text-gray-400">
                            {item.mediaType === 'photo' ? <Camera className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{item.title}</h5>
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded flex items-center gap-1">
                            {item.mediaType === 'photo' ? <Camera className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                            {item.eventType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location.name}
                          </div>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="px-1 py-0.5 bg-gray-100 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryEditor;
