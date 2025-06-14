
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const EducationSection = () => {
  const education = [
    {
      degree: 'Ph.D. in Computer Science',
      institution: 'Stanford University',
      year: '2008',
      location: 'Stanford, CA',
      description: 'Dissertation: "Advanced Machine Learning Algorithms for Educational Applications"',
      advisor: 'Dr. Jane Smith',
      achievements: ['Summa Cum Laude', 'Outstanding Dissertation Award', 'Teaching Excellence Award']
    },
    {
      degree: 'M.S. in Computer Science',
      institution: 'MIT',
      year: '2004',
      location: 'Cambridge, MA',
      description: 'Specialized in Artificial Intelligence and Human-Computer Interaction',
      achievements: ['Dean\'s List', 'Research Assistant Fellowship']
    },
    {
      degree: 'B.S. in Computer Engineering',
      institution: 'UC Berkeley',
      year: '2002',
      location: 'Berkeley, CA',
      description: 'Magna Cum Laude, Minor in Mathematics',
      achievements: ['Phi Beta Kappa', 'Outstanding Senior Project Award']
    }
  ];

  const certifications = [
    {
      title: 'Certified Data Scientist',
      organization: 'Data Science Council of America',
      year: '2020'
    },
    {
      title: 'AWS Certified Solutions Architect',
      organization: 'Amazon Web Services',
      year: '2019'
    },
    {
      title: 'Google Cloud Professional ML Engineer',
      organization: 'Google Cloud',
      year: '2021'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Education</h2>
        
        {/* Academic Timeline */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Academic Background</h3>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{edu.degree}</CardTitle>
                        <p className="text-lg font-medium text-blue-600">{edu.institution}</p>
                      </div>
                    </div>
                    <div className="text-right text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.year}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{edu.description}</p>
                  {edu.advisor && (
                    <p className="text-gray-600 mb-4">
                      <strong>Advisor:</strong> {edu.advisor}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {edu.achievements.map((achievement, achIndex) => (
                      <span
                        key={achIndex}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Professional Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{cert.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{cert.organization}</p>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{cert.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
