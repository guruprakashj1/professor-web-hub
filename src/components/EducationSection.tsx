
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const EducationSection = () => {
  const { data, loading, error } = usePortalData();

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

  const education = data?.education || [];
  const certifications = data?.certifications || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-light text-black mb-8 text-center">Education</h2>
        
        {/* Academic Timeline */}
        <div className="mb-12">
          <h3 className="text-2xl font-light text-gray-800 mb-6">Academic Background</h3>
          {education.length === 0 ? (
            <div className="text-center text-gray-700 py-8">
              <div className="text-xl mb-4 font-light">No education information available</div>
            </div>
          ) : (
            <div className="space-y-6">
              {education.map((edu) => (
                <Card key={edu.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {edu.universityLogo ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img 
                              src={edu.universityLogo} 
                              alt={`${edu.institution} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center hidden">
                              <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-xl text-black font-light">{edu.degree}</CardTitle>
                          <p className="text-lg font-light text-gray-800">{edu.institution}</p>
                        </div>
                      </div>
                      <div className="text-right text-gray-700">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-light">{edu.year}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-light">{edu.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {edu.description && (
                      <p className="text-gray-800 mb-4 font-light">{edu.description}</p>
                    )}
                    {edu.advisor && (
                      <p className="text-gray-700 mb-4 font-light">
                        <strong className="font-medium">Advisor:</strong> {edu.advisor}
                      </p>
                    )}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {edu.achievements.map((achievement, achIndex) => (
                          <span
                            key={achIndex}
                            className="px-3 py-1 bg-gray-100 text-black rounded border border-gray-200 text-sm font-light hover:bg-black hover:text-white transition-all duration-300"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-2xl font-light text-gray-800 mb-6">Professional Certifications</h3>
          {certifications.length === 0 ? (
            <div className="text-center text-gray-700 py-8">
              <div className="text-xl mb-4 font-light">No certifications available</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <Card key={cert.id} className="hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-black bg-white">
                  <CardContent className="p-6">
                    <h4 className="font-light text-black mb-2">{cert.title}</h4>
                    <p className="text-gray-700 text-sm mb-2 font-light">{cert.organization}</p>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-light">{cert.year}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
