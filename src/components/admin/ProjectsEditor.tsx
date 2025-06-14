
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePortalData } from '@/hooks/usePortalData';
import { Project } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const ProjectsEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleSave = () => {
    try {
      if (editingId) {
        updateItem('projects', editingId, formData);
        toast({
          title: "Project Updated",
          description: "Project has been updated successfully.",
        });
      } else {
        createItem('projects', formData as Omit<Project, 'id'>);
        toast({
          title: "Project Added",
          description: "New project has been added successfully.",
        });
      }
      resetForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save project.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        deleteItem('projects', id);
        toast({
          title: "Project Deleted",
          description: "Project has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      }
    }
  };

  const startEdit = (item: Project) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      duration: '',
      collaborators: 0,
      status: 'In Progress',
      achievements: [],
      links: {}
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowAddForm(false);
  };

  const addArrayItem = (field: 'technologies' | 'achievements', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), value.trim()]
      });
    }
  };

  const removeArrayItem = (field: 'technologies' | 'achievements', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects Management</h3>
        <Button onClick={startAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Project' : 'Add New Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="2022 - 2023"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Collaborators</label>
                <Input
                  type="number"
                  value={formData.collaborators || 0}
                  onChange={(e) => setFormData({ ...formData, collaborators: parseInt(e.target.value) || 0 })}
                  placeholder="Number of collaborators"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Technologies</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add technology"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addArrayItem('technologies', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addArrayItem('technologies', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies?.map((tech, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    <span>{tech}</span>
                    <button
                      onClick={() => removeArrayItem('technologies', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Achievements</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add achievement"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addArrayItem('achievements', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addArrayItem('achievements', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    <span>{achievement}</span>
                    <button
                      onClick={() => removeArrayItem('achievements', index)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    value={formData.links?.demo || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      links: { ...formData.links, demo: e.target.value }
                    })}
                    placeholder="Demo URL"
                  />
                </div>
                <div>
                  <Input
                    value={formData.links?.github || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      links: { ...formData.links, github: e.target.value }
                    })}
                    placeholder="GitHub URL"
                  />
                </div>
                <div>
                  <Input
                    value={formData.links?.paper || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      links: { ...formData.links, paper: e.target.value }
                    })}
                    placeholder="Paper URL"
                  />
                </div>
                <div>
                  <Input
                    value={formData.links?.video || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      links: { ...formData.links, video: e.target.value }
                    })}
                    placeholder="Video URL"
                  />
                </div>
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
        {data?.projects?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-2">{item.duration} • {item.collaborators} collaborators • {item.status}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                    {item.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{item.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
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
  );
};

export default ProjectsEditor;
