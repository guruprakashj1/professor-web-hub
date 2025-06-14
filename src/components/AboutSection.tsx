
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const AboutSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Me</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">P</span>
                </div>
                <CardTitle className="text-2xl">Professor Name</CardTitle>
                <p className="text-gray-600">Department of Computer Science</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">professor@university.edu</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">University Campus, Room 305</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">www.professorwebsite.com</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biography */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Biography</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  I am a passionate educator and researcher with over 15 years of experience in computer science and software engineering. My research interests include artificial intelligence, machine learning, and educational technology.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Throughout my career, I have supervised numerous graduate students, published extensively in peer-reviewed journals, and collaborated with industry partners to bridge the gap between academic research and practical applications.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  I believe in fostering an inclusive learning environment where students are encouraged to think critically, explore innovative solutions, and develop both technical and soft skills essential for their future careers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Research Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Artificial Intelligence',
                    'Machine Learning',
                    'Educational Technology',
                    'Software Engineering',
                    'Data Science',
                    'Computer Vision',
                    'Natural Language Processing'
                  ].map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Wednesday</span>
                    <span className="text-gray-600">2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Friday</span>
                    <span className="text-gray-600">10:00 AM - 12:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Or by appointment. Please email me to schedule a meeting outside of regular office hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
