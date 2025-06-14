
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, BookOpen, Calendar } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const CoursesSection = () => {
  const { data, loading, error } = usePortalData();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  const courses = data?.courses || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Courses</h2>
        
        {courses.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <div className="text-xl mb-4">No courses available</div>
            <p>Course information will be updated for the upcoming semester.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-1">{course.title}</CardTitle>
                      <p className="text-lg font-medium text-blue-600 mb-2">{course.code}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Badge variant={course.level === 'Graduate' ? 'default' : 'secondary'}>
                          {course.level}
                        </Badge>
                        <span>{course.credits} Credits</span>
                        <span>{course.semester}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{course.description}</p>
                  
                  {/* Schedule Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Schedule</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{course.schedule.days}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.schedule.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{course.schedule.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollment || 0}/{course.maxEnrollment} enrolled</span>
                      </div>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Learning Outcomes
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="text-gray-700 text-sm">{outcome}</li>
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
