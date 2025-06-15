import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePortalData } from '@/hooks/usePortalData';
import { ProjectOpening } from '@/types/portalData';
import { ApplicationStorageService } from '@/utils/applicationStorage';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Users } from 'lucide-react';
import ApplicationsViewer from './ApplicationsViewer';

const OpeningsEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectOpening>>({});
  const [viewingApplications, setViewingApplications] = useState<{ openingId: string; openingTitle: string } | null>(null);
  const [applicationCounts, setApplicationCounts] = useState<{ [key: string]: number }>({});

  const applicationService = ApplicationStorageService.getInstance();

  // Load application counts for each opening
  useEffect(() => {
    if (data?.openings) {
      loadApplicationCounts();
    }
  }, [data?.openings]);

  const loadApplicationCounts = async () => {
    if (data?.openings) {
      const counts: { [key: string]: number } = {};
      for (const opening of data.openings) {
        const applications = await applicationService.getApplicationsByOpening(opening.id);
        counts[opening.id] = applications.length;
      }
      setApplicationCounts(counts);
    }
  };

  // Sync form data when editing an existing item
  useEffect(() => {
    if (editingId && data?.openings) {
      const item = data.openings.find(opening => opening.id === editingId);
      if (item) {
        setFormData(item);
      }
    }
  }, [editingId, data?.openings]);

  const handleSave = () => {
    try {
      if (editingId) {
        updateItem('openings', editingId, formData);
        toast({
          title: "Opening Updated",
          description: "Project opening has been updated successfully.",
        });
      } else {
        createItem('openings', formData as Omit<ProjectOpening, 'id'>);
        toast({
          title: "Opening Added",
          description: "New project opening has been added successfully.",
        });
      }
      resetForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save project opening.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project opening?')) {
      try {
        deleteItem('openings', id);
        toast({
          title: "Opening Deleted",
          description: "Project opening has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete project opening.",
          variant: "destructive",
        });
      }
    }
  };

  const startEdit = (item: ProjectOpening) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setFormData({
      title: '',
      description: '',
      requirements: [],
      duration: '',
      type: 'Research',
      level: 'Undergraduate',
      status: 'Open',
      applicationDeadline: ''
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowAddForm(false);
  };

  const addRequirement = (requirement: string) => {
    if (requirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), requirement.trim()]
      });
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements?.filter((_, i) => i !== index) || []
    });
  };

  const handleViewApplications = (opening: ProjectOpening) => {
    setViewingApplications({
      openingId: opening.id,
      openingTitle: opening.title
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Project Openings Management</h3>
          <Button onClick={startAdd} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Opening</span>
          </Button>
        </div>

        {(showAddForm || editingId) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Project Opening' : 'Add New Project Opening'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Project opening title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project description and objectives"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="6 months"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Application Deadline</label>
                  <Input
                    type="date"
                    value={formData.applicationDeadline || ''}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ProjectOpening['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Thesis">Thesis</SelectItem>
                      <SelectItem value="Independent Study">Independent Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Level</label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as ProjectOpening['level'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ProjectOpening['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Filled">Filled</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Requirements</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Add requirement"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addRequirement((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addRequirement(input.value);
                      input.value = '';
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.requirements?.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{requirement}</span>
                      <button
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {data?.openings?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      {applicationCounts[item.id] > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {applicationCounts[item.id]} application{applicationCounts[item.id] !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {item.type} • {item.level} • {item.duration} • {item.status}
                    </p>
                    <p className="text-sm text-gray-500">Deadline: {item.applicationDeadline}</p>
                    {item.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.requirements.slice(0, 2).map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                            {req}
                          </span>
                        ))}
                        {item.requirements.length > 2 && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                            +{item.requirements.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewApplications(item)}
                      className="flex items-center space-x-1"
                    >
                      <Users className="w-4 h-4" />
                      <span>Applications</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {viewingApplications && (
        <ApplicationsViewer
          openingId={viewingApplications.openingId}
          openingTitle={viewingApplications.openingTitle}
          onClose={() => setViewingApplications(null)}
        />
      )}
    </>
  );
};

export default OpeningsEditor;
