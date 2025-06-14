
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, Calendar, Users, MapPin, BookOpen, ExternalLink, Download } from 'lucide-react';

interface CourseDetailProps {
  course: any;
  onBack: () => void;
}

const CourseDetail = ({ course, onBack }: CourseDetailProps) => {
  const [activeWeek, setActiveWeek] = useState(1);

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
                <p className="font-semibold text-gray-900">{course.enrollment}/{course.maxEnrollment}</p>
                <p className="text-sm text-gray-600">Enrolled</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{course.schedule.days}</p>
                <p className="text-sm text-gray-600">{course.schedule.time}</p>
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
                    {course.learningOutcomes.map((outcome: string, index: number) => (
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
                    <span>Schedule & Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Class Schedule</h4>
                    <p className="text-gray-600">{course.schedule.days} • {course.schedule.time}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">{course.schedule.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Enrollment Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(course.enrollment / course.maxEnrollment) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.enrollment}/{course.maxEnrollment}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
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

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Resources & Materials</h4>
                          <div className="space-y-3">
                            {lesson.resources.map((resource: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <BookOpen className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">{resource.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Open
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Textbooks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Required Textbooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Introduction to Algorithms</h4>
                    <p className="text-sm text-gray-600">Cormen, Leiserson, Rivest, Stein</p>
                    <p className="text-sm text-gray-500">4th Edition</p>
                  </div>
                </CardContent>
              </Card>

              {/* Software Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Software Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Badge variant="outline">Python 3.9+</Badge>
                    <Badge variant="outline">Jupyter Notebook</Badge>
                    <Badge variant="outline">Git/GitHub</Badge>
                    <Badge variant="outline">VS Code</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Course Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
