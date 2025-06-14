
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Calendar, ArrowRight, Book } from 'lucide-react';
import CourseDetail from './CourseDetail';

const CoursesSection = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const courses = [
    {
      id: 'cs101',
      title: 'Introduction to Computer Science',
      code: 'CS 101',
      level: 'Undergraduate',
      credits: 3,
      semester: 'Fall 2024',
      enrollment: 45,
      maxEnrollment: 50,
      description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
      learningOutcomes: [
        'Understand basic programming concepts and syntax',
        'Apply algorithmic thinking to problem-solving',
        'Implement basic data structures',
        'Analyze time and space complexity of algorithms'
      ],
      schedule: {
        days: 'MWF',
        time: '10:00 AM - 11:00 AM',
        location: 'Room 301, CS Building'
      },
      lessons: [
        {
          week: 1,
          title: 'Introduction to Programming',
          topics: ['Course Overview', 'Programming Fundamentals', 'Development Environment'],
          resources: [
            { name: 'Lecture Slides', url: '#' },
            { name: 'Lab Exercise 1', url: '#' },
            { name: 'Reading Assignment', url: '#' }
          ]
        },
        {
          week: 2,
          title: 'Variables and Data Types',
          topics: ['Primitive Data Types', 'Variables', 'Type Conversion'],
          resources: [
            { name: 'Lecture Slides', url: '#' },
            { name: 'Programming Assignment 1', url: '#' },
            { name: 'Practice Problems', url: '#' }
          ]
        },
        {
          week: 3,
          title: 'Control Structures',
          topics: ['Conditional Statements', 'Loops', 'Nested Structures'],
          resources: [
            { name: 'Lecture Slides', url: '#' },
            { name: 'Lab Exercise 2', url: '#' },
            { name: 'Quiz 1', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'cs301',
      title: 'Data Structures and Algorithms',
      code: 'CS 301',
      level: 'Undergraduate',
      credits: 4,
      semester: 'Spring 2024',
      enrollment: 38,
      maxEnrollment: 40,
      description: 'Advanced data structures and algorithm design techniques with emphasis on efficiency and optimization.',
      learningOutcomes: [
        'Implement advanced data structures (trees, graphs, heaps)',
        'Design and analyze efficient algorithms',
        'Apply dynamic programming techniques',
        'Understand graph algorithms and their applications'
      ],
      schedule: {
        days: 'TTh',
        time: '2:00 PM - 3:30 PM',
        location: 'Room 205, CS Building'
      },
      lessons: [
        {
          week: 1,
          title: 'Review of Basic Data Structures',
          topics: ['Arrays', 'Linked Lists', 'Stacks and Queues'],
          resources: [
            { name: 'Lecture Slides', url: '#' },
            { name: 'Implementation Examples', url: '#' },
            { name: 'Homework 1', url: '#' }
          ]
        },
        {
          week: 2,
          title: 'Trees and Tree Algorithms',
          topics: ['Binary Trees', 'BST Operations', 'Tree Traversals'],
          resources: [
            { name: 'Lecture Slides', url: '#' },
            { name: 'Tree Visualization Tool', url: '#' },
            { name: 'Programming Project 1', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'cs501',
      title: 'Machine Learning',
      code: 'CS 501',
      level: 'Graduate',
      credits: 3,
      semester: 'Fall 2024',
      enrollment: 25,
      maxEnrollment: 30,
      description: 'Comprehensive introduction to machine learning algorithms, theory, and applications.',
      learningOutcomes: [
        'Understand supervised and unsupervised learning paradigms',
        'Implement machine learning algorithms from scratch',
        'Apply ML techniques to real-world problems',
        'Evaluate and compare different ML models'
      ],
      schedule: {
        days: 'MW',
        time: '3:00 PM - 4:30 PM',
        location: 'Room 401, CS Building'
      },
      lessons: [
        {
          week: 1,
          title: 'Introduction to Machine Learning',
          topics: ['Types of Learning', 'Problem Formulation', 'Python Review'],
          resources: [
            { name: 'Course Introduction', url: '#' },
            { name: 'Python Setup Guide', url: '#' },
            { name: 'Dataset Overview', url: '#' }
          ]
        },
        {
          week: 2,
          title: 'Linear Regression',
          topics: ['Simple Linear Regression', 'Multiple Regression', 'Gradient Descent'],
          resources: [
            { name: 'Lecture Notes', url: '#' },
            { name: 'Jupyter Notebook', url: '#' },
            { name: 'Assignment 1', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'cs401',
      title: 'Software Engineering',
      code: 'CS 401',
      level: 'Undergraduate',
      credits: 3,
      semester: 'Spring 2024',
      enrollment: 42,
      maxEnrollment: 45,
      description: 'Principles and practices of software engineering including design patterns, testing, and project management.',
      learningOutcomes: [
        'Apply software engineering methodologies',
        'Design scalable software architectures',
        'Implement comprehensive testing strategies',
        'Manage software development projects'
      ],
      schedule: {
        days: 'MWF',
        time: '1:00 PM - 2:00 PM',
        location: 'Room 302, CS Building'
      },
      lessons: [
        {
          week: 1,
          title: 'Software Development Life Cycle',
          topics: ['SDLC Models', 'Agile Methodology', 'Project Planning'],
          resources: [
            { name: 'SDLC Overview', url: '#' },
            { name: 'Agile Manifesto', url: '#' },
            { name: 'Team Formation', url: '#' }
          ]
        }
      ]
    }
  ];

  if (selectedCourse) {
    return (
      <CourseDetail 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Courses Taught & Offered</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Click on any course tile to view detailed information including learning outcomes, lesson plans, and resources.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-l-4 border-l-blue-500"
              onClick={() => setSelectedCourse(course)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.code}
                      </Badge>
                      <Badge 
                        variant={course.level === 'Graduate' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4 flex-shrink-0" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{course.credits} Credits</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{course.semester}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollment}/{course.maxEnrollment} Students</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons.length}+ Lessons</span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Schedule</h4>
                  <p className="text-sm text-gray-600">
                    {course.schedule.days} • {course.schedule.time}
                  </p>
                  <p className="text-sm text-gray-600">{course.schedule.location}</p>
                </div>

                {/* Enrollment Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Enrollment</span>
                    <span>{course.enrollment}/{course.maxEnrollment}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(course.enrollment / course.maxEnrollment) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
