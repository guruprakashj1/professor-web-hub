
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react';
import { usePortalData } from '@/hooks/usePortalData';

const AboutSection = () => {
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

  const about = data?.about;

  if (!about) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">No about information available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Me</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  {about.profilePicture ? (
                    <img 
                      src={about.profilePicture} 
                      alt={about.name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {about.name ? about.name.charAt(0).toUpperCase() : 'P'}
                      </span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">{about.name || 'Professor Name'}</CardTitle>
                <p className="text-gray-600">{about.title || 'Academic Title'}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {about.contact?.email && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{about.contact.email}</span>
                  </div>
                )}
                {about.contact?.phone && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{about.contact.phone}</span>
                  </div>
                )}
                {about.contact?.office && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{about.contact.office}</span>
                  </div>
                )}
                {about.socialLinks && Object.entries(about.socialLinks).map(([platform, url]) => (
                  url && (
                    <div key={platform} className="flex items-center space-x-3 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm hover:text-blue-600 flex items-center space-x-1"
                      >
                        <span>{platform}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )
                ))}
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
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {about.bio || 'No biography available.'}
                </p>
              </CardContent>
            </Card>

            {about.expertise && about.expertise.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {about.expertise.map((expertise, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {expertise}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {about.contact?.officeHours && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {about.contact.officeHours}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
