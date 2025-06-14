
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, MapPin, Mail, GraduationCap } from 'lucide-react';

const OpeningsSection = () => {
  const openings = [
    {
      id: 1,
      title: 'Machine Learning Research Assistant',
      type: 'Graduate Research Position',
      level: 'PhD/MS',
      duration: 'Fall 2024 - Spring 2025',
      commitment: '20 hours/week',
      stipend: '$2,500/month',
      location: 'AI Research Lab, CS Building Room 401',
      description: 'Join our cutting-edge research team working on adaptive learning systems using deep learning techniques. This position offers hands-on experience with state-of-the-art ML frameworks and the opportunity to contribute to publications.',
      requirements: [
        'Strong background in machine learning and statistics',
        'Proficiency in Python, TensorFlow/PyTorch',
        'Experience with data preprocessing and analysis',
        'Good written and verbal communication skills',
        'Currently enrolled in CS graduate program'
      ],
      responsibilities: [
        'Develop and implement ML algorithms for educational applications',
        'Conduct literature reviews and experimental evaluations',
        'Collaborate on research paper writing and submission',
        'Present findings at lab meetings and conferences',
        'Mentor undergraduate students on related projects'
      ],
      benefits: [
        'Monthly stipend of $2,500',
        'Conference travel funding',
        'Access to high-performance computing resources',
        'Publication and patent opportunities',
        'Professional development workshops'
      ],
      applicationDeadline: 'September 15, 2024',
      status: 'Open',
      spotsAvailable: 2,
      contactEmail: 'professor@university.edu'
    },
    {
      id: 2,
      title: 'Blockchain Development Intern',
      type: 'Undergraduate Research',
      level: 'Junior/Senior',
      duration: 'Spring 2025',
      commitment: '15 hours/week',
      stipend: '$1,200/month',
      location: 'Blockchain Lab, CS Building Room 305',
      description: 'Work on developing a decentralized academic credential verification system using blockchain technology. Perfect opportunity for students interested in distributed systems and cryptography.',
      requirements: [
        'Junior or Senior standing in Computer Science',
        'Knowledge of blockchain fundamentals',
        'Experience with Solidity and Web3 development',
        'Understanding of cryptographic principles',
        'GPA of 3.5 or higher'
      ],
      responsibilities: [
        'Develop smart contracts for credential verification',
        'Build user interfaces for blockchain applications',
        'Test and debug blockchain implementations',
        'Document technical specifications',
        'Participate in code reviews and team meetings'
      ],
      benefits: [
        'Monthly stipend of $1,200',
        'Industry networking opportunities',
        'Blockchain certification support',
        'Flexible work schedule',
        'Letter of recommendation'
      ],
      applicationDeadline: 'November 30, 2024',
      status: 'Open',
      spotsAvailable: 1,
      contactEmail: 'professor@university.edu'
    },
    {
      id: 3,
      title: 'IoT Smart Campus Project Lead',
      type: 'Graduate Research Position',
      level: 'PhD',
      duration: '2 years (renewable)',
      commitment: 'Full-time',
      stipend: '$3,000/month + tuition waiver',
      location: 'IoT Research Center',
      description: 'Lead a multidisciplinary team working on IoT infrastructure for smart campus initiatives. This role involves both technical development and project management responsibilities.',
      requirements: [
        'PhD student in Computer Science or related field',
        'Experience with IoT systems and protocols',
        'Strong programming skills (Python, C++, JavaScript)',
        'Project management experience preferred',
        'Excellent leadership and communication skills'
      ],
      responsibilities: [
        'Lead technical development of IoT solutions',
        'Coordinate with facilities and IT departments',
        'Manage research team and project timelines',
        'Publish research findings in top-tier venues',
        'Represent project at academic and industry events'
      ],
      benefits: [
        'Full tuition waiver + $3,000 monthly stipend',
        'Health insurance coverage',
        'Professional development budget',
        'Leadership training opportunities',
        'Industry collaboration projects'
      ],
      applicationDeadline: 'October 1, 2024',
      status: 'Open',
      spotsAvailable: 1,
      contactEmail: 'professor@university.edu'
    },
    {
      id: 4,
      title: 'VR Education Content Creator',
      type: 'Undergraduate Position',
      level: 'Sophomore+',
      duration: 'Summer 2025',
      commitment: 'Full-time (40 hours/week)',
      stipend: '$4,000 total',
      location: 'VR Development Lab',
      description: 'Create immersive virtual reality content for STEM education. Work with Unity, 3D modeling tools, and educational design principles to develop engaging learning experiences.',
      requirements: [
        'Sophomore standing or higher',
        'Experience with Unity game engine',
        '3D modeling skills (Blender, Maya, or similar)',
        'Interest in educational technology',
        'Portfolio of previous work'
      ],
      responsibilities: [
        'Design and develop VR educational modules',
        'Create 3D models and animations',
        'Implement user interaction systems',
        'Test VR applications with student groups',
        'Document development processes'
      ],
      benefits: [
        'Summer stipend of $4,000',
        'VR equipment access',
        'Skills development in emerging technologies',
        'Portfolio development opportunities',
        'Potential for continued work during semester'
      ],
      applicationDeadline: 'February 15, 2025',
      status: 'Opening Soon',
      spotsAvailable: 2,
      contactEmail: 'professor@university.edu'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Opening Soon':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'PhD':
        return 'bg-purple-100 text-purple-800';
      case 'PhD/MS':
        return 'bg-indigo-100 text-indigo-800';
      case 'Junior/Senior':
        return 'bg-orange-100 text-orange-800';
      case 'Sophomore+':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Project Openings</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Join our research team! Explore exciting opportunities to contribute to cutting-edge projects in computer science and educational technology.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {openings.filter(o => o.status === 'Open').length}
              </div>
              <div className="text-sm text-gray-600">Open Positions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {openings.reduce((sum, opening) => sum + opening.spotsAvailable, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Spots</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {openings.filter(o => o.level.includes('PhD')).length}
              </div>
              <div className="text-sm text-gray-600">Graduate Positions</div>
            </CardContent>
          </Card>
        </div>

        {/* Openings List */}
        <div className="space-y-8">
          {openings.map((opening) => (
            <Card key={opening.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getStatusColor(opening.status)}>
                        {opening.status}
                      </Badge>
                      <Badge variant="outline" className={getLevelColor(opening.level)}>
                        {opening.level}
                      </Badge>
                      <Badge variant="outline">
                        {opening.spotsAvailable} spot{opening.spotsAvailable > 1 ? 's' : ''} available
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">
                      {opening.title}
                    </CardTitle>
                    <p className="text-lg text-blue-600 font-medium mb-3">{opening.type}</p>
                    <p className="text-gray-700 leading-relaxed">{opening.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Position Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-gray-600">{opening.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Commitment</p>
                      <p className="text-gray-600">{opening.commitment}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Stipend</p>
                      <p className="text-gray-600">{opening.stipend}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{opening.location}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2 text-sm">
                      {opening.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Responsibilities</h4>
                    <ul className="space-y-2 text-sm">
                      {opening.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      {opening.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Application Info */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Application Deadline</p>
                      <p className="text-gray-600">{opening.applicationDeadline}</p>
                    </div>
                  </div>
                  <Button 
                    className="flex items-center space-x-2"
                    disabled={opening.status === 'Closed'}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Apply Now</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">Interested in Applying?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-4">
              For questions about any of these positions or to discuss custom research opportunities, please don't hesitate to reach out.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Mail className="w-4 h-4" />
              <span>professor@university.edu</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Please include your CV, transcripts, and a brief statement of interest when applying.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpeningsSection;
