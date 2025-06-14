import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePortalData } from '@/hooks/usePortalData';
import { Course } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const CoursesEditor = () => {
  const { data, createItem, updateItem, deleteItem } = usePortalData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({});

  // Sync form data when editing an existing item
  useEffect(() => {
    if (editingId && data?.courses) {
      const item = data.courses.find(course => course.id === editingId);
      if (item) {
        setFormData(item);
      }
    }
  }, [editingId, data?.courses]);

  const handleSave = () => {
    try {
      if (editingId) {
        updateItem('courses', editingId, formData);
        toast({
          title: "Course Updated",
          description: "Course has been updated successfully.",
        });
      } else {
        createItem('courses', formData as Omit<Course, 'id'>);
        toast({
          title: "Course Added",
          description: "New course has been added successfully.",
        });
      }
      resetForm();
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save course.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        deleteItem('courses', id);
        toast({
          title: "Course Deleted",
          description: "Course has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete course.",
          variant: "destructive",
        });
      }
    }
  };

  const startEdit = (item: Course) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
  };

  const startAdd = () => {
    setFormData({
      title: '',
      code: '',
      level: 'Undergraduate',
      credits: 3,
      semester: '',
      enrollment: 0,
      maxEnrollment: 30,
      description: '',
      learningOutcomes: [],
      schedule: {
        days: '',
        time: '',
        location: ''
      },
      lessons: []
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowAddForm(false);
  };

  const addOutcome = (outcome: string) => {
    if (outcome.trim()) {
      setFormData({
        ...formData,
        learningOutcomes: [...(formData.learningOutcomes || []), outcome.trim()]
      });
    }
  };

  const removeOutcome = (index: number) => {
    setFormData({
      ...formData,
      learningOutcomes: formData.learningOutcomes?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Courses Management</h3>
        <Button onClick={startAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Course' : 'Add New Course'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Course Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction to Computer Science"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Course Code</label>
                <Input
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="CS 101"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Level</label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as Course['level'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Credits</label>
                <Input
                  type="number"
                  value={formData.credits || 3}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                  placeholder="3"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Semester</label>
                <Input
                  value={formData.semester || ''}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="Fall 2024"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Enrollment</label>
                <Input
                  type="number"
                  value={formData.maxEnrollment || 30}
                  onChange={(e) => setFormData({ ...formData, maxEnrollment: parseInt(e.target.value) || 30 })}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Schedule</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    value={formData.schedule?.days || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      schedule: { ...formData.schedule, days: e.target.value }
                    })}
                    placeholder="MWF"
                  />
                </div>
                <div>
                  <Input
                    value={formData.schedule?.time || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      schedule: { ...formData.schedule, time: e.target.value }
                    })}
                    placeholder="10:00 AM - 11:00 AM"
                  />
                </div>
                <div>
                  <Input
                    value={formData.schedule?.location || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      schedule: { ...formData.schedule, location: e.target.value }
                    })}
                    placeholder="Room 301, CS Building"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Learning Outcomes</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Add learning outcome"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addOutcome((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addOutcome(input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{outcome}</span>
                    <button
                      onClick={() => removeOutcome(index)}
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
        {data?.courses?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-blue-600 font-medium">{item.code}</p>
                  <p className="text-gray-600">{item.level} • {item.credits} Credits • {item.semester}</p>
                  <p className="text-gray-700 mt-1">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.schedule.days} • {item.schedule.time} • {item.schedule.location}
                  </p>
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

export default CoursesEditor;
