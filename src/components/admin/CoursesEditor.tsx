import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortalData } from '@/hooks/usePortalData';
import { Course, Lesson, Resource } from '@/types/portalData';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, BookOpen, Link, Play, ExternalLink } from 'lucide-react';

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
      lessons: [],
      online: false,
      industry: '',
      textbooks: [],
      softwareTools: [],
      courseLinks: []
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

  const addLesson = () => {
    const newLesson: Lesson = {
      week: (formData.lessons?.length || 0) + 1,
      title: '',
      topics: [],
      resources: []
    };
    setFormData({
      ...formData,
      lessons: [...(formData.lessons || []), newLesson]
    });
  };

  const updateLesson = (index: number, updates: Partial<Lesson>) => {
    const updatedLessons = [...(formData.lessons || [])];
    updatedLessons[index] = { ...updatedLessons[index], ...updates };
    setFormData({
      ...formData,
      lessons: updatedLessons
    });
  };

  const removeLesson = (index: number) => {
    setFormData({
      ...formData,
      lessons: formData.lessons?.filter((_, i) => i !== index) || []
    });
  };

  const addTopicToLesson = (lessonIndex: number, topic: string) => {
    if (topic.trim()) {
      const updatedLessons = [...(formData.lessons || [])];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        topics: [...updatedLessons[lessonIndex].topics, topic.trim()]
      };
      setFormData({
        ...formData,
        lessons: updatedLessons
      });
    }
  };

  const removeTopicFromLesson = (lessonIndex: number, topicIndex: number) => {
    const updatedLessons = [...(formData.lessons || [])];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      topics: updatedLessons[lessonIndex].topics.filter((_, i) => i !== topicIndex)
    };
    setFormData({
      ...formData,
      lessons: updatedLessons
    });
  };

  const addResourceToLesson = (lessonIndex: number, resource: Resource) => {
    if (resource.name.trim() && resource.url.trim()) {
      const updatedLessons = [...(formData.lessons || [])];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        resources: [...updatedLessons[lessonIndex].resources, resource]
      };
      setFormData({
        ...formData,
        lessons: updatedLessons
      });
    }
  };

  const removeResourceFromLesson = (lessonIndex: number, resourceIndex: number) => {
    const updatedLessons = [...(formData.lessons || [])];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      resources: updatedLessons[lessonIndex].resources.filter((_, i) => i !== resourceIndex)
    };
    setFormData({
      ...formData,
      lessons: updatedLessons
    });
  };

  const addTextbook = () => {
    const newTextbook = {
      title: '',
      author: '',
      edition: '',
      isbn: ''
    };
    setFormData({
      ...formData,
      textbooks: [...(formData.textbooks || []), newTextbook]
    });
  };

  const updateTextbook = (index: number, updates: any) => {
    const updatedTextbooks = [...(formData.textbooks || [])];
    updatedTextbooks[index] = { ...updatedTextbooks[index], ...updates };
    setFormData({
      ...formData,
      textbooks: updatedTextbooks
    });
  };

  const removeTextbook = (index: number) => {
    setFormData({
      ...formData,
      textbooks: formData.textbooks?.filter((_, i) => i !== index) || []
    });
  };

  const addSoftwareTool = (tool: string) => {
    if (tool.trim()) {
      setFormData({
        ...formData,
        softwareTools: [...(formData.softwareTools || []), tool.trim()]
      });
    }
  };

  const removeSoftwareTool = (index: number) => {
    setFormData({
      ...formData,
      softwareTools: formData.softwareTools?.filter((_, i) => i !== index) || []
    });
  };

  const addCourseLink = () => {
    const newLink = {
      name: '',
      url: ''
    };
    setFormData({
      ...formData,
      courseLinks: [...(formData.courseLinks || []), newLink]
    });
  };

  const updateCourseLink = (index: number, updates: any) => {
    const updatedLinks = [...(formData.courseLinks || [])];
    updatedLinks[index] = { ...updatedLinks[index], ...updates };
    setFormData({
      ...formData,
      courseLinks: updatedLinks
    });
  };

  const removeCourseLink = (index: number) => {
    setFormData({
      ...formData,
      courseLinks: formData.courseLinks?.filter((_, i) => i !== index) || []
    });
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const renderOverviewTab = () => (
    <div className="space-y-4">
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
        <div>
          <label className="text-sm font-medium">Industry Focus</label>
          <Input
            value={formData.industry || ''}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="Technology, Healthcare, Finance, etc."
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="online"
            checked={formData.online || false}
            onChange={(e) => setFormData({ ...formData, online: e.target.checked })}
          />
          <label htmlFor="online" className="text-sm font-medium">Online Course</label>
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
    </div>
  );

  const renderLessonPlansTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>Lesson Plans</span>
        </label>
        <Button onClick={addLesson} size="sm" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Lesson</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {formData.lessons?.map((lesson, lessonIndex) => (
          <Card key={lessonIndex} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Week {lesson.week}</CardTitle>
                <Button
                  onClick={() => removeLesson(lessonIndex)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Lesson Title</label>
                <Input
                  value={lesson.title}
                  onChange={(e) => updateLesson(lessonIndex, { title: e.target.value })}
                  placeholder="Introduction to Programming Concepts"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Topics</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Add topic"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTopicToLesson(lessonIndex, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addTopicToLesson(lessonIndex, input.value);
                      input.value = '';
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lesson.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      <span>{topic}</span>
                      <button
                        onClick={() => removeTopicFromLesson(lessonIndex, topicIndex)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCourseResourcesTab = () => (
    <div className="space-y-6">
      {/* Textbooks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Required Textbooks</CardTitle>
            <Button onClick={addTextbook} size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Textbook</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.textbooks || []).map((textbook: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Textbook {index + 1}</h4>
                <Button
                  onClick={() => removeTextbook(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Book Title"
                  value={textbook.title || ''}
                  onChange={(e) => updateTextbook(index, { title: e.target.value })}
                />
                <Input
                  placeholder="Author(s)"
                  value={textbook.author || ''}
                  onChange={(e) => updateTextbook(index, { author: e.target.value })}
                />
                <Input
                  placeholder="Edition"
                  value={textbook.edition || ''}
                  onChange={(e) => updateTextbook(index, { edition: e.target.value })}
                />
                <Input
                  placeholder="ISBN (optional)"
                  value={textbook.isbn || ''}
                  onChange={(e) => updateTextbook(index, { isbn: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Software Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Software Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add software tool"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSoftwareTool((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <Button 
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addSoftwareTool(input.value);
                input.value = '';
              }}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.softwareTools || []).map((tool: string, index: number) => (
              <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>{tool}</span>
                <button
                  onClick={() => removeSoftwareTool(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Links Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Course Links</CardTitle>
            <Button onClick={addCourseLink} size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.courseLinks || []).map((link: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Link {index + 1}</h4>
                <Button
                  onClick={() => removeCourseLink(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Link Name"
                  value={link.name || ''}
                  onChange={(e) => updateCourseLink(index, { name: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={link.url || ''}
                  onChange={(e) => updateCourseLink(index, { url: e.target.value })}
                />
              </div>
              {link.url && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  <span>{link.url}</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderResourcesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center space-x-2">
          <Link className="w-4 h-4" />
          <span>Learning Resources</span>
        </label>
      </div>

      <div className="space-y-4">
        {formData.lessons?.map((lesson, lessonIndex) => (
          <Card key={lessonIndex} className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Week {lesson.week} - {lesson.title || 'Untitled Lesson'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                  <Input
                    placeholder="Resource name"
                    id={`resource-name-${lessonIndex}`}
                  />
                  <Input
                    placeholder="Resource URL"
                    id={`resource-url-${lessonIndex}`}
                  />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="download">Download</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      const nameInput = document.getElementById(`resource-name-${lessonIndex}`) as HTMLInputElement;
                      const urlInput = document.getElementById(`resource-url-${lessonIndex}`) as HTMLInputElement;
                      const typeSelect = document.querySelector(`#resource-name-${lessonIndex}`).closest('.grid')?.querySelector('[role="combobox"]') as HTMLElement;
                      const typeValue = typeSelect?.getAttribute('data-value') || 'learning';
                      
                      if (nameInput.value && urlInput.value) {
                        addResourceToLesson(lessonIndex, {
                          name: nameInput.value,
                          url: urlInput.value,
                          type: typeValue as Resource['type']
                        });
                        nameInput.value = '';
                        urlInput.value = '';
                      }
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {lesson.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center space-x-2">
                            <span>{resource.name}</span>
                            {resource.type && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {resource.type}
                              </span>
                            )}
                            {isYouTubeUrl(resource.url) && (
                              <Play className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{resource.url}</div>
                        </div>
                        <button
                          onClick={() => removeResourceFromLesson(lessonIndex, resourceIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {isYouTubeUrl(resource.url) && (
                        <div className="mt-3">
                          <iframe
                            width="100%"
                            height="200"
                            src={getYouTubeEmbedUrl(resource.url)}
                            title={resource.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

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
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="course-resources">Course Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                {renderOverviewTab()}
              </TabsContent>
              
              <TabsContent value="lessons" className="mt-6">
                {renderLessonPlansTab()}
              </TabsContent>
              
              <TabsContent value="resources" className="mt-6">
                {renderResourcesTab()}
              </TabsContent>
              
              <TabsContent value="course-resources" className="mt-6">
                {renderCourseResourcesTab()}
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 mt-6 pt-4 border-t">
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
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-600">{item.level} • {item.credits} Credits • {item.semester}</span>
                    {item.online && <span className="text-green-600 text-sm">• Online</span>}
                    {item.industry && <span className="text-purple-600 text-sm">• {item.industry}</span>}
                  </div>
                  <p className="text-gray-700 mt-1">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.schedule.days} • {item.schedule.time} • {item.schedule.location}
                  </p>
                  {item.lessons && item.lessons.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-600">{item.lessons.length} lesson plans</span>
                    </div>
                  )}
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
