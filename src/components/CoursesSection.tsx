
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, BookOpen, Calendar } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';
import CourseDetail from './CourseDetail';

const CoursesSection = () => {
  const { data, loading, error } = usePortalData();
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-light text-gray-900">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-black font-light">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  // Show course detail if a course is selected
  if (selectedCourse) {
    return (
      <CourseDetail 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
      />
    );
  }

  const courses = data?.courses || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-black mb-8 text-center">Courses</h2>
        
        {courses.length === 0 ? (
          <div className="text-center text-gray-700 py-16">
            <div className="text-xl mb-4 font-light">No courses available</div>
            <p className="font-light">Course information will be updated for the upcoming semester.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-black bg-white hover:scale-105"
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-black mb-1 font-light">{course.title}</CardTitle>
                      <p className="text-lg font-light text-gray-800 mb-2">{course.code}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <Badge 
                          variant={course.level === 'Graduate' ? 'default' : 'secondary'}
                          className={course.level === 'Graduate' ? 'bg-black text-white' : 'bg-gray-200 text-black'}
                        >
                          {course.level}
                        </Badge>
                        <span className="font-light">{course.credits} Credits</span>
                        <span className="font-light">{course.semester}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-800 leading-relaxed font-light">{course.description}</p>
                  
                  {/* Schedule Information */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="font-light text-black mb-2">Schedule</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-light">{course.schedule.days}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-light">{course.schedule.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-light">{course.schedule.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="font-light">{course.enrollment || 0}/{course.maxEnrollment} enrolled</span>
                      </div>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                    <div>
                      <h4 className="font-light text-black mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Learning Outcomes
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="text-gray-800 text-sm font-light">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesSection;
