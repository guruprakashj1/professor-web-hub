
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, Calendar, Users, MapPin, BookOpen, ExternalLink, Download, Globe, Building, Play } from 'lucide-react';

interface CourseDetailProps {
  course: any;
  onBack: () => void;
}

const CourseDetail = ({ course, onBack }: CourseDetailProps) => {
  const [activeWeek, setActiveWeek] = useState(1);

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

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Button>
        </div>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="secondary">{course.code}</Badge>
            <Badge variant={course.level === 'Graduate' ? 'default' : 'outline'}>
              {course.level}
            </Badge>
            {course.online && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Online</span>
              </Badge>
            )}
            {course.industry && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Building className="w-3 h-3" />
                <span>{course.industry}</span>
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{course.description}</p>

          {/* Course Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{course.credits} Credits</p>
                <p className="text-sm text-gray-600">Course Load</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{course.semester}</p>
                <p className="text-sm text-gray-600">Semester</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{course.enrollment || 0}/{course.maxEnrollment}</p>
                <p className="text-sm text-gray-600">Enrolled</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{course.schedule?.days || 'TBD'}</p>
                <p className="text-sm text-gray-600">{course.schedule?.time || 'TBD'}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Outcomes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Learning Outcomes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(course.learningOutcomes || []).map((outcome: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Schedule Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Course Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Class Schedule</h4>
                    <p className="text-gray-600">{course.schedule?.days || 'TBD'} • {course.schedule?.time || 'TBD'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">{course.schedule?.location || 'TBD'}</p>
                  </div>
                  {course.online && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Delivery Mode</h4>
                      <p className="text-gray-600 flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span>Online Course</span>
                      </p>
                    </div>
                  )}
                  {course.industry && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Industry Focus</h4>
                      <p className="text-gray-600 flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{course.industry}</span>
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Enrollment Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${((course.enrollment || 0) / course.maxEnrollment) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.enrollment || 0}/{course.maxEnrollment}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            {course.lessons && course.lessons.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Week Navigation */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Weekly Lessons</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {course.lessons.map((lesson: any) => (
                          <Button
                            key={lesson.week}
                            variant={activeWeek === lesson.week ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveWeek(lesson.week)}
                          >
                            Week {lesson.week}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lesson Content */}
                <div className="lg:col-span-3">
                  {course.lessons
                    .filter((lesson: any) => lesson.week === activeWeek)
                    .map((lesson: any) => (
                      <Card key={lesson.week}>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            Week {lesson.week}: {lesson.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Topics */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Topics Covered</h4>
                            <div className="flex flex-wrap gap-2">
                              {lesson.topics.map((topic: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Resources with inline video */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Learning Materials</h4>
                            <div className="space-y-4">
                              {lesson.resources.map((resource: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 flex items-center space-x-2">
                                        <span>{resource.name}</span>
                                        {resource.type && (
                                          <Badge variant="outline" className="text-xs">
                                            {resource.type}
                                          </Badge>
                                        )}
                                        {isYouTubeUrl(resource.url) && (
                                          <Play className="w-4 h-4 text-red-600" />
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">{resource.url}</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-3 h-3 mr-1" />
                                          Open
                                        </a>
                                      </Button>
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={resource.url} download>
                                          <Download className="w-3 h-3 mr-1" />
                                          Download
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {/* Inline YouTube Video */}
                                  {isYouTubeUrl(resource.url) && (
                                    <div className="mt-3">
                                      <iframe
                                        width="100%"
                                        height="300"
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
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Lesson Plans Available</h3>
                  <p className="text-gray-600">Lesson plans will be available closer to the course start date.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Textbooks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Required Textbooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(course.textbooks || []).map((textbook: any, index: number) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">{textbook.title}</h4>
                      <p className="text-sm text-gray-600">{textbook.author}</p>
                      <p className="text-sm text-gray-500">{textbook.edition}</p>
                      {textbook.isbn && (
                        <p className="text-xs text-gray-400">ISBN: {textbook.isbn}</p>
                      )}
                    </div>
                  ))}
                  {(!course.textbooks || course.textbooks.length === 0) && (
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Introduction to Algorithms</h4>
                      <p className="text-sm text-gray-600">Cormen, Leiserson, Rivest, Stein</p>
                      <p className="text-sm text-gray-500">4th Edition</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Software Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Software Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {(course.softwareTools || ['Python 3.9+', 'Jupyter Notebook', 'Git/GitHub', 'VS Code']).map((tool: string, index: number) => (
                      <Badge key={index} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(course.courseLinks || []).map((link: any, index: number) => (
                    <Button key={index} variant="outline" className="w-full justify-start" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {link.name}
                      </a>
                    </Button>
                  ))}
                  {(!course.courseLinks || course.courseLinks.length === 0) && (
                    <>
                      <Button variant="outline" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Course Syllabus
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Assignment Portal
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Discussion Forum
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
